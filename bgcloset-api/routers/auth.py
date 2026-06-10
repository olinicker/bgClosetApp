from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta

import models, schemas
from database import get_db
from core.security import verify_password, create_access_token
from core.config import settings

router = APIRouter(prefix="/auth", tags=["Autenticação"])

# Note que agora usamos OAuth2PasswordRequestForm no lugar do schemas.UsuarioLogin
@router.post("/login", response_model=schemas.Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    
    # O Swagger sempre vai mandar no campo 'username', mas o nosso sistema entende isso como o e-mail
    usuario = db.query(models.Usuario).filter(models.Usuario.email == form_data.username).first()
    
    # Verifica com a senha que veio do formulário
    if not usuario or not verify_password(form_data.password, usuario.senha):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="E-mail ou senha incorretos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    tempo_expiracao = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    token_acesso = create_access_token(
        data={
            "sub": usuario.email,
            "id": usuario.id,
            "nome": usuario.nome,
            "email": usuario.email,
            "perfil": usuario.perfil
        }, 
        expires_delta=tempo_expiracao
    )
    
    return {"access_token": token_acesso, "token_type": "bearer"}