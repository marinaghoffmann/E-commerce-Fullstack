import React from "react";
import { StarRating } from "../atoms/StarRating";
import type { Avaliacao } from "../../types";

interface ReviewCardProps {
  avaliacao: Avaliacao;
}

export function ReviewCard({ avaliacao }: ReviewCardProps) {
  const data = avaliacao.data_comentario
    ? new Date(avaliacao.data_comentario).toLocaleDateString("pt-BR")
    : null;

  return (
    <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
      <div className="mb-2 flex items-center justify-between">
        <StarRating value={avaliacao.avaliacao} size="sm" />
        {data && <span className="text-xs text-gray-400">{data}</span>}
      </div>
      {avaliacao.titulo_comentario && (
        <p className="mb-1 text-sm font-semibold text-gray-800">
          {avaliacao.titulo_comentario}
        </p>
      )}
      {avaliacao.comentario && (
        <p className="text-sm text-gray-600">{avaliacao.comentario}</p>
      )}
    </div>
  );
}
