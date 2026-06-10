import api from "./api";
import { type IProduct } from "../interfaces/Product";

export type CriarProdutoDTO = Omit<IProduct, "id">;
export type AtualizarProdutoDTO = Partial<CriarProdutoDTO>;

export interface IProductCategory {
  id?: number;
  nome: string;
}

export type CriarCategoriaProdutoDTO = Omit<IProductCategory, "id">;

export const productService = {
  getAll: async (categoria?: string): Promise<IProduct[]> => {
    // Retorna os dados reais da API. Se der erro, ele quebra aqui.
    const response = await api.get<IProduct[]>("/produtos", {
      params: categoria ? { categoria } : undefined
    });
    return response.data;
  },

  update: async (id: number, produtoData: AtualizarProdutoDTO): Promise<IProduct> => {
    const response = await api.put<IProduct>(`/produtos/${id}`, produtoData);
    return response.data;
  },

  create: async (produtoData: CriarProdutoDTO): Promise<IProduct> => {
    const response = await api.post<IProduct>("/produtos", produtoData);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/produtos/${id}`);
  },

  getCategories: async (): Promise<IProductCategory[]> => {
    const response = await api.get<IProductCategory[]>("/produtos/categorias");
    return response.data;
  },

  createCategory: async (categoryData: CriarCategoriaProdutoDTO): Promise<IProductCategory> => {
    const response = await api.post<IProductCategory>("/produtos/categorias", categoryData);
    return response.data;
  },

  deleteCategory: async (id: number): Promise<void> => {
    await api.delete(`/produtos/categorias/${id}`);
  },
};