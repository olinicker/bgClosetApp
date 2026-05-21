from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from datetime import date

import models, schemas
from database import get_db
from routers.deps import get_usuario_atual
from services import estoque_service, financeiro_service

router = APIRouter(prefix="/vendas", tags=["Vendas"])

@router.post("/", response_model=schemas.VendaResponse)
def registrar_venda(
    venda: schemas.VendaCreate, 
    db: Session = Depends(get_db),
    usuario_logado: models.Usuario = Depends(get_usuario_atual) 
):
    nova_venda = models.Venda(
        cliente_id=venda.cliente_id,
        usuario_id=usuario_logado.id, 
        metodo_pagamento=venda.metodo_pagamento,
        data_venda=date.today(),
        status="concluida",
        valor_total=0 
    )
    db.add(nova_venda)
    db.flush() 

    valor_total_calculado = 0

    for item in venda.itens:
        estoque_service.baixar_estoque(db=db, produto_id=item.produto_id, quantidade_vendida=item.quantidade)
        
        produto_db = db.query(models.Produto).filter(models.Produto.id == item.produto_id).first()

        novo_item = models.ItemVenda(
            venda_id=nova_venda.id,
            produto_id=item.produto_id,
            quantidade=item.quantidade,
            preco_unitario=produto_db.preco_venda # Regra de ouro: nunca confie no preço enviado pelo front-end!
        )
        db.add(novo_item)
        
        valor_total_calculado += (produto_db.preco_venda * item.quantidade)

    nova_venda.valor_total = valor_total_calculado

    financeiro_service.registrar_movimentacao_venda(
        db=db, 
        venda_id=nova_venda.id, 
        valor_total=valor_total_calculado, 
        data_ocorrencia=nova_venda.data_venda
    )

    db.commit()
    db.refresh(nova_venda)

    return nova_venda

@router.get("/", response_model=List[schemas.VendaResponse])
def listar_vendas(
    db: Session = Depends(get_db),
    usuario_logado: models.Usuario = Depends(get_usuario_atual) # Só quem tem o token pode ver as vendas
):
    vendas = db.query(models.Venda).all()
    return vendas