from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.produto import ProdutoCreate, ProdutoUpdate, ProdutoResponse, ProdutoDetalheResponse
from app.schemas.avaliacao import AvaliacaoResumo
from app.schemas.venda import VendasResumo
from app.services import produto_service, avaliacao_service, venda_service

router = APIRouter(prefix="/produtos", tags=["Produtos"])


@router.get("/", response_model=dict)
def listar_produtos(
    busca: Optional[str] = Query(None, description="Buscar por nome"),
    categoria: Optional[str] = Query(None, description="Filtrar por categoria"),
    pagina: int = Query(1, ge=1),
    tamanho: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    return produto_service.listar_produtos(db, busca, categoria, pagina, tamanho)


@router.get("/categorias", response_model=list[str])
def listar_categorias(db: Session = Depends(get_db)):
    return produto_service.listar_categorias(db)


@router.get("/{id_produto}", response_model=ProdutoDetalheResponse)
def detalhe_produto(id_produto: str, db: Session = Depends(get_db)):
    return produto_service.obter_detalhe_produto(db, id_produto)


@router.post("/", response_model=ProdutoResponse, status_code=201)
def criar_produto(dados: ProdutoCreate, db: Session = Depends(get_db)):
    return produto_service.criar_produto(db, dados)


@router.put("/{id_produto}", response_model=ProdutoResponse)
def atualizar_produto(id_produto: str, dados: ProdutoUpdate, db: Session = Depends(get_db)):
    return produto_service.atualizar_produto(db, id_produto, dados)


@router.delete("/{id_produto}")
def remover_produto(id_produto: str, db: Session = Depends(get_db)):
    return produto_service.remover_produto(db, id_produto)


@router.get("/{id_produto}/avaliacoes", response_model=AvaliacaoResumo)
def avaliacoes_produto(id_produto: str, db: Session = Depends(get_db)):
    produto_service.buscar_produto_por_id(db, id_produto)  # garante 404 se não existir
    return avaliacao_service.obter_avaliacoes_produto(db, id_produto)


@router.get("/{id_produto}/vendas", response_model=VendasResumo)
def vendas_produto(id_produto: str, db: Session = Depends(get_db)):
    produto_service.buscar_produto_por_id(db, id_produto)
    return venda_service.obter_vendas_produto(db, id_produto)
