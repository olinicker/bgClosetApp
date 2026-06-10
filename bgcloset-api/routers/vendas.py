from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, selectinload
from typing import List, Optional
from datetime import date, timedelta
from decimal import Decimal

import models, schemas
from database import get_db
from routers.deps import get_usuario_atual
from services import estoque_service, financeiro_service

router = APIRouter(prefix="/vendas", tags=["Vendas"])

def verificar_consignacoes_expiradas(db: Session):
    """
    Busca consignações com mais de 15 dias de criação, muda o status para 'concluida',
    define o método de pagamento como 'Crediário' e adiciona o valor ao saldo devedor do cliente.
    """
    limite_data = date.today() - timedelta(days=15)
    consignados_expirados = db.query(models.Venda).filter(
        models.Venda.status == "consignada",
        models.Venda.data_venda <= limite_data
    ).all()
    
    for venda in consignados_expirados:
        venda.status = "concluida"
        venda.metodo_pagamento = "Crediário"
        
        # Se tiver cliente cadastrado, adiciona ao saldo devedor dele
        if venda.cliente_id:
            cliente = db.query(models.Cliente).filter(models.Cliente.id == venda.cliente_id).first()
            if cliente:
                cliente.saldo_devedor += Decimal(str(venda.valor_total))
                
    if consignados_expirados:
        db.commit()

@router.post("/", response_model=schemas.VendaResponse)
def registrar_venda(
    venda: schemas.VendaCreate, 
    db: Session = Depends(get_db),
    usuario_logado: models.Usuario = Depends(get_usuario_atual) 
):
    status_venda = venda.status if venda.status in ["concluida", "consignada"] else "concluida"
    
    if status_venda == "consignada":
        if not venda.cliente_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Para consignações, é obrigatório selecionar um cliente."
            )
        cliente_db = db.query(models.Cliente).filter(models.Cliente.id == venda.cliente_id).first()
        if not cliente_db:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Cliente não encontrado."
            )

    nova_venda = models.Venda(
        cliente_id=venda.cliente_id,
        usuario_id=usuario_logado.id, 
        metodo_pagamento=venda.metodo_pagamento,
        data_venda=date.today(),
        status=status_venda,
        valor_total=Decimal('0.00') 
    )
    db.add(nova_venda)
    db.flush() 

    valor_total_calculado = Decimal('0.00')

    for item in venda.itens:
        estoque_service.baixar_estoque(db=db, produto_id=item.produto_id, quantidade_vendida=item.quantidade)
        
        produto_db = db.query(models.Produto).filter(models.Produto.id == item.produto_id).first()

        preco_efetivo = Decimal(str(item.preco_unitario)) if item.preco_unitario > 0 else produto_db.preco_venda

        novo_item = models.ItemVenda(
            venda_id=nova_venda.id,
            produto_id=item.produto_id,
            quantidade=item.quantidade,
            preco_unitario=preco_efetivo
        )
        db.add(novo_item)
        
        valor_total_calculado += (preco_efetivo * item.quantidade)

    nova_venda.valor_total = valor_total_calculado

    if status_venda != "consignada":
        if venda.metodo_pagamento == "Crediário":
            if not venda.cliente_id:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Para vendas a prazo (Crediário), é obrigatório selecionar um cliente."
                )
            cliente = db.query(models.Cliente).filter(models.Cliente.id == venda.cliente_id).first()
            if not cliente:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Cliente não encontrado."
                )
            cliente.saldo_devedor += valor_total_calculado
        else:
            financeiro_service.registrar_movimentacao_venda(
                db=db, 
                venda_id=nova_venda.id, 
                valor_total=float(valor_total_calculado), 
                data_ocorrencia=nova_venda.data_venda
            )

    db.commit()
    db.refresh(nova_venda)

    return nova_venda

@router.get("/", response_model=List[schemas.VendaResponse])
def listar_vendas(
    data_inicio: Optional[date] = None,
    data_fim: Optional[date] = None,
    cliente_id: Optional[int] = None,
    metodo_pagamento: Optional[str] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    usuario_logado: models.Usuario = Depends(get_usuario_atual)
):
    verificar_consignacoes_expiradas(db)
    query = db.query(models.Venda).options(selectinload(models.Venda.itens))
    
    if data_inicio:
        query = query.filter(models.Venda.data_venda >= data_inicio)
    if data_fim:
        query = query.filter(models.Venda.data_venda <= data_fim)
    if cliente_id:
        query = query.filter(models.Venda.cliente_id == cliente_id)
    if metodo_pagamento:
        query = query.filter(models.Venda.metodo_pagamento == metodo_pagamento)
    if status:
        query = query.filter(models.Venda.status == status)
        
    # Ordena para trazer os lançamentos mais recentes primeiro
    vendas = query.order_by(models.Venda.data_venda.desc(), models.Venda.id.desc()).all()
    return vendas

