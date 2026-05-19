export interface IProduct {
  id: number;
  nome: string;
  categoria?: string;
  preco_venda: number;
  estoque_atual: number;
  sku?: string;
}
