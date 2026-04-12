import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProduto } from "../hooks/useProduto";
import { Spinner } from "../components/atoms/Spinner";
import { ErrorMessage } from "../components/atoms/ErrorMessage";
import { Badge } from "../components/atoms/Badge";
import { Button } from "../components/atoms/Button";
import { StatCard } from "../components/molecules/StatCard";
import { ReviewList } from "../components/organisms/ReviewList";
import { deleteProduto } from "../services/api";

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { produto, avaliacoes, vendas, loading, erro } = useProduto(id!);
  const [abaAtiva, setAbaAtiva] = useState<"info" | "avaliacoes" | "vendas">("info");
  const [deletando, setDeletando] = useState(false);

  const handleDeletar = async () => {
    if (!produto) return;
    if (!confirm(`Remover "${produto.nome_produto}"?`)) return;
    setDeletando(true);
    try {
      await deleteProduto(produto.id_produto);
      navigate("/");
    } catch (e: any) {
      alert(e.message);
      setDeletando(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><Spinner /></div>;
  if (erro) return <div className="min-h-screen bg-gray-50 p-8"><ErrorMessage mensagem={erro} /></div>;
  if (!produto) return null;

  const abas = [
    { key: "info", label: "Informações" },
    { key: "avaliacoes", label: `Avaliações (${avaliacoes?.total_avaliacoes ?? 0})` },
    { key: "vendas", label: `Vendas (${vendas?.total_vendas ?? 0})` },
  ] as const;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-4xl items-center gap-4 px-6 py-4">
          <button onClick={() => navigate("/")} className="text-gray-400 hover:text-gray-600">
            ← Voltar
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-gray-900 line-clamp-1">{produto.nome_produto}</h1>
            <Badge variant="info">{produto.categoria_produto}</Badge>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => navigate(`/produtos/${id}/editar`)}>
              ✏️ Editar
            </Button>
            <Button variant="danger" size="sm" loading={deletando} onClick={handleDeletar}>
              🗑️ Remover
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-8 flex flex-col gap-6">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard
            label="Total Vendas"
            value={produto.total_vendas}
            icon="🛒"
          />
          <StatCard
            label="Receita Total"
            value={`R$ ${produto.receita_total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
            icon="💰"
          />
          <StatCard
            label="Média Avaliação"
            value={produto.media_avaliacao != null ? `${produto.media_avaliacao.toFixed(1)} ★` : "—"}
            icon="⭐"
            sub={`${produto.total_avaliacoes} avaliações`}
          />
          <StatCard
            label="Ticket Médio"
            value={vendas?.ticket_medio
              ? `R$ ${vendas.ticket_medio.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
              : "—"}
            icon="🏷️"
          />
        </div>

        {/* Abas */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="flex border-b border-gray-200">
            {abas.map((aba) => (
              <button
                key={aba.key}
                onClick={() => setAbaAtiva(aba.key)}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                  abaAtiva === aba.key
                    ? "border-b-2 border-indigo-600 text-indigo-600"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                {aba.label}
              </button>
            ))}
          </div>

          <div className="p-6">
            {/* Aba: Informações */}
            {abaAtiva === "info" && (
              <div className="grid grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-3">
                {[
                  { label: "ID do Produto", value: produto.id_produto },
                  { label: "Categoria", value: produto.categoria_produto },
                  { label: "Peso", value: produto.peso_produto_gramas != null ? `${produto.peso_produto_gramas} g` : "—" },
                  { label: "Comprimento", value: produto.comprimento_centimetros != null ? `${produto.comprimento_centimetros} cm` : "—" },
                  { label: "Altura", value: produto.altura_centimetros != null ? `${produto.altura_centimetros} cm` : "—" },
                  { label: "Largura", value: produto.largura_centimetros != null ? `${produto.largura_centimetros} cm` : "—" },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400">{label}</p>
                    <p className="mt-0.5 text-sm text-gray-900 break-all">{value}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Aba: Avaliações */}
            {abaAtiva === "avaliacoes" && avaliacoes && (
              <ReviewList resumo={avaliacoes} />
            )}

            {/* Aba: Vendas */}
            {abaAtiva === "vendas" && vendas && (
              <div className="flex flex-col gap-3">
                {vendas.vendas.length === 0 ? (
                  <p className="text-center text-sm text-gray-400 py-4">Nenhuma venda registrada</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-100 text-left text-xs uppercase tracking-wide text-gray-400">
                          <th className="pb-2 pr-4">Pedido</th>
                          <th className="pb-2 pr-4">Status</th>
                          <th className="pb-2 pr-4">Preço</th>
                          <th className="pb-2 pr-4">Frete</th>
                          <th className="pb-2">Data</th>
                        </tr>
                      </thead>
                      <tbody>
                        {vendas.vendas.slice(0, 50).map((v) => (
                          <tr key={`${v.id_pedido}-${v.id_item}`} className="border-b border-gray-50">
                            <td className="py-2 pr-4 font-mono text-xs text-gray-500">
                              {v.id_pedido.slice(0, 8)}…
                            </td>
                            <td className="py-2 pr-4">
                              <Badge variant={v.status === "delivered" ? "success" : "default"}>
                                {v.status ?? "—"}
                              </Badge>
                            </td>
                            <td className="py-2 pr-4 text-gray-900">
                              R$ {v.preco_BRL.toFixed(2)}
                            </td>
                            <td className="py-2 pr-4 text-gray-500">
                              R$ {v.preco_frete.toFixed(2)}
                            </td>
                            <td className="py-2 text-gray-400 text-xs">
                              {v.pedido_compra_timestamp
                                ? new Date(v.pedido_compra_timestamp).toLocaleDateString("pt-BR")
                                : "—"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {vendas.vendas.length > 50 && (
                      <p className="mt-2 text-center text-xs text-gray-400">
                        Exibindo 50 de {vendas.vendas.length} vendas
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
