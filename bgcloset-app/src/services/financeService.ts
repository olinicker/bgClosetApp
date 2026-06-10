import api from "./api";
import { type ICategoriaFinanceira, type IMovimentacao, type CriarMovimentacaoManualDTO } from "../interfaces/Finance";

export const financeService = {
  getAll: async (): Promise<IMovimentacao[]> => {
    const response = await api.get<IMovimentacao[]>("/fluxo-caixa");
    return response.data;
  },

  getCategories: async (): Promise<ICategoriaFinanceira[]> => {
    const response = await api.get<ICategoriaFinanceira[]>("/fluxo-caixa/categorias");
    return response.data;
  },

  createManual: async (data: CriarMovimentacaoManualDTO): Promise<IMovimentacao> => {
    const response = await api.post<IMovimentacao>("/fluxo-caixa/registro-manual", data);
    return response.data;
  },

  createCategory: async (data: Omit<ICategoriaFinanceira, "id">): Promise<ICategoriaFinanceira> => {
    const response = await api.post<ICategoriaFinanceira>("/fluxo-caixa/categorias", data);
    return response.data;
  },

  updateCategory: async (id: number, data: Omit<ICategoriaFinanceira, "id">): Promise<ICategoriaFinanceira> => {
    const response = await api.put<ICategoriaFinanceira>(`/fluxo-caixa/categorias/${id}`, data);
    return response.data;
  },

  deleteCategory: async (id: number): Promise<void> => {
    await api.delete(`/fluxo-caixa/categorias/${id}`);
  },
};
