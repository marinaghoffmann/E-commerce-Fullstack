import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProdutos } from "../hooks/useProdutos";
import { deleteProduto } from "../services/api";
import { SearchBar } from "../components/molecules/SearchBar";
import { ProductList } from "../components/organisms/ProductList";
import { Button } from "../components/atoms/Button";

export function CatalogPage() {
  const navigate = useNavigate();
  const {
    data, categorias, busca, categoria, pagina,
    loading, erro, pesquisar, filtrarCategoria, setPagina, recarregar,
  } = useProdutos();

  const [deletando, setDeletando] = useState<string | null>(null);

  const handleDeletar = async (id: string) => {
    const produto = data?.items.find((p) => p.id_produto === id);
    if (!produto) return;
    if (!confirm(`Remover "${produto.nome_produto}"?`)) return;
    setDeletando(id);
    try {
      await deleteProduto(id);
      recarregar();
    } catch (e: any) {
      alert(e.message);
    } finally {
      setDeletando(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">🛒 Gerenciamento de Produtos</h1>
            <p className="text-sm text-gray-500">Catálogo da loja</p>
          </div>
          <Button onClick={() => navigate("/produtos/novo")}>
            + Novo Produto
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Filtros */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex-1">
            <SearchBar valor={busca} onBuscar={pesquisar} />
          </div>
          <select
            value={categoria}
            onChange={(e) => filtrarCategoria(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Todas as categorias</option>
            {categorias.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <ProductList
          data={data}
          loading={loading}
          erro={erro}
          pagina={pagina}
          onMudarPagina={setPagina}
          onDeletar={handleDeletar}
        />
      </main>
    </div>
  );
}
