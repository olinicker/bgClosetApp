import api from "./api";
import { type ICustomer } from "../interfaces/Customer";
import { customersMock } from "../mocks/customersMock";

export type CriarClienteDTO = Omit<ICustomer, "id">;
export type AtualizarClienteDTO = Partial<CriarClienteDTO>;

export const customerService = {
  getAll: async (): Promise<ICustomer[]> => {
    try {
      const response = await api.get<ICustomer[]>("/clientes");
      return response.data;
    } catch {
      console.warn("Backend não conectado. Retornando mock de clientes.");
      return customersMock;
    }
  },

  create: async (clienteData: CriarClienteDTO): Promise<ICustomer> => {
    try {
      const response = await api.post<ICustomer>("/clientes", clienteData);
      return response.data;
    } catch (error) {
      console.error("Erro ao criar cliente", error);
      throw error;
    }
  },

  update: async (
    id: number,
    clienteData: AtualizarClienteDTO,
  ): Promise<ICustomer> => {
    try {
      const response = await api.put<ICustomer>(`/clientes/${id}`, clienteData);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar cliente com ID ${id}`, error);
      throw error;
    }
  },

  delete: async (id: number): Promise<void> => {
    try {
      await api.delete(`/clientes/${id}`);
    } catch (error) {
      console.error(`Erro ao excluir cliente com ID ${id}`, error);
      throw error;
    }
  },
};
