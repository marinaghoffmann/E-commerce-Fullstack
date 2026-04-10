from typing import Optional
from datetime import datetime
from pydantic import BaseModel


class AvaliacaoResponse(BaseModel):
    id_avaliacao: str
    id_pedido: str
    avaliacao: int
    titulo_comentario: Optional[str] = None
    comentario: Optional[str] = None
    data_comentario: Optional[datetime] = None

    model_config = {"from_attributes": True}


class AvaliacaoResumo(BaseModel):
    media_avaliacao: Optional[float] = None
    total_avaliacoes: int = 0
    distribuicao: dict[int, int] = {}
    avaliacoes: list[AvaliacaoResponse] = []
