import { useState, useEffect, useCallback } from "react";
import { getProdutos, getCategorias } from "../services/api";
import type { Produto, PaginatedResponse } from "../types";

export function useProdutos() {
  const [data, setData] = useState<PaginatedResponse<Produto> | null>(null);
  const [categorias, setCategorias] = useState<string[]>([]);
  const [busca, setBusca] = useState("");
  const [categoria, setCategoria] = useState("");
  const [pagina, setPagina] = useState(1);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const carregar = useCallback(async () => {
    setLoading(true);
    setErro(null);
    try {
      const resultado = await getProdutos({
        busca: busca || undefined,
        categoria: categoria || undefined,
        pagina,
        tamanho: 20,
      });
      setData(resultado);
    } catch (e: any) {
      setErro(e.message);
    } finally {
      setLoading(false);
    }
  }, [busca, categoria, pagina]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  useEffect(() => {
    getCategorias().then(setCategorias).catch(() => {});
  }, []);

  const pesquisar = (valor: string) => {
    setBusca(valor);
    setPagina(1);
  };

  const filtrarCategoria = (valor: string) => {
    setCategoria(valor);
    setPagina(1);
  };

  return {
    data,
    categorias,
    busca,
    categoria,
    pagina,
    loading,
    erro,
    pesquisar,
    filtrarCategoria,
    setPagina,
    recarregar: carregar,
  };
}
