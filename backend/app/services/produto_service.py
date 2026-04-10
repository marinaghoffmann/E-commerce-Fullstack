import uuid
from typing import Optional

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.produto import Produto
from app.models.item_pedido import ItemPedido
from app.models.pedido import Pedido
from app.models.avaliacao_pedido import AvaliacaoPedido
from app.schemas.produto import ProdutoCreate, ProdutoUpdate, ProdutoDetalheResponse
from fastapi import HTTPException


def listar_produtos(
    db: Session,
    busca: Optional[str] = None,
    categoria: Optional[str] = None,
    pagina: int = 1,
    tamanho: int = 20,
):
    query = select(Produto)

    if busca:
        query = query.where(Produto.nome_produto.ilike(f"%{busca}%"))
    if categoria:
        query = query.where(Produto.categoria_produto.ilike(f"%{categoria}%"))

    total = db.scalar(select(func.count()).select_from(query.subquery()))
    offset = (pagina - 1) * tamanho
    produtos = db.scalars(query.offset(offset).limit(tamanho)).all()

    return {
        "total": total,
        "pagina": pagina,
        "tamanho": tamanho,
        "paginas": (total + tamanho - 1) // tamanho if total else 0,
        "items": produtos,
    }


def buscar_produto_por_id(db: Session, id_produto: str) -> Produto:
    produto = db.get(Produto, id_produto)
    if not produto:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    return produto


def obter_detalhe_produto(db: Session, id_produto: str) -> ProdutoDetalheResponse:
    produto = buscar_produto_por_id(db, id_produto)

    # Vendas: itens_pedidos com esse produto
    vendas_query = (
        select(func.count(ItemPedido.id_item), func.sum(ItemPedido.preco_BRL))
        .where(ItemPedido.id_produto == id_produto)
    )
    total_vendas, receita_total = db.execute(vendas_query).one()
    total_vendas = total_vendas or 0
    receita_total = float(receita_total or 0)

    # Avaliações via pedidos que contêm esse produto
    subq = (
        select(ItemPedido.id_pedido)
        .where(ItemPedido.id_produto == id_produto)
        .subquery()
    )
    aval_query = select(
        func.avg(AvaliacaoPedido.avaliacao),
        func.count(AvaliacaoPedido.id_avaliacao),
    ).where(AvaliacaoPedido.id_pedido.in_(select(subq)))

    media_aval, total_aval = db.execute(aval_query).one()

    return ProdutoDetalheResponse(
        **{c.name: getattr(produto, c.name) for c in Produto.__table__.columns},
        total_vendas=total_vendas,
        receita_total=receita_total,
        media_avaliacao=round(float(media_aval), 2) if media_aval else None,
        total_avaliacoes=total_aval or 0,
    )


def criar_produto(db: Session, dados: ProdutoCreate) -> Produto:
    produto = Produto(
        id_produto=uuid.uuid4().hex,
        **dados.model_dump(),
    )
    db.add(produto)
    db.commit()
    db.refresh(produto)
    return produto


def atualizar_produto(db: Session, id_produto: str, dados: ProdutoUpdate) -> Produto:
    produto = buscar_produto_por_id(db, id_produto)
    for campo, valor in dados.model_dump(exclude_unset=True).items():
        setattr(produto, campo, valor)
    db.commit()
    db.refresh(produto)
    return produto


def remover_produto(db: Session, id_produto: str) -> dict:
    produto = buscar_produto_por_id(db, id_produto)
    db.delete(produto)
    db.commit()
    return {"mensagem": f"Produto '{produto.nome_produto}' removido com sucesso"}


def listar_categorias(db: Session) -> list[str]:
    resultado = db.scalars(
        select(Produto.categoria_produto).distinct().order_by(Produto.categoria_produto)
    ).all()
    return resultado
