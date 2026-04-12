import React from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "../atoms/Badge";
import { StarRating } from "../atoms/StarRating";
import { Button } from "../atoms/Button";
import type { Produto } from "../../types";

interface ProductCardProps {
  produto: Produto & {
    media_avaliacao?: number | null;
    total_avaliacoes?: number;
  };
  onDeletar?: (id: string) => void;
}

export function ProductCard({ produto, onDeletar }: ProductCardProps) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-3 flex items-start justify-between gap-2">
        <h3
          className="cursor-pointer font-semibold text-gray-900 hover:text-indigo-600 transition-colors line-clamp-2"
          onClick={() => navigate(`/produtos/${produto.id_produto}`)}
        >
          {produto.nome_produto}
        </h3>
        <Badge variant="info">{produto.categoria_produto}</Badge>
      </div>

      {produto.media_avaliacao != null && (
        <div className="mb-3 flex items-center gap-2">
          <StarRating value={produto.media_avaliacao} size="sm" />
          <span className="text-xs text-gray-500">
            {produto.media_avaliacao.toFixed(1)} ({produto.total_avaliacoes} avaliações)
          </span>
        </div>
      )}

      <div className="mb-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
        {produto.peso_produto_gramas != null && (
          <span>⚖️ {produto.peso_produto_gramas}g</span>
        )}
        {produto.comprimento_centimetros != null && (
          <span>📐 {produto.comprimento_centimetros} × {produto.altura_centimetros} × {produto.largura_centimetros} cm</span>
        )}
      </div>

      <div className="mt-auto flex gap-2">
        <Button
          variant="primary"
          size="sm"
          className="flex-1"
          onClick={() => navigate(`/produtos/${produto.id_produto}`)}
        >
          Ver detalhes
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(`/produtos/${produto.id_produto}/editar`)}
        >
          ✏️
        </Button>
        {onDeletar && (
          <Button
            variant="danger"
            size="sm"
            onClick={() => onDeletar(produto.id_produto)}
          >
            🗑️
          </Button>
        )}
      </div>
    </div>
  );
}
