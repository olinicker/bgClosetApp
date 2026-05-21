from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

import models, schemas
from database import get_db

router = APIRouter(prefix="/clientes", tags=["Clientes"])

@router.post("/", response_model=schemas.ClienteResponse)
def criar_cliente(cliente: schemas.ClienteCreate, db: Session = Depends(get_db)):
    if cliente.cpf:
        db_cliente = db.query(models.Cliente).filter(models.Cliente.cpf == cliente.cpf).first()
        if db_cliente:
            raise HTTPException(status_code=400, detail="CPF já cadastrado.")

    novo_cliente = models.Cliente(**cliente.model_dump())
    
    db.add(novo_cliente)
    db.commit()
    db.refresh(novo_cliente)
    
    return novo_cliente

@router.get("/", response_model=List[schemas.ClienteResponse])
def listar_clientes(db: Session = Depends(get_db)):
    clientes = db.query(models.Cliente).all()
    return clientes

@router.get("/{cliente_id}", response_model=schemas.ClienteResponse)
def buscar_cliente_por_id(cliente_id: int, db: Session = Depends(get_db)):
    cliente = db.query(models.Cliente).filter(models.Cliente.id == cliente_id).first()
    if not cliente:
        raise HTTPException(status_code=404, detail="Cliente não encontrado.")
    return cliente

@router.put("/{cliente_id}", response_model=schemas.ClienteResponse)
def atualizar_cliente(cliente_id: int, cliente_atualizado: schemas.ClienteCreate, db: Session = Depends(get_db)):
    cliente = db.query(models.Cliente).filter(models.Cliente.id == cliente_id).first()
    
    if not cliente:
        raise HTTPException(status_code=404, detail="Cliente não encontrado.")
    
    for key, value in cliente_atualizado.model_dump(exclude_unset=True).items():
        setattr(cliente, key, value)
        
    db.commit()
    db.refresh(cliente)
    return cliente

@router.delete("/{cliente_id}")
def deletar_cliente(cliente_id: int, db: Session = Depends(get_db)):
    cliente = db.query(models.Cliente).filter(models.Cliente.id == cliente_id).first()
    
    if not cliente:
        raise HTTPException(status_code=404, detail="Cliente não encontrado.")
    
    db.delete(cliente)
    db.commit()
    return {"mensagem": "Cliente removido com sucesso."}