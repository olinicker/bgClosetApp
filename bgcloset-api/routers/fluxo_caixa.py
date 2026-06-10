from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import date

import models, schemas
from database import get_db
from routers.deps import get_usuario_atual

router = APIRouter(prefix="/fluxo-caixa", tags=["Fluxo de Caixa"])

@router.get("/categorias", response_model=List[schemas.CategoriaFinanceiraResponse])
def listar_categorias(
    db: Session = Depends(get_db),
    usuario_logado: models.Usuario = Depends(get_usuario_atual)
):
    """
    Retorna a lista de todas as categorias financeiras cadastradas.
    """
    return db.query(models.CategoriaFinanceira).all()

@router.post("/categorias", response_model=schemas.CategoriaFinanceiraResponse)
def criar_categoria(
    categoria: schemas.CategoriaFinanceiraCreate,
    db: Session = Depends(get_db),
    usuario_logado: models.Usuario = Depends(get_usuario_atual)
):
    """
    Cadastra uma nova categoria financeira. Apenas administradores.
    """
    if usuario_logado.perfil != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Apenas administradores podem criar categorias financeiras."
        )

    # Validar se o nome está vazio ou curto
    if len(categoria.nome.strip()) < 3:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="O nome da categoria deve conter pelo menos 3 caracteres."
        )

    # Validar tipo (entrada ou saída)
    tipo_normalizado = categoria.tipo.strip().lower()
    if tipo_normalizado not in ["entrada", "saída", "saida"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="O tipo da categoria deve ser 'entrada' ou 'saída'."
        )
    # Normalizar para 'entrada' ou 'saída' conforme cadastrado nas sementes
    tipo_final = "entrada" if tipo_normalizado == "entrada" else "saída"

    # Verificar se já existe categoria com mesmo nome e tipo
    categoria_existente = db.query(models.CategoriaFinanceira).filter(
        models.CategoriaFinanceira.nome == categoria.nome.strip(),
        models.CategoriaFinanceira.tipo == tipo_final
    ).first()
    if categoria_existente:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Já existe uma categoria cadastrada com este nome e tipo."
        )

    nova_categoria = models.CategoriaFinanceira(
        nome=categoria.nome.strip(),
        tipo=tipo_final
    )
    db.add(nova_categoria)
    db.commit()
    db.refresh(nova_categoria)
    return nova_categoria

@router.put("/categorias/{categoria_id}", response_model=schemas.CategoriaFinanceiraResponse)
def atualizar_categoria(
    categoria_id: int,
    categoria_atualizada: schemas.CategoriaFinanceiraCreate,
    db: Session = Depends(get_db),
    usuario_logado: models.Usuario = Depends(get_usuario_atual)
):
    """
    Atualiza uma categoria financeira existente. Apenas administradores.
    """
    if usuario_logado.perfil != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Apenas administradores podem atualizar categorias financeiras."
        )

    if len(categoria_atualizada.nome.strip()) < 3:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="O nome da categoria deve conter pelo menos 3 caracteres."
        )

    tipo_normalizado = categoria_atualizada.tipo.strip().lower()
    if tipo_normalizado not in ["entrada", "saída", "saida"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="O tipo da categoria deve ser 'entrada' ou 'saída'."
        )
    tipo_final = "entrada" if tipo_normalizado == "entrada" else "saída"

    categoria = db.query(models.CategoriaFinanceira).filter(models.CategoriaFinanceira.id == categoria_id).first()
    if not categoria:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Categoria financeira não encontrada."
        )

    # Verificar se já existe outra categoria com o novo nome e tipo
    categoria_duplicada = db.query(models.CategoriaFinanceira).filter(
        models.CategoriaFinanceira.nome == categoria_atualizada.nome.strip(),
        models.CategoriaFinanceira.tipo == tipo_final,
        models.CategoriaFinanceira.id != categoria_id
    ).first()
    if categoria_duplicada:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Já existe outra categoria com este nome e tipo."
        )

    categoria.nome = categoria_atualizada.nome.strip()
    categoria.tipo = tipo_final
    db.commit()
    db.refresh(categoria)
    return categoria

@router.delete("/categorias/{categoria_id}")
def deletar_categoria(
    categoria_id: int,
    db: Session = Depends(get_db),
    usuario_logado: models.Usuario = Depends(get_usuario_atual)
):
    """
    Exclui uma categoria financeira. Apenas administradores.
    """
    if usuario_logado.perfil != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Apenas administradores podem deletar categorias financeiras."
        )

    categoria = db.query(models.CategoriaFinanceira).filter(models.CategoriaFinanceira.id == categoria_id).first()
    if not categoria:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Categoria financeira não encontrada."
        )

    # Verificar se a categoria está vinculada a algum lançamento financeiro
    movimentacao_vinculada = db.query(models.MovimentacaoFinanceira).filter(
        models.MovimentacaoFinanceira.categoria_id == categoria_id
    ).first()
    if movimentacao_vinculada:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Não é possível excluir esta categoria, pois ela já possui lançamentos financeiros associados."
        )

    db.delete(categoria)
    db.commit()
    return {"mensagem": "Categoria financeira excluída com sucesso."}

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
        models.MovimentacaoFinanceira.data_ocorrencia.desc(),
        models.MovimentacaoFinanceira.id.desc()
    ).all()
    
    return movimentacoes