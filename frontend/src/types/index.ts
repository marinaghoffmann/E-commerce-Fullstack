export interface Produto {
  id_produto: string;
  nome_produto: string;
  categoria_produto: string;
  peso_produto_gramas: number | null;
  comprimento_centimetros: number | null;
  altura_centimetros: number | null;
  largura_centimetros: number | null;
}

export interface ProdutoDetalhe extends Produto {
  total_vendas: number;
  receita_total: number;
  media_avaliacao: number | null;
  total_avaliacoes: number;
}

export interface ProdutoCreate {
  nome_produto: string;
  categoria_produto: string;
  peso_produto_gramas?: number | null;
  comprimento_centimetros?: number | null;
  altura_centimetros?: number | null;
  largura_centimetros?: number | null;
}

export interface Avaliacao {
  id_avaliacao: string;
  id_pedido: string;
  avaliacao: number;
  titulo_comentario: string | null;
  comentario: string | null;
  data_comentario: string | null;
}

export interface AvaliacaoResumo {
  media_avaliacao: number | null;
  total_avaliacoes: number;
  distribuicao: Record<string, number>;
  avaliacoes: Avaliacao[];
}

export interface Venda {
  id_pedido: string;
  id_item: number;
  preco_BRL: number;
  preco_frete: number;
  status: string | null;
  pedido_compra_timestamp: string | null;
}

export interface VendasResumo {
  total_vendas: number;
  receita_total: number;
  ticket_medio: number;
  vendas: Venda[];
}

export interface PaginatedResponse<T> {
  total: number;
  pagina: number;
  tamanho: number;
  paginas: number;
  items: T[];
}
