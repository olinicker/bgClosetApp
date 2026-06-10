import api from "./api";
import { type IUser } from "../interfaces/User";

export interface CriarUsuarioDTO extends Omit<IUser, "id"> {
  senha?: string;
}

export interface AtualizarUsuarioDTO extends Omit<IUser, "id"> {
  senha?: string;
}

export const userService = {
  getAll: async (): Promise<IUser[]> => {
    const response = await api.get<IUser[]>("/usuarios/");
    return response.data;
  },

  create: async (userData: CriarUsuarioDTO): Promise<IUser> => {
    const response = await api.post<IUser>("/usuarios/", userData);
    return response.data;
  },

  update: async (id: number, userData: AtualizarUsuarioDTO): Promise<IUser> => {
    const response = await api.put<IUser>(`/usuarios/${id}`, userData);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/usuarios/${id}`);
  },
};
