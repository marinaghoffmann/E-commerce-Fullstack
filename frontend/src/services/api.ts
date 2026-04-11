import axios from "axios";
import type {
  Produto,
  ProdutoDetalhe,
  ProdutoCreate,
  AvaliacaoResumo,
  VendasResumo,
  PaginatedResponse,
} from "../types";

const api = axios.create({
  baseURL: "http://localhost:8000",
  headers: { "Content-Type": "application/json" },
});

// Interceptor de erros global
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const mensagem =
      error.response?.data?.detail || "Ocorreu um erro inesperado";
    return Promise.reject(new Error(mensagem));
  }
);

// --- Produtos ---
export const getProdutos = (params: {
  busca?: string;
  categoria?: string;
  pagina?: number;
  tamanho?: number;
}) =>
  api
    .get<PaginatedResponse<Produto>>("/produtos/", { params })
    .then((r) => r.data);

export const getProduto = (id: string) =>
  api.get<ProdutoDetalhe>(`/produtos/${id}`).then((r) => r.data);

export const createProduto = (dados: ProdutoCreate) =>
  api.post<Produto>("/produtos/", dados).then((r) => r.data);

export const updateProduto = (id: string, dados: Partial<ProdutoCreate>) =>
  api.put<Produto>(`/produtos/${id}`, dados).then((r) => r.data);

export const deleteProduto = (id: string) =>
  api.delete(`/produtos/${id}`).then((r) => r.data);

export const getCategorias = () =>
  api.get<string[]>("/produtos/categorias").then((r) => r.data);

// --- Avaliações e Vendas ---
export const getAvaliacoes = (id: string) =>
  api.get<AvaliacaoResumo>(`/produtos/${id}/avaliacoes`).then((r) => r.data);

export const getVendas = (id: string) =>
  api.get<VendasResumo>(`/produtos/${id}/vendas`).then((r) => r.data);

export default api;
