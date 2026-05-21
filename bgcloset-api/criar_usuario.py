from database import SessionLocal
import models
from core.security import get_password_hash

def criar_usuario_admin():
    db = SessionLocal()
    
    usuario_existente = db.query(models.Usuario).first()
    if usuario_existente:
        print("Já existe um usuário no banco de dados. Cancelando operação.")
        db.close()
        return

    novo_usuario = models.Usuario(
        nome="Administrador",
        email="admin@bgcloset.com",
        senha=get_password_hash("senha123"), 
        perfil="admin"
    )
    
    db.add(novo_usuario)
    db.commit()
    db.close()
    
    print("Usuário administrador criado com sucesso!")
    print("E-mail: admin@bgcloset.com")
    print("Senha: senha123")

if __name__ == "__main__":
    criar_usuario_admin()