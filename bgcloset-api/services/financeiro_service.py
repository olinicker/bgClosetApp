from sqlalchemy.orm import Session
from datetime import date
import models

def registrar_movimentacao_venda(db: Session, venda_id: int, valor_total: float, data_ocorrencia: date):
    """
    Registra a entrada de dinheiro no caixa sempre que uma venda for concluída.
    """
    
    categoria = db.query(models.CategoriaFinanceira).filter(models.CategoriaFinanceira.nome == "Vendas").first()
    
    if not categoria:
        categoria = models.CategoriaFinanceira(nome="Vendas", tipo="entrada")
        db.add(categoria)
        
        db.flush() 
        
    nova_movimentacao = models.MovimentacaoFinanceira(
        categoria_id=categoria.id,
        venda_id=venda_id,
        tipo_movimentacao="entrada",
        valor=valor_total,
        data_ocorrencia=data_ocorrencia,
        descricao=f"Receita referente à venda #{venda_id}"
    )
    
    db.add(nova_movimentacao)