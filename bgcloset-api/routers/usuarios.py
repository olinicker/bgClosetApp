from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

import models, schemas
from database import get_db
from routers.deps import get_usuario_atual
from core.security import get_password_hash

router = APIRouter(prefix="/usuarios", tags=["Usuários"])

@router.post("/", response_model=schemas.UsuarioResponse)
def criar_usuario(
    usuario: schemas.UsuarioCreate,
    db: Session = Depends(get_db),
    usuario_logado: models.Usuario = Depends(get_usuario_atual)
):
    """
    Cadastra um novo usuário no sistema (ex: um novo vendedor).
    """
    # 1. Trava de segurança: opcional, mas garante que só o admin crie contas
    if usuario_logado.perfil != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="Apenas administradores podem cadastrar novos usuários."
        )

    # 2. Verifica se o e-mail já existe
    usuario_existente = db.query(models.Usuario).filter(models.Usuario.email == usuario.email).first()
    if usuario_existente:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Este e-mail já está em uso."
        )

    # 3. Cria o usuário com a senha criptografada (igual fizemos no script de seed)
    novo_usuario = models.Usuario(
        nome=usuario.nome,
        email=usuario.email,
        senha=get_password_hash(usuario.senha), 
        perfil=usuario.perfil
    )
    
    db.add(novo_usuario)
    db.commit()
    db.refresh(novo_usuario)
    
    return novo_usuario

@router.get("/", response_model=List[schemas.UsuarioResponse])
def listar_usuarios(
    db: Session = Depends(get_db),
    usuario_logado: models.Usuario = Depends(get_usuario_atual)
):
    """
    Lista todos os usuários cadastrados na loja.
    """
    return db.query(models.Usuario).all()