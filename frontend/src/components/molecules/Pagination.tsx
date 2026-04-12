import React from "react";
import { Button } from "../atoms/Button";

interface PaginationProps {
  pagina: number;
  totalPaginas: number;
  onMudar: (pagina: number) => void;
}

export function Pagination({ pagina, totalPaginas, onMudar }: PaginationProps) {
  if (totalPaginas <= 1) return null;

  const pages = Array.from({ length: Math.min(totalPaginas, 7) }, (_, i) => {
    if (totalPaginas <= 7) return i + 1;
    if (pagina <= 4) return i + 1;
    if (pagina >= totalPaginas - 3) return totalPaginas - 6 + i;
    return pagina - 3 + i;
  });

  return (
    <div className="flex items-center justify-center gap-1">
      <Button
        variant="ghost"
        size="sm"
        disabled={pagina === 1}
        onClick={() => onMudar(pagina - 1)}
      >
        ← Anterior
      </Button>
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onMudar(p)}
          className={`h-8 w-8 rounded-lg text-sm font-medium transition-colors ${
            p === pagina
              ? "bg-indigo-600 text-white"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          {p}
        </button>
      ))}
      <Button
        variant="ghost"
        size="sm"
        disabled={pagina === totalPaginas}
        onClick={() => onMudar(pagina + 1)}
      >
        Próxima →
      </Button>
    </div>
  );
}
