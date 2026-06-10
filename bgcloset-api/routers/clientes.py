from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import date
from decimal import Decimal

import models, schemas
from database import get_db
from routers.deps import get_usuario_atual
from routers.vendas import verificar_consignacoes_expiradas

router = APIRouter(prefix="/clientes", tags=["Clientes"])

@router.post("/", response_model=schemas.ClienteResponse)
def criar_cliente(
    cliente: schemas.ClienteCreate, 
    db: Session = Depends(get_db),
    usuario_logado: models.Usuario = Depends(get_usuario_atual)
):
    # Validações
    if len(cliente.nome.strip()) < 3:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="O nome do cliente deve conter pelo menos 3 caracteres."
        )

    if cliente.cpf:
        db_cliente = db.query(models.Cliente).filter(models.Cliente.cpf == cliente.cpf).first()
        if db_cliente:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, 
                detail="CPF já cadastrado."
            )

    novo_cliente = models.Cliente(**cliente.model_dump())
    db.add(novo_cliente)
    db.commit()
    db.refresh(novo_cliente)
    return novo_cliente

@router.get("/", response_model=List[schemas.ClienteResponse])
def listar_clientes(
    db: Session = Depends(get_db),
    usuario_logado: models.Usuario = Depends(get_usuario_atual)
):
    clientes = db.query(models.Cliente).all()
    return clientes

@router.get("/{cliente_id}", response_model=schemas.ClienteResponse)
def buscar_cliente_por_id(
    cliente_id: int, 
    db: Session = Depends(get_db),
    usuario_logado: models.Usuario = Depends(get_usuario_atual)
):
    cliente = db.query(models.Cliente).filter(models.Cliente.id == cliente_id).first()
    if not cliente:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cliente não encontrado.")
    return cliente

@router.put("/{cliente_id}", response_model=schemas.ClienteResponse)
def atualizar_cliente(
    cliente_id: int, 
    cliente_atualizado: schemas.ClienteCreate, 
    db: Session = Depends(get_db),
    usuario_logado: models.Usuario = Depends(get_usuario_atual)
):
    if usuario_logado.perfil != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="Apenas administradores podem atualizar clientes."
        )
        
    if len(cliente_atualizado.nome.strip()) < 3:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="O nome do cliente deve conter pelo menos 3 caracteres."
        )

    cliente = db.query(models.Cliente).filter(models.Cliente.id == cliente_id).first()
    if not cliente:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cliente não encontrado.")

    if cliente_atualizado.cpf and cliente_atualizado.cpf != cliente.cpf:
        db_cliente = db.query(models.Cliente).filter(models.Cliente.cpf == cliente_atualizado.cpf).first()
        if db_cliente:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, 
                detail="CPF já cadastrado para outro cliente."
            )
    
    for key, value in cliente_atualizado.model_dump(exclude_unset=True).items():
        setattr(cliente, key, value)
        
    db.commit()
    db.refresh(cliente)
    return cliente

@router.delete("/{cliente_id}")
def deletar_cliente(
    cliente_id: int, 
    db: Session = Depends(get_db),
    usuario_logado: models.Usuario = Depends(get_usuario_atual)
):
    if usuario_logado.perfil != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="Apenas administradores podem deletar clientes."
        )
        
    cliente = db.query(models.Cliente).filter(models.Cliente.id == cliente_id).first()
    if not cliente:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cliente não encontrado.")
        
    # Validar se há vendas associadas a este cliente
    venda_existente = db.query(models.Venda).filter(models.Venda.cliente_id == cliente_id).first()
    if venda_existente:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Não é possível excluir este cliente pois ele possui histórico de compras registradas no sistema."
        )

    db.delete(cliente)
    db.commit()
    return {"mensagem": "Cliente removido com sucesso."}

@router.post("/{cliente_id}/pagar-debito", response_model=schemas.ClienteResponse)
def pagar_debito(
    cliente_id: int,
    pagamento: schemas.PagamentoDebito,
    db: Session = Depends(get_db),
    usuario_logado: models.Usuario = Depends(get_usuario_atual)
):
    """
    Registra um pagamento de débito (crediário) para o cliente.
    Reduz o saldo devedor e cria um lançamento de Entrada no fluxo de caixa.
    """
    verificar_consignacoes_expiradas(db)
    cliente = db.query(models.Cliente).filter(models.Cliente.id == cliente_id).first()
    if not cliente:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cliente não encontrado."
        )

    if pagamento.valor_pago <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="O valor pago deve ser maior que zero."
        )

    valor_pago_decimal = Decimal(str(pagamento.valor_pago))
    if valor_pago_decimal > cliente.saldo_devedor:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"O valor pago (R$ {pagamento.valor_pago:.2f}) é maior que o saldo devedor do cliente (R$ {cliente.saldo_devedor:.2f})."
        )

    cliente.saldo_devedor -= valor_pago_decimal

    # Encontra a categoria "Entrada"
    cat_entrada = db.query(models.CategoriaFinanceira).filter(
        models.CategoriaFinanceira.tipo == "entrada"
    ).first()
    if not cat_entrada:
        cat_entrada = models.CategoriaFinanceira(nome="Entrada", tipo="entrada")
        db.add(cat_entrada)
        db.flush()

    # Cria movimentação financeira de entrada
    descricao_final = pagamento.descricao or f"Recebimento de Crediário - {cliente.nome}"
    nova_movimentacao = models.MovimentacaoFinanceira(
        categoria_id=cat_entrada.id,
        venda_id=None,
        tipo_movimentacao="entrada",
        valor=pagamento.valor_pago,
        data_ocorrencia=date.today(),
        descricao=descricao_final
    )
    db.add(nova_movimentacao)

    # Cria registro no histórico de pagamentos de débito
    historico = models.HistoricoPagamentoDebito(
        cliente_id=cliente.id,
        valor_pago=pagamento.valor_pago,
        data_pagamento=date.today(),
        metodo_pagamento=pagamento.metodo_pagamento,
        descricao=descricao_final
    )
    db.add(historico)

    db.commit()
    db.refresh(cliente)
    return cliente

@router.get("/{cliente_id}/pagamentos", response_model=List[schemas.HistoricoPagamentoDebitoResponse])
def obter_historico_pagamentos(
    cliente_id: int,
    db: Session = Depends(get_db),
    usuario_logado: models.Usuario = Depends(get_usuario_atual)
):
    """
    Retorna o histórico de pagamentos de débito (crediário) de um cliente.
    """
    cliente = db.query(models.Cliente).filter(models.Cliente.id == cliente_id).first()
    if not cliente:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cliente não encontrado."
        )
    
    pagamentos = db.query(models.HistoricoPagamentoDebito).filter(
        models.HistoricoPagamentoDebito.cliente_id == cliente_id
    ).order_by(models.HistoricoPagamentoDebito.data_pagamento.desc(), models.HistoricoPagamentoDebito.id.desc()).all()
    
    return pagamentos