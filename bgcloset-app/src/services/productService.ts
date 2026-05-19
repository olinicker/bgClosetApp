import api from "./api";

import { type IProduct } from "../interfaces/Product";
import { productsMock } from "../mocks/productsMock";
export type CriarProdutoDTO = Omit<IProduct, "id">;
export type AtualizarProdutoDTO = Partial<CriarProdutoDTO>;

export const productService = {
  getAll: async (): Promise<IProduct[]> => {
    try {
      const response = await api.get<IProduct[]>("/produtos");
      return response.data;
    } catch (error) {
      console.warn(
        "Backend não conectado. Retornando dados simulados (mock).",
        error,
      );

      return productsMock;
    }
  },

  update: async (
    id: number,
    produtoData: AtualizarProdutoDTO,
  ): Promise<IProduct> => {
    try {
      const response = await api.put<IProduct>(`/produtos/${id}`, produtoData);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar produto com ID ${id}`, error);
      throw error;
    }
  },

  create: async (produtoData: CriarProdutoDTO): Promise<IProduct> => {
    try {
      const response = await api.post<IProduct>("/produtos", produtoData);
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
