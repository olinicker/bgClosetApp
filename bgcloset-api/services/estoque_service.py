from sqlalchemy.orm import Session
from fastapi import HTTPException, status
import models

def baixar_estoque(db: Session, produto_id: int, quantidade_vendida: int):
    """
    Verifica se há estoque suficiente e, se houver, subtrai a quantidade vendida.
    """
    produto = db.query(models.Produto).filter(models.Produto.id == produto_id).first()
    
    if not produto:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail=f"Produto ID {produto_id} não encontrado."
        )
        
    if produto.estoque_atual < quantidade_vendida:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail=f"Estoque insuficiente para o produto '{produto.nome}'. Disponível: {produto.estoque_atual}, Solicitado: {quantidade_vendida}."
        )
        
    produto.estoque_atual -= quantidade_vendida
    
