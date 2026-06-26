# bgClosetApp



Sistema de gerenciamento de closet conteinerizado, composto por frontend em React, API em FastAPI e banco de dados PostgreSQL, orquestrados via Docker Compose.



---



## Tecnologias



### Frontend (`bgcloset-app`)

| Tecnologia | Versão |

|---|---|

| React | 19 |

| TypeScript | 6 |

| Vite | 8 |

| React Router DOM | 7 |

| Styled Components | 6 |

| Axios | 1 |

| Lucide React | 1 |

| Nginx (produção) | alpine |



### Backend (`bgcloset-api`)

| Tecnologia | Versão |

|---|---|

| Python | 3.10 |

| FastAPI | latest |

| SQLAlchemy | latest |

| Pydantic / Pydantic Settings | latest |

| Uvicorn | (via fastapi[all]) |

| Passlib + Bcrypt | latest |

| Python-jose | latest |

| Psycopg2 | latest |



### Banco de dados

| Tecnologia | Versão |

|---|---|

| PostgreSQL | 15 (alpine) |



### Infraestrutura

- Docker & Docker Compose



---



## Pré-requisitos



Antes de começar, certifique-se de ter instalado na sua máquina:



- [Docker](https://docs.docker.com/get-docker/) (versão 20+)

- [Docker Compose](https://docs.docker.com/compose/install/) (versão 2+)

- [Git](https://git-scm.com/)



---



## Instalação e execução



### 1. Clonar o repositório



```bash

git clone https://github.com/olinicker/bgClosetApp.git

cd bgClosetApp

```



### 2. Configurar variáveis de ambiente



Copie o arquivo de exemplo e preencha os valores:



```bash

cp .env.example .env

```



Abra o arquivo `.env` e defina as variáveis:



```env

# Banco de dados

POSTGRES_USER=seu_usuario

POSTGRES_PASSWORD=sua_senha_segura

POSTGRES_DB=bgcloset



# String de conexão (deve corresponder aos valores acima)

DATABASE_URL=postgresql://seu_usuario:sua_senha_segura@db:5432/bgcloset



# Autenticação JWT

SECRET_KEY=sua_chave_secreta_aleatoria_e_longa

ALGORITHM=HS256

ACCESS_TOKEN_EXPIRE_MINUTES=30

```



> Para gerar uma `SECRET_KEY` segura, execute:

> ```bash

> python3 -c "import secrets; print(secrets.token_hex(32))"

> ```



### 3. Subir os containers



```bash

docker compose up --build

```



Na primeira execução, o Docker irá:

1. Fazer build da imagem do frontend (Node 20 → Nginx)

2. Fazer build da imagem da API (Python 3.10)

3. Baixar a imagem do PostgreSQL 15

4. Iniciar os três serviços em rede



### 4. Acessar a aplicação



| Serviço | URL |

|---|---|

| Frontend | http://localhost:3000 |

| API (FastAPI) | http://localhost:8000 |

| Documentação da API | http://localhost:8000/docs |

| Banco de dados | `localhost:5433` |



---



## Execução em modo desenvolvimento (sem Docker)



### Backend



```bash

cd bgcloset-api



# Criar e ativar ambiente virtual

python3 -m venv venv

source venv/bin/activate        # Linux/macOS

# venv\Scripts\activate         # Windows



# Instalar dependências

pip install -r requirements.txt



# Definir variáveis de ambiente locais (ajuste DATABASE_URL para apontar ao seu postgres local)

export DATABASE_URL=postgresql://usuario:senha@localhost:5432/bgcloset

export SECRET_KEY=sua_chave_secreta

export ALGORITHM=HS256

export ACCESS_TOKEN_EXPIRE_MINUTES=30



# Rodar a API

uvicorn main:app --reload --host 0.0.0.0 --port 8000

```



### Frontend



```bash

cd bgcloset-app



# Instalar dependências

npm install



# Rodar em modo desenvolvimento

npm run dev

```



O frontend estará disponível em `http://localhost:5173`.



---



## Comandos úteis



```bash

# Subir em background (sem travar o terminal)

docker compose up --build -d



# Ver logs de um serviço específico

docker compose logs -f api

docker compose logs -f frontend

docker compose logs -f db



# Parar todos os containers

docker compose down



# Parar e remover volumes (apaga os dados do banco)

docker compose down -v



# Rebuild de um único serviço

docker compose up --build api

```



---



## Estrutura do projeto



```

bgClosetApp/

├── bgcloset-api/          # Backend FastAPI

│   ├── core/

│   ├── routers/

│   ├── services/

│   ├── main.py

│   ├── models.py

│   ├── schemas.py

│   ├── database.py

│   ├── requirements.txt

│   └── Dockerfile

├── bgcloset-app/          # Frontend React + Vite

│   ├── src/

│   │   ├── components/

│   │   ├── pages/

│   │   ├── routes/

│   │   ├── services/

│   │   ├── interfaces/

│   │   └── styles/

│   ├── package.json

│   └── Dockerfile

├── docker-compose.yml

├── .env.example

└── README.md

```



---



## Portas utilizadas



| Container | Porta interna | Porta no host |

|---|---|---|

| frontend (Nginx) | 80 | 3000 |

| api (Uvicorn) | 8000 | 8000 |

| db (PostgreSQL) | 5432 | 5433 |