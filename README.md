# Sistema de Gerenciamento de E-Commerce

Aplicação fullstack para gerenciamento de produtos de uma loja virtual.

## Stack
- **Frontend:** React 18 + TypeScript + Vite + Tailwind CSS + Axios
- **Backend:** FastAPI + SQLAlchemy + SQLite + Alembic + Pydantic v2

---

## Pré-requisitos

- Python 3.11+
- Node.js 18+

---

## 1. Backend

### Instalar dependências

```bash
cd backend
python -m venv .venv
source .venv/bin/activate        # Linux/Mac
# .venv\Scripts\activate         # Windows

pip install -r requirements.txt
```

### Configurar variáveis de ambiente

```bash
cp .env.example .env
# O padrão já usa SQLite local: DATABASE_URL=sqlite:///./database.db
```

### Executar migrations (criar as tabelas)

```bash
alembic upgrade head
```

### Popular o banco com os CSVs

Coloque os arquivos CSV na pasta `backend/data/`:
- `dim_consumidores.csv`
- `dim_produtos.csv`
- `dim_vendedores.csv`
- `fato_pedidos.csv`
- `fato_itens_pedidos.csv`
- `fato_avaliacoes_pedidos.csv`

```bash
python -m app.seed --data-dir ./data
```

### Iniciar o servidor

```bash
uvicorn app.main:app --reload
```

API disponível em: http://localhost:8000  
Documentação Swagger: http://localhost:8000/docs

---

## 2. Frontend

### Instalar dependências

```bash
cd frontend
npm install
```

### Iniciar o servidor de desenvolvimento

```bash
npm run dev
```

Frontend disponível em: http://localhost:5173

---

## Endpoints da API

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/produtos/` | Lista produtos (com busca e paginação) |
| GET | `/produtos/categorias` | Lista categorias disponíveis |
| GET | `/produtos/{id}` | Detalhes do produto com stats |
| POST | `/produtos/` | Criar produto |
| PUT | `/produtos/{id}` | Atualizar produto |
| DELETE | `/produtos/{id}` | Remover produto |
| GET | `/produtos/{id}/avaliacoes` | Avaliações do produto |
| GET | `/produtos/{id}/vendas` | Histórico de vendas |

### Parâmetros de busca (GET /produtos/)

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `busca` | string | Filtrar por nome do produto |
| `categoria` | string | Filtrar por categoria |
| `pagina` | int | Número da página (padrão: 1) |
| `tamanho` | int | Itens por página (padrão: 20, máx: 100) |

---

## Estrutura do Projeto

```
├── backend/
│   ├── app/
│   │   ├── models/          # Modelos SQLAlchemy
│   │   ├── schemas/         # Schemas Pydantic
│   │   ├── routers/         # Endpoints FastAPI
│   │   ├── services/        # Lógica de negócio
│   │   ├── database.py      # Configuração do banco
│   │   ├── config.py        # Configurações (.env)
│   │   ├── main.py          # Aplicação FastAPI
│   │   └── seed.py          # Script de população
│   ├── alembic/             # Migrations
│   └── requirements.txt
│
└── frontend/
    └── src/
        ├── components/
        │   ├── atoms/       # Button, Input, Badge, StarRating...
        │   ├── molecules/   # ProductCard, SearchBar, ReviewCard...
        │   └── organisms/   # ProductList, ProductForm, ReviewList
        ├── pages/           # CatalogPage, ProductDetailPage, ProductFormPage
        ├── hooks/           # useProdutos, useProduto
        ├── services/        # api.ts (Axios)
        └── types/           # Interfaces TypeScript
```
