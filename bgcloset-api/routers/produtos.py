from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

import models, schemas
from database import get_db
from routers.deps import get_usuario_atual

router = APIRouter(prefix="/produtos", tags=["Produtos"])

@router.post("/", response_model=schemas.ProdutoResponse)
def criar_produto(
    produto: schemas.ProdutoCreate, 
    db: Session = Depends(get_db),
    usuario_logado: models.Usuario = Depends(get_usuario_atual)
):
    if usuario_logado.perfil != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="Apenas administradores podem cadastrar produtos."
        )
    
    # Validações de Regra de Negócio
    if produto.preco_venda <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="O preço de venda deve ser maior que zero."
        )
    if produto.estoque_atual < 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="O estoque inicial não pode ser negativo."
        )
        
    novo_produto = models.Produto(**produto.model_dump())
    db.add(novo_produto)
    db.commit()
    db.refresh(novo_produto)
    return novo_produto

@router.get("/", response_model=List[schemas.ProdutoResponse])
def listar_produtos(
    categoria: Optional[str] = None,
    db: Session = Depends(get_db),
    usuario_logado: models.Usuario = Depends(get_usuario_atual)
):
    query = db.query(models.Produto)
    if categoria:
        query = query.filter(models.Produto.categoria == categoria)
    produtos = query.all()
    return produtos

@router.get("/categorias", response_model=List[schemas.CategoriaProdutoResponse])
def listar_categorias_produtos(
    db: Session = Depends(get_db),
    usuario_logado: models.Usuario = Depends(get_usuario_atual)
):
    """
    Retorna a lista de todas as categorias de produtos.
    """
    return db.query(models.CategoriaProduto).order_by(models.CategoriaProduto.nome).all()

@router.post("/categorias", response_model=schemas.CategoriaProdutoResponse)
def criar_categoria_produto(
    categoria: schemas.CategoriaProdutoCreate,
    db: Session = Depends(get_db),
    usuario_logado: models.Usuario = Depends(get_usuario_atual)
):
    """
    Cadastra uma nova categoria de produto. Apenas administradores.
    """
    if usuario_logado.perfil != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Apenas administradores podem cadastrar categorias de produtos."
        )
    
    nome_limpo = categoria.nome.strip()
    if len(nome_limpo) < 2:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="O nome da categoria deve conter pelo menos 2 caracteres."
        )
        
    categoria_existente = db.query(models.CategoriaProduto).filter(
        models.CategoriaProduto.nome.ilike(nome_limpo)
    ).first()
    if categoria_existente:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Já existe uma categoria de produto com este nome."
        )
        
    nova_categoria = models.CategoriaProduto(nome=nome_limpo)
    db.add(nova_categoria)
    db.commit()
    db.refresh(nova_categoria)
    return nova_categoria

@router.delete("/categorias/{categoria_id}")
def deletar_categoria_produto(
    categoria_id: int,
    db: Session = Depends(get_db),
    usuario_logado: models.Usuario = Depends(get_usuario_atual)
):
    """
    Remove uma categoria de produto. Apenas administradores.
    Não permite remover categorias com produtos vinculados.
    """
    if usuario_logado.perfil != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Apenas administradores podem remover categorias de produtos."
        )
        
    categoria = db.query(models.CategoriaProduto).filter(models.CategoriaProduto.id == categoria_id).first()
    if not categoria:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Categoria de produto não encontrada."
        )
        
    # Validar se há produtos vinculados a esta categoria
    produto_vinculado = db.query(models.Produto).filter(models.Produto.categoria == categoria.nome).first()
    if produto_vinculado:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Não é possível remover esta categoria pois existem produtos vinculados a ela."
        )
        
    db.delete(categoria)
    db.commit()
    return {"mensagem": "Categoria de produto removida com sucesso."}

@router.get("/{produto_id}", response_model=schemas.ProdutoResponse)
def buscar_produto_por_id(
    produto_id: int, 
    db: Session = Depends(get_db),
    usuario_logado: models.Usuario = Depends(get_usuario_atual)
):
    produto = db.query(models.Produto).filter(models.Produto.id == produto_id).first()
    if not produto:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Produto não encontrado.")
    return produto

@router.put("/{produto_id}", response_model=schemas.ProdutoResponse)
def atualizar_produto(
    produto_id: int, 
    produto_atualizado: schemas.ProdutoCreate, 
    db: Session = Depends(get_db),
    usuario_logado: models.Usuario = Depends(get_usuario_atual)
):
    if usuario_logado.perfil != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="Apenas administradores podem atualizar produtos."
        )
        
    if produto_atualizado.preco_venda <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="O preço de venda deve ser maior que zero."
        )
    if produto_atualizado.estoque_atual < 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="O estoque não pode ser negativo."
        )
        
    produto = db.query(models.Produto).filter(models.Produto.id == produto_id).first()
    if not produto:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Produto não encontrado.")
        
    for key, value in produto_atualizado.model_dump(exclude_unset=True).items():
        setattr(produto, key, value)
        
    db.commit()
    db.refresh(produto)
    return produto

@router.delete("/{produto_id}")
def deletar_produto(
    produto_id: int, 
    db: Session = Depends(get_db),
    usuario_logado: models.Usuario = Depends(get_usuario_atual)
):
    if usuario_logado.perfil != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="Apenas administradores podem deletar produtos."
        )
        
    produto = db.query(models.Produto).filter(models.Produto.id == produto_id).first()
    if not produto:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Produto não encontrado.")
        
    # Validar se há itens de venda associados a este produto
    item_venda_existente = db.query(models.ItemVenda).filter(models.ItemVenda.produto_id == produto_id).first()
    if item_venda_existente:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Não é possível excluir este produto pois ele possui histórico de vendas registradas. Considere zerar o seu estoque."
        )

    db.delete(produto)
    db.commit()
    return {"mensagem": "Produto removido com sucesso."}