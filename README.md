# Sistema de Gerenciamento de E-Commerce

Aplicação fullstack para gerenciamento de produtos de uma loja virtual. O sistema permite ao gerente da loja visualizar o catálogo de produtos, acessar o desempenho de vendas e avaliações de cada produto, além de adicionar, editar e remover produtos.

## Stack

- **Frontend:** React 18 + TypeScript + Vite + Tailwind CSS + Axios
- **Backend:** FastAPI + SQLAlchemy + SQLite + Alembic + Pydantic v2

---

## Pré-requisitos

- Python 3.11+
- Node.js 18+

---

## Como rodar o projeto

### 1. Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate        # Linux/Mac
# .venv\Scripts\activate         # Windows

pip install -r requirements.txt
```

Crie o arquivo de variáveis de ambiente:

```bash
cp .env.example .env
```

Execute as migrations para criar as tabelas:

```bash
python -m alembic upgrade head
```

O banco de dados já vem populado com os dados reais (`backend/database.db`). Caso queira popular manualmente, coloque os CSVs na pasta `backend/data/` e rode:

```bash
pip install pandas
python -m app.seed --data-dir ./data
```

Os arquivos esperados são:
- `dim_consumidores.csv`
- `dim_produtos.csv`
- `dim_vendedores.csv`
- `fat_pedidos.csv`
- `fat_itens_pedidos.csv`
- `fat_avaliacoes_pedidos.csv`

Inicie o servidor:

```bash
uvicorn app.main:app --reload
```

API disponível em: http://localhost:8000  
Documentação Swagger: http://localhost:8000/docs

---

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend disponível em: http://localhost:5173

---

## Funcionalidades

- Catálogo de produtos com busca por nome e filtro por categoria
- Paginação da listagem de produtos
- Página de detalhes com informações, vendas e avaliações de cada produto
- Média e distribuição de avaliações por estrela
- Histórico de vendas com receita total e ticket médio
- Cadastro, edição e remoção de produtos
- Tratamento de erros e estados de loading

---

## Endpoints da API

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/produtos/` | Lista produtos com busca e paginação |
| GET | `/produtos/categorias` | Lista categorias disponíveis |
| GET | `/produtos/{id}` | Detalhes do produto com stats |
| POST | `/produtos/` | Criar produto |
| PUT | `/produtos/{id}` | Atualizar produto |
| DELETE | `/produtos/{id}` | Remover produto |
| GET | `/produtos/{id}/avaliacoes` | Avaliações e média do produto |
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
│   ├── data/                # CSVs para seed (não versionados)
│   ├── database.db          # Banco populado com dados reais
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