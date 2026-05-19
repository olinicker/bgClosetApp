import { DataTable, type Column } from "../../components/DataTable";
import * as S from "./styles";

// Tipagem para a tabela de vendas recentes
interface VendaRecente {
  id: string;
  cliente: string;
  valor: number;
  data: string;
  status: "Concluída" | "Pendente";
}

export function Dashboard() {
  // Mock de dados para a tabela de vendas recentes
  const ultimasVendas: VendaRecente[] = [
    {
      id: "1",
      cliente: "Maria Silva",
      valor: 349.8,
      data: "Hoje, 14:30",
      status: "Concluída",
    },
    {
      id: "2",
      cliente: "João Pedro",
      valor: 89.9,
      data: "Hoje, 11:15",
      status: "Concluída",
    },
    {
      id: "3",
      cliente: "Ana Carolina",
      valor: 599.0,
      data: "Ontem, 16:45",
      status: "Pendente",
    },
  ];

  const columns: Column<VendaRecente>[] = [
    { key: "id", label: "Pedido" },
    { key: "cliente", label: "Cliente" },
    { key: "data", label: "Data/Hora" },
    {
      key: "valor",
      label: "Valor",
      render: (value) => `R$ ${Number(value).toFixed(2).replace(".", ",")}`,
    },
    {
      key: "status",
      label: "Status",
      render: (value) => (
        <span
          style={{
            color: value === "Concluída" ? "#10B981" : "#F59E0B",
            fontWeight: 600,
          }}
        >
          {String(value)}
        </span>
      ),
    },
  ];

  return (
    <S.Container>
      <S.Header>
        <h1>Visão Geral</h1>
        <p>Acompanhe o desempenho das suas vendas hoje.</p>
      </S.Header>

      <S.CardsGrid>
        <S.Card>
          <S.CardHeader>
            <h3>Receita do Dia</h3>
            <span>💰</span>
          </S.CardHeader>
          <S.CardValue>R$ 1.038,70</S.CardValue>
          <S.CardTrend $isPositive>+12% em relação a ontem</S.CardTrend>
        </S.Card>

        <S.Card>
          <S.CardHeader>
            <h3>Vendas Realizadas</h3>
            <span>🛍️</span>
          </S.CardHeader>
          <S.CardValue>14</S.CardValue>
          <S.CardTrend $isPositive>+3 novas vendas</S.CardTrend>
        </S.Card>

        <S.Card>
          <S.CardHeader>
            <h3>Ticket Médio</h3>
            <span>📊</span>
          </S.CardHeader>
          <S.CardValue>R$ 74,19</S.CardValue>
          <S.CardTrend $isPositive={false}>-2% em relação à média</S.CardTrend>
        </S.Card>

        <S.Card>
          <S.CardHeader>
            <h3>Alertas de Estoque</h3>
            <span>⚠️</span>
          </S.CardHeader>
          <S.CardValue>3 Itens</S.CardValue>
          <S.CardTrend $isPositive={false}>Precisam de reposição</S.CardTrend>
        </S.Card>
      </S.CardsGrid>

      <S.Section>
        <h2>Últimas Vendas</h2>
        <DataTable columns={columns} data={ultimasVendas} />
      </S.Section>
    </S.Container>
  );
}
