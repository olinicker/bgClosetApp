export interface ICategoriaFinanceira {
  id: number;
  nome: string;
  tipo: string; // "entrada" ou "saída"
}

export interface IMovimentacao {
  id: number;
  categoria_id: number;
  venda_id?: number;
  tipo_movimentacao: string; // "entrada" ou "saída"
  valor: number;
  data_ocorrencia: string;
  descricao?: string;
}

export interface CriarMovimentacaoManualDTO {
  categoria_id: number;
  valor: number;
  data_ocorrencia?: string;
  descricao?: string;
}
