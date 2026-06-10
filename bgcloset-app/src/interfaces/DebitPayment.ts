export interface IDebitPayment {
  id: number;
  cliente_id: number;
  valor_pago: number;
  data_pagamento: string;
  metodo_pagamento: string;
  descricao?: string;
}
