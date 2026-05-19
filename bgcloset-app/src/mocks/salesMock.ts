import { type ISale } from "../interfaces/Sale";

export const vendasMock: ISale[] = [
  {
    id: 1,
    cliente_id: 1,
    usuario_id: 1,
    valor_total: 349.8,
    metodo_pagamento: "PIX",
    data_venda: new Date().toISOString(),
    itens: [
      {
        produto_id: 2,
        nome_produto: "Calça Jeans Premium",
        quantidade: 2,
        preco_unitario: 149.9,
        subtotal: 299.8,
      },
      {
        produto_id: 5,
        nome_produto: "Cinto de Couro",
        quantidade: 1,
        preco_unitario: 50.0,
        subtotal: 50.0,
      },
    ],
  },
];
