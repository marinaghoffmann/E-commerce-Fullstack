from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class VendaResponse(BaseModel):
    id_pedido: str
    id_item: int
    preco_BRL: float
    preco_frete: float
    status: Optional[str] = None
    pedido_compra_timestamp: Optional[datetime] = None

    model_config = {"from_attributes": True}


class VendasResumo(BaseModel):
    total_vendas: int = 0
    receita_total: float = 0.0
    ticket_medio: float = 0.0
    vendas: list[VendaResponse] = []
