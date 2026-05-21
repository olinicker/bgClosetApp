from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Importa as peças que criamos
from database import engine, Base
from routers import clientes, produtos, auth, vendas, fluxo_caixa, usuarios
Base.metadata.create_all(bind=engine)

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