@router.post("/{venda_id}/cancelar", response_model=schemas.VendaResponse)
def cancelar_venda(
    venda_id: int,
    db: Session = Depends(get_db),
    usuario_logado: models.Usuario = Depends(get_usuario_atual)
):
    """
    Cancela uma venda realizada. Devolve os itens ao estoque e
    remove/estorna o lançamento financeiro associado.
    Apenas administradores podem cancelar vendas.
    """
    verificar_consignacoes_expiradas(db)
    if usuario_logado.perfil != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Apenas administradores podem cancelar vendas."
        )

    venda = db.query(models.Venda).filter(models.Venda.id == venda_id).first()
    if not venda:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Venda não encontrada."
        )

    if venda.status == "cancelada":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Esta venda já está cancelada."
        )

    # Validação do período de cancelamento (limite de 15 dias)
    prazo_limite_dias = 15
    dias_decorridos = (date.today() - venda.data_venda).days
    if dias_decorridos > prazo_limite_dias:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Não é possível cancelar esta venda. O prazo limite de {prazo_limite_dias} dias para cancelamento expirou ({dias_decorridos} dias decorridos)."
        )

    # Devolve itens ao estoque
    for item in venda.itens:
        estoque_service.devolver_estoque(db=db, produto_id=item.produto_id, quantidade_devolvida=item.quantidade)

    # Remove lançamentos financeiros vinculados
    db.query(models.MovimentacaoFinanceira).filter(models.MovimentacaoFinanceira.venda_id == venda.id).delete()

    # Se a venda foi no crediário, remove o saldo devedor do cliente
    if venda.metodo_pagamento == "Crediário" and venda.cliente_id:
        cliente = db.query(models.Cliente).filter(models.Cliente.id == venda.cliente_id).first()
        if cliente:
            cliente.saldo_devedor = max(Decimal('0'), cliente.saldo_devedor - venda.valor_total)

    # Atualiza o status da venda
    venda.status = "cancelada"
    
    db.commit()
    db.refresh(venda)
    return venda

@router.post("/{venda_id}/acerto-consignado", response_model=schemas.VendaResponse)
def acerto_consignado(
    venda_id: int,
    acerto: schemas.AcertoConsignado,
    db: Session = Depends(get_db),
    usuario_logado: models.Usuario = Depends(get_usuario_atual)
):
    """
    Realiza o acerto de uma venda consignada. Devolve as peças devolvidas
    ao estoque, mantém apenas as vendidas e gera o lançamento financeiro correspondente.
    """
    verificar_consignacoes_expiradas(db)
    venda = db.query(models.Venda).filter(models.Venda.id == venda_id).first()
    if not venda:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Venda não encontrada."
        )
    if venda.status != "consignada":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Esta venda não é do tipo Consignado ou já foi finalizada."
        )

    # Mapear devoluções para busca rápida
    devolucoes = {item.produto_id: item.quantidade_devolvida for item in acerto.itens_devolvidos}

    valor_total_final = Decimal('0.00')

    for item in list(venda.itens):
        qtd_devolvida = devolucoes.get(item.produto_id, 0)
        
        if qtd_devolvida > item.quantidade:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Quantidade devolvida ({qtd_devolvida}) maior do que a quantidade levada ({item.quantidade}) para o produto #{item.produto_id}."
            )

        if qtd_devolvida > 0:
            estoque_service.devolver_estoque(db=db, produto_id=item.produto_id, quantidade_devolvida=qtd_devolvida)
            item.quantidade -= qtd_devolvida

        if item.quantidade == 0:
            db.delete(item)
        else:
            valor_total_final += (item.preco_unitario * item.quantidade)

    venda.valor_total = valor_total_final
    venda.metodo_pagamento = acerto.metodo_pagamento
    venda.data_venda = date.today()
    
    if valor_total_final > 0:
        venda.status = "concluida"
        if acerto.metodo_pagamento == "Crediário":
            if not venda.cliente_id:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Para acerto a prazo (Crediário), é obrigatório selecionar um cliente."
                )
            cliente = db.query(models.Cliente).filter(models.Cliente.id == venda.cliente_id).first()
            if not cliente:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Cliente não encontrado."
                )
            cliente.saldo_devedor += valor_total_final
        else:
            financeiro_service.registrar_movimentacao_venda(
                db=db,
                venda_id=venda.id,
                valor_total=float(valor_total_final),
                data_ocorrencia=date.today()
            )
    else:
        venda.status = "cancelada"

    db.commit()
    db.refresh(venda)
    return venda