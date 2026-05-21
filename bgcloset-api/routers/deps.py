from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from sqlalchemy.orm import Session

from core.config import settings
from database import get_db
import models

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")

def get_usuario_atual(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credenciais_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Não foi possível validar as credenciais. Faça login novamente.",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        
        email: str = payload.get("sub")
        
        if email is None:
            raise credenciais_exception
            
    except JWTError:
        raise credenciais_exception

    usuario = db.query(models.Usuario).filter(models.Usuario.email == email).first()
    
    if usuario is None:
        raise credenciais_exception
        
    return usuario