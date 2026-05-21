from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import date

import models, schemas
from database import get_db
from routers.deps import get_usuario_atual

router = APIRouter(prefix="/fluxo-caixa", tags=["Fluxo de Caixa"])

@router.post("/registro-manual", response_model=schemas.MovimentacaoFinanceiraResponse)
def registrar_movimentacao_manual(
    movimentacao: schemas.MovimentacaoManualCreate, 
    db: Session = Depends(get_db),
    usuario_logado: models.Usuario = Depends(get_usuario_atual)
):
    """
    Rota para o administrador lançar manualmente uma Entrada ou Saída no caixa.
    """
    categoria = db.query(models.CategoriaFinanceira).filter(
        models.CategoriaFinanceira.id == movimentacao.categoria_id
    ).first()
    
    if not categoria:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Categoria financeira não encontrada."
        )
    
    nova_movimentacao = models.MovimentacaoFinanceira(
        categoria_id=categoria.id,
        venda_id=None, # Como é manual, não existe ID de venda atrelado
        tipo_movimentacao=categoria.tipo, # Puxa automaticamente se é 'entrada' ou 'saída' da categoria
        valor=movimentacao.valor,
        data_ocorrencia=movimentacao.data_ocorrencia or date.today(),
        descricao=movimentacao.descricao
    )
    
    db.add(nova_movimentacao)
    db.commit()
    db.refresh(nova_movimentacao)
    
    return nova_movimentacao

@router.get("/", response_model=List[schemas.MovimentacaoFinanceiraResponse])
def listar_fluxo_caixa(
    db: Session = Depends(get_db),
    usuario_logado: models.Usuario = Depends(get_usuario_atual)
):
    """
    Retorna o histórico completo do fluxo de caixa (tudo o que entrou e saiu).
    Útil para montar o extrato ou a tabela da tela de finanças.
    """
    movimentacoes = db.query(models.MovimentacaoFinanceira).order_by(
        models.MovimentacaoFinanceira.data_ocorrencia.desc()
    ).all()
    
    return movimentacoes