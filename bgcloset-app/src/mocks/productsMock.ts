import { type IProduct } from "../interfaces/Product";

export const productsMock: IProduct[] = [
  {
    id: 1,
    nome: "Camisa Polo B&G",
    preco_venda: 89.9,
    estoque_atual: 15,
    sku: "CAM-POL-001",
  },
  {
    id: 2,
    nome: "Calça Jeans Premium",
    preco_venda: 149.9,
    estoque_atual: 8,
    sku: "CAL-JNS-002",
  },
  {
    id: 3,
    nome: "Perfume Essência Dourada",
    preco_venda: 199.5,
    estoque_atual: 5,
    sku: "PER-ESS-003",
  },
];
