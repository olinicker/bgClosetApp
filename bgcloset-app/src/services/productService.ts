import api from "./api";

export interface Produto {
  id: number;
  nome: string;
  categoria?: string;
  preco_venda: number;
  estoque_atual: number;
  sku?: string;
}

export type CriarProdutoDTO = Omit<Produto, "id">;

export const productService = {
  getAll: async (): Promise<Produto[]> => {
    try {
      const response = await api.get<Produto[]>("/produtos");
      return response.data;
    } catch (error) {
      console.warn(
        "Backend não conectado. Retornando dados simulados (mock).",
        error,
      );

      return [
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
    }
  },

  create: async (produtoData: CriarProdutoDTO): Promise<Produto> => {
    try {
      const response = await api.post<Produto>("/produtos", produtoData);
      return response.data;
    } catch (error) {
      console.error("Erro ao criar produto", error);
      throw error;
    }
  },

  delete: async (id: number): Promise<void> => {
    try {
      await api.delete(`/produtos/${id}`);
    } catch (error) {
      console.error("Erro ao excluir produto", error);
      throw error;
    }
  },
};
