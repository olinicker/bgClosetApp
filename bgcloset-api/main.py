from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Importa as peças que criamos
from database import engine, Base
from routers import clientes, produtos, auth, vendas, fluxo_caixa, usuarios
from sqlalchemy import text

# Migração simples para garantir que a coluna saldo_devedor existe
try:
    with engine.connect() as conn:
        conn.execute(text("SELECT saldo_devedor FROM clientes LIMIT 1;"))
except Exception:
    try:
        with engine.begin() as conn:
            conn.execute(text("ALTER TABLE clientes ADD COLUMN saldo_devedor NUMERIC(10, 2) NOT NULL DEFAULT 0.00;"))
        print("Coluna 'saldo_devedor' adicionada à tabela 'clientes' com sucesso!")
    except Exception as e:
        print(f"Erro ao criar coluna saldo_devedor: {e}")

Base.metadata.create_all(bind=engine)

# Executa as sementes (seeds) para garantir dados iniciais funcionais
from criar_usuario import criar_usuario_admin
from criar_categorias_padrao import criar_categorias_padrao
try:
    criar_usuario_admin()
    criar_categorias_padrao()
except Exception as e:
    print(f"Erro ao executar sementes do banco: {e}")

app = FastAPI(title="BG Closet API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(clientes.router, prefix="/api")
app.include_router(produtos.router, prefix="/api")
app.include_router(auth.router, prefix="/api")
app.include_router(vendas.router, prefix="/api")
app.include_router(fluxo_caixa.router, prefix="/api")
app.include_router(usuarios.router, prefix="/api")