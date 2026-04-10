from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.item_pedido import ItemPedido
from app.models.pedido import Pedido
from app.schemas.venda import VendasResumo, VendaResponse


def obter_vendas_produto(db: Session, id_produto: str) -> VendasResumo:
    itens = db.scalars(
        select(ItemPedido).where(ItemPedido.id_produto == id_produto)
    ).all()

    if not itens:
        return VendasResumo()

    receita_total = sum(i.preco_BRL for i in itens)
    ticket_medio = receita_total / len(itens)

    vendas_resp = []
    for item in itens:
        pedido = db.get(Pedido, item.id_pedido)
        vendas_resp.append(
            VendaResponse(
                id_pedido=item.id_pedido,
                id_item=item.id_item,
                preco_BRL=item.preco_BRL,
                preco_frete=item.preco_frete,
                status=pedido.status if pedido else None,
                pedido_compra_timestamp=pedido.pedido_compra_timestamp if pedido else None,
            )
        )

    return VendasResumo(
        total_vendas=len(itens),
        receita_total=round(receita_total, 2),
        ticket_medio=round(ticket_medio, 2),
        vendas=vendas_resp,
    )
