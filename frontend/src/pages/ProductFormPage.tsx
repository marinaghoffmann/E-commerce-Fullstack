import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useProduto } from "../hooks/useProduto";
import { createProduto, updateProduto } from "../services/api";
import { ProductForm } from "../components/organisms/ProductForm";
import { Spinner } from "../components/atoms/Spinner";
import { ErrorMessage } from "../components/atoms/ErrorMessage";
import type { ProdutoCreate } from "../types";

export function ProductFormPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const isEdicao = Boolean(id);

  const { produto, loading, erro } = useProduto(id ?? "");

  const handleSubmit = async (dados: ProdutoCreate) => {
    if (isEdicao && id) {
      await updateProduto(id, dados);
      navigate(`/produtos/${id}`);
    } else {
      const novo = await createProduto(dados);
      navigate(`/produtos/${novo.id_produto}`);
    }
  };

  if (isEdicao && loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-2xl items-center gap-4 px-6 py-4">
          <button
            onClick={() => navigate(isEdicao && id ? `/produtos/${id}` : "/")}
            className="text-gray-400 hover:text-gray-600"
          >
            ← Voltar
          </button>
          <h1 className="text-lg font-bold text-gray-900">
            {isEdicao ? "Editar Produto" : "Novo Produto"}
          </h1>
        </div>
      </header>
      <main className="mx-auto max-w-2xl px-6 py-8">
        {erro && <ErrorMessage mensagem={erro} />}
        <ProductForm
          inicial={produto ?? undefined}
          onSubmit={handleSubmit}
          onCancelar={() => navigate(isEdicao && id ? `/produtos/${id}` : "/")}
          titulo={isEdicao ? "Editar informações do produto" : "Cadastrar novo produto"}
        />
      </main>
    </div>
  );
}
