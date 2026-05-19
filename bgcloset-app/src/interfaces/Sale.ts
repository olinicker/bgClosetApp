export interface ISaleItem {
  produto_id: number;
  nome_produto: string;
  quantidade: number;
  preco_unitario: number;
  subtotal: number;
}

export interface ISale {
  id: number;
  cliente_id?: number;
  usuario_id: number;
  valor_total: number;
  metodo_pagamento: string;
  data_venda: string;
  itens: ISaleItem[];
}

export interface CriarSaleDTO {
  cliente_id?: number;
  usuario_id: number;
  metodo_pagamento: string;
  itens: Omit<ISaleItem, "nome_produto" | "subtotal">[];
}
