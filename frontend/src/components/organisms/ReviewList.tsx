import React, { useState } from "react";
import { StarRating } from "../atoms/StarRating";
import { ReviewCard } from "../molecules/ReviewCard";
import type { AvaliacaoResumo } from "../../types";

interface ReviewListProps {
  resumo: AvaliacaoResumo;
}

export function ReviewList({ resumo }: ReviewListProps) {
  const [mostrarTodas, setMostrarTodas] = useState(false);
  const visiveis = mostrarTodas ? resumo.avaliacoes : resumo.avaliacoes.slice(0, 5);

  return (
    <div className="flex flex-col gap-4">
      {/* Resumo geral */}
      <div className="flex items-center gap-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="text-center">
          <p className="text-5xl font-bold text-gray-900">
            {resumo.media_avaliacao?.toFixed(1) ?? "—"}
          </p>
          <StarRating value={resumo.media_avaliacao ?? 0} size="md" />
          <p className="mt-1 text-xs text-gray-500">{resumo.total_avaliacoes} avaliações</p>
        </div>

        {/* Distribuição por estrela */}
        <div className="flex flex-1 flex-col gap-1">
          {[5, 4, 3, 2, 1].map((estrela) => {
            const qtd = resumo.distribuicao[estrela] ?? 0;
            const pct = resumo.total_avaliacoes > 0 ? (qtd / resumo.total_avaliacoes) * 100 : 0;
            return (
              <div key={estrela} className="flex items-center gap-2 text-xs text-gray-600">
                <span className="w-4 text-right">{estrela}</span>
                <span className="text-yellow-400">★</span>
                <div className="flex-1 overflow-hidden rounded-full bg-gray-200 h-2">
                  <div
                    className="h-2 rounded-full bg-yellow-400 transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-6 text-right">{qtd}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lista de avaliações */}
      {visiveis.length === 0 ? (
        <p className="text-center text-sm text-gray-400 py-4">Nenhuma avaliação com comentário</p>
      ) : (
        <>
          <div className="flex flex-col gap-3">
            {visiveis.map((av) => <ReviewCard key={av.id_avaliacao} avaliacao={av} />)}
          </div>
          {resumo.avaliacoes.length > 5 && (
            <button
              onClick={() => setMostrarTodas(!mostrarTodas)}
              className="text-sm text-indigo-600 hover:underline self-center"
            >
              {mostrarTodas ? "Ver menos" : `Ver todas (${resumo.avaliacoes.length})`}
            </button>
          )}
        </>
      )}
    </div>
  );
}
