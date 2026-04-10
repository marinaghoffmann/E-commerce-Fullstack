from sqlalchemy import select, func
from sqlalchemy.orm import Session

from app.models.avaliacao_pedido import AvaliacaoPedido
from app.models.item_pedido import ItemPedido
from app.schemas.avaliacao import AvaliacaoResumo, AvaliacaoResponse


def obter_avaliacoes_produto(db: Session, id_produto: str) -> AvaliacaoResumo:
    # Pegar os pedidos que têm esse produto
    subq = (
        select(ItemPedido.id_pedido)
        .where(ItemPedido.id_produto == id_produto)
        .subquery()
    )

    avaliacoes = db.scalars(
        select(AvaliacaoPedido).where(AvaliacaoPedido.id_pedido.in_(select(subq)))
    ).all()

    if not avaliacoes:
        return AvaliacaoResumo()

    notas = [a.avaliacao for a in avaliacoes]
    media = round(sum(notas) / len(notas), 2)

    distribuicao = {i: notas.count(i) for i in range(1, 6)}

    return AvaliacaoResumo(
        media_avaliacao=media,
        total_avaliacoes=len(avaliacoes),
        distribuicao=distribuicao,
        avaliacoes=[AvaliacaoResponse.model_validate(a) for a in avaliacoes],
    )
