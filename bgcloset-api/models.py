from sqlalchemy import Column, Integer, String, ForeignKey, Date, Numeric
from sqlalchemy.orm import relationship
from datetime import date
from database import Base

class Usuario(Base):
    __tablename__ = "usuarios"
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(100), nullable=False)
    email = Column(String(100), nullable=False, unique=True)
    senha = Column(String(255), nullable=False)
    perfil = Column(String(20), nullable=False, default='vendedor')

class Cliente(Base):
    __tablename__ = "clientes"
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(100), nullable=False)
    telefone = Column(String(20), nullable=True)
    email = Column(String(100), nullable=True)
    cpf = Column(String(20), nullable=True)
    saldo_devedor = Column(Numeric(10, 2), nullable=False, default=0.00)
    
    vendas = relationship("Venda", back_populates="cliente")

class Produto(Base):
    __tablename__ = "produtos"
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(150), nullable=False)
    categoria = Column(String(50), nullable=True)
    valor_custo = Column(Numeric(10, 2), nullable=False, default=0.00)
    preco_venda = Column(Numeric(10, 2), nullable=False)
    estoque_atual = Column(Integer, nullable=False, default=0)
    sku = Column(String(50), nullable=True)

class CategoriaFinanceira(Base):
    __tablename__ = "categorias_financeiras"
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(50), nullable=False)
    tipo = Column(String(20), nullable=False)

class CategoriaProduto(Base):
    __tablename__ = "categorias_produtos"
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(100), nullable=False, unique=True)


class Venda(Base):
    __tablename__ = "vendas"
    id = Column(Integer, primary_key=True, index=True)
    cliente_id = Column(Integer, ForeignKey("clientes.id"), nullable=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False)
    data_venda = Column(Date, default=date.today)
    valor_total = Column(Numeric(10, 2), nullable=False, default=0.00)
    metodo_pagamento = Column(String(50), nullable=False)
    status = Column(String(20), nullable=False, default='pendente')
    
    cliente = relationship("Cliente", back_populates="vendas")
    itens = relationship("ItemVenda", back_populates="venda")

class ItemVenda(Base):
    __tablename__ = "itens_venda"
    id = Column(Integer, primary_key=True, index=True)
    venda_id = Column(Integer, ForeignKey("vendas.id", ondelete="CASCADE"), nullable=False)
    produto_id = Column(Integer, ForeignKey("produtos.id"), nullable=False)
    quantidade = Column(Integer, nullable=False)
    preco_unitario = Column(Numeric(10, 2), nullable=False)
    status_item = Column(String(20), nullable=False, default='ativo')
    
    venda = relationship("Venda", back_populates="itens")
    produto = relationship("Produto")

class MovimentacaoFinanceira(Base):
    __tablename__ = "movimentacao_financeira"
    id = Column(Integer, primary_key=True, index=True)
    categoria_id = Column(Integer, ForeignKey("categorias_financeiras.id"), nullable=False)
    venda_id = Column(Integer, ForeignKey("vendas.id"), nullable=True)
    tipo_movimentacao = Column(String(20), nullable=False)
    valor = Column(Numeric(10, 2), nullable=False)
    data_ocorrencia = Column(Date, nullable=False)
    descricao = Column(String(255), nullable=True)

class HistoricoPagamentoDebito(Base):
    __tablename__ = "historico_pagamentos_debito"
    id = Column(Integer, primary_key=True, index=True)
    cliente_id = Column(Integer, ForeignKey("clientes.id", ondelete="CASCADE"), nullable=False)
    valor_pago = Column(Numeric(10, 2), nullable=False)
    data_pagamento = Column(Date, nullable=False, default=date.today)
    metodo_pagamento = Column(String(50), nullable=False)
    descricao = Column(String(255), nullable=True)

    cliente = relationship("Cliente")