export interface IProduct {
  id?: number;
  nome: string;
  categoria: string;
  valor_custo: number;
  preco_venda: number;
  estoque_atual: number;
  sku?: string | null;
}