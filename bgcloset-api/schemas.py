from pydantic import BaseModel, ConfigDict, EmailStr
from typing import List, Optional
from datetime import date

# ================= USUÁRIOS (LOGIN) =================
class UsuarioLogin(BaseModel):
    email: EmailStr
    senha: str

class Token(BaseModel):
    access_token: str
    token_type: str

class UsuarioBase(BaseModel):
    nome: str
    email: EmailStr
    perfil: str = "vendedor" # Se não mandar nada, o padrão é ser vendedor

class UsuarioCreate(UsuarioBase):
    senha: str

class UsuarioResponse(UsuarioBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

# ================= CLIENTES =================
class ClienteBase(BaseModel):
    nome: str
    telefone: Optional[str] = None
    email: Optional[EmailStr] = None
    cpf: Optional[str] = None

class ClienteCreate(ClienteBase):
    pass

class ClienteResponse(ClienteBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

# ================= PRODUTOS =================
class ProdutoBase(BaseModel):
    nome: str
    categoria: Optional[str] = None
    valor_custo: float = 0.0
    preco_venda: float
    estoque_atual: int
    sku: Optional[str] = None

class ProdutoCreate(ProdutoBase):
    pass

class ProdutoResponse(ProdutoBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

# ================= VENDAS =================
class ItemVendaCreate(BaseModel):
    produto_id: int
    quantidade: int
    preco_unitario: float

class ItemVendaResponse(BaseModel):
    produto_id: int
    quantidade: int
    preco_unitario: float
    model_config = ConfigDict(from_attributes=True)

class VendaCreate(BaseModel):
    cliente_id: Optional[int] = None
    usuario_id: int
    metodo_pagamento: str
    itens: List[ItemVendaCreate]

class VendaResponse(BaseModel):
    id: int
    cliente_id: Optional[int] = None
    usuario_id: int
    valor_total: float
    metodo_pagamento: str
    data_venda: date
    status: str
    itens: List[ItemVendaResponse]
    model_config = ConfigDict(from_attributes=True)

# ================= CATEGORIAS FINANCEIRAS =================
class CategoriaFinanceiraBase(BaseModel):
    nome: str
    tipo: str # O front-end deve enviar 'entrada' ou 'saída'

class CategoriaFinanceiraCreate(CategoriaFinanceiraBase):
    pass

class CategoriaFinanceiraResponse(CategoriaFinanceiraBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

# ================= MOVIMENTAÇÃO FINANCEIRA =================
class MovimentacaoManualCreate(BaseModel):
    categoria_id: int
    valor: float
    data_ocorrencia: Optional[date] = None
    descricao: Optional[str] = None

class MovimentacaoFinanceiraResponse(BaseModel):
    id: int
    categoria_id: int
    venda_id: Optional[int] = None
    tipo_movimentacao: str
    valor: float
    data_ocorrencia: date
    descricao: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)