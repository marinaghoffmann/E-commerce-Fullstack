import { useState, useEffect } from "react";
import { getProduto, getAvaliacoes, getVendas } from "../services/api";
import type { ProdutoDetalhe, AvaliacaoResumo, VendasResumo } from "../types";

export function useProduto(id: string) {
  const [produto, setProduto] = useState<ProdutoDetalhe | null>(null);
  const [avaliacoes, setAvaliacoes] = useState<AvaliacaoResumo | null>(null);
  const [vendas, setVendas] = useState<VendasResumo | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setErro(null);

    Promise.all([getProduto(id), getAvaliacoes(id), getVendas(id)])
      .then(([p, a, v]) => {
        setProduto(p);
        setAvaliacoes(a);
        setVendas(v);
      })
      .catch((e) => setErro(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  return { produto, avaliacoes, vendas, loading, erro };
}
