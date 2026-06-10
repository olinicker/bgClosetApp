import api from "./api";
import { type ISale, type CriarSaleDTO } from "../interfaces/Sale";

export interface IFilterSaleParams {
  data_inicio?: string;
  data_fim?: string;
  cliente_id?: number;
  metodo_pagamento?: string;
  status?: string;
}

export const vendaService = {
  getAll: async (params?: IFilterSaleParams): Promise<ISale[]> => {
    const response = await api.get<ISale[]>("/vendas", { params });
    return response.data;
  },

  create: async (vendaData: CriarSaleDTO): Promise<ISale> => {
    const response = await api.post<ISale>("/vendas", vendaData);
    return response.data;
  },

  cancel: async (id: number): Promise<ISale> => {
    const response = await api.post<ISale>(`/vendas/${id}/cancelar`);
    return response.data;
  },

  settleConsignment: async (
    id: number,
    acertoData: {
      metodo_pagamento: string;
      itens_devolvidos: { produto_id: number; quantidade_devolvida: number }[];
    }
  ): Promise<ISale> => {
    const response = await api.post<ISale>(`/vendas/${id}/acerto-consignado`, acertoData);
    return response.data;
  },
};