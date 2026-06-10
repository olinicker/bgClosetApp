export interface ICustomer {
  id?: number;
  nome: string;
  telefone?: string | null;
  email?: string | null;
  cpf?: string | null;
  saldo_devedor?: number;
}