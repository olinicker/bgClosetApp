import api from "./api";
import { type ICustomer } from "../interfaces/Customer";

export type CriarClienteDTO = Omit<ICustomer, "id">;
export type AtualizarClienteDTO = Partial<CriarClienteDTO>;

export const customerService = {
  getAll: async (): Promise<ICustomer[]> => {
    // Busca direto da API real. Se der erro, ele repassa o erro em vez de esconder.
    const response = await api.get<ICustomer[]>("/clientes");
    return response.data;
  },

  create: async (clienteData: CriarClienteDTO): Promise<ICustomer> => {
    const response = await api.post<ICustomer>("/clientes", clienteData);
    return response.data;
  },

  update: async (id: number, clienteData: AtualizarClienteDTO): Promise<ICustomer> => {
    const response = await api.put<ICustomer>(`/clientes/${id}`, clienteData);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/clientes/${id}`);
  },

  payDebt: async (
    id: number,
    pagamentoData: { valor_pago: number; metodo_pagamento: string; descricao?: string }
  ): Promise<ICustomer> => {
    const response = await api.post<ICustomer>(`/clientes/${id}/pagar-debito`, pagamentoData);
    return response.data;
  },

  getDebtPayments: async (id: number): Promise<import("../interfaces/DebitPayment").IDebitPayment[]> => {
    const response = await api.get<import("../interfaces/DebitPayment").IDebitPayment[]>(`/clientes/${id}/pagamentos`);
    return response.data;
  },
};