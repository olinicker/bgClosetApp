import api from "./api";
import { type ISale, type CriarSaleDTO } from "../interfaces/Sale";
import { vendasMock } from "../mocks/salesMock";

export const vendaService = {
  getAll: async (): Promise<ISale[]> => {
    try {
      const response = await api.get<ISale[]>("/vendas");
      return response.data;
    } catch {
      console.warn("Backend não conectado. Retornando mock de vendas.");
      return vendasMock;
    }
  },

  create: async (vendaData: CriarSaleDTO): Promise<ISale> => {
    try {
      const response = await api.post<ISale>("/vendas", vendaData);
      return response.data;
    } catch (error) {
      console.error("Erro ao registrar a venda", error);
      throw error;
    }
  },
};
