import React from "react";
import { ProductCard } from "../molecules/ProductCard";
import { Pagination } from "../molecules/Pagination";
import { Spinner } from "../atoms/Spinner";
import { ErrorMessage } from "../atoms/ErrorMessage";
import type { Produto, PaginatedResponse } from "../../types";

interface ProductListProps {
  data: PaginatedResponse<Produto> | null;
  loading: boolean;
  erro: string | null;
  pagina: number;
  onMudarPagina: (pagina: number) => void;
  onDeletar: (id: string) => void;
}

export function ProductList({
  data,
  loading,
  erro,
  pagina,
  onMudarPagina,
  onDeletar,
}: ProductListProps) {
  if (loading) return <Spinner label="Carregando produtos..." />;
  if (erro) return <ErrorMessage mensagem={erro} />;
  if (!data || data.items.length === 0) {
    return (
      <div className="py-16 text-center text-gray-400">
        <p className="text-4xl mb-3">📦</p>
        <p className="text-lg font-medium">Nenhum produto encontrado</p>
        <p className="text-sm">Tente buscar com outros termos</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm text-gray-500">
        {data.total} produto{data.total !== 1 ? "s" : ""} encontrado{data.total !== 1 ? "s" : ""}
      </p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {data.items.map((produto) => (
          <ProductCard key={produto.id_produto} produto={produto} onDeletar={onDeletar} />
        ))}
      </div>
      <Pagination pagina={pagina} totalPaginas={data.paginas} onMudar={onMudarPagina} />
    </div>
  );
}
