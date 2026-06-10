import { useState, useEffect } from "react";
import { vendaService } from "../../services/saleService";
import { productService } from "../../services/productService";
import * as S from "./styles";

const MESES = [
  { value: "todos", label: "Todos os Meses" },
  { value: "01", label: "Janeiro" },
  { value: "02", label: "Fevereiro" },
  { value: "03", label: "Março" },
  { value: "04", label: "Abril" },
  { value: "05", label: "Maio" },
  { value: "06", label: "Junho" },
  { value: "07", label: "Julho" },
  { value: "08", label: "Agosto" },
  { value: "09", label: "Setembro" },
  { value: "10", label: "Outubro" },
  { value: "11", label: "Novembro" },
  { value: "12", label: "Dezembro" },
];

export function Dashboard() {
  // Estados para guardar os dados reais do banco
  const [vendas, setVendas] = useState<any[]>([]);
  const [produtos, setProdutos] = useState<any[]>([]);
  const [selecionadoMes, setSelecionadoMes] = useState("todos");
  const [selecionadoAno, setSelecionadoAno] = useState("todos");

  useEffect(() => {
    const carregarDashboard = async () => {
      try {
        const [dadosVendas, dadosProdutos] = await Promise.all([
          vendaService.getAll(),
          productService.getAll()
        ]);

        setVendas(dadosVendas || []);
        setProdutos(dadosProdutos || []);
      } catch (error) {
        console.error("Erro ao carregar dados do dashboard", error);
      }
    };

    carregarDashboard();
  }, []);

  // Extrai os anos disponíveis dinamicamente a partir das vendas cadastradas
  const anosDisponiveis = vendas.length > 0
    ? Array.from(new Set(vendas.map(v => String(v.data_venda).split("-")[0]))).sort((a, b) => b.localeCompare(a))
    : [String(new Date().getFullYear())];

  // --- FILTRAGEM ---
  const vendasFiltradas = vendas.filter((venda) => {
    const parts = String(venda.data_venda).split("-");
    if (parts.length !== 3) return false;

    const matchMes = selecionadoMes === "todos" || parts[1] === selecionadoMes;
    const matchAno = selecionadoAno === "todos" || parts[0] === selecionadoAno;

    return matchMes && matchAno;
  });

  // --- CÁLCULOS DINÂMICOS ---
  
  // Apenas vendas que não foram canceladas entram para o faturamento e estatísticas
  const vendasAtivas = vendasFiltradas.filter((venda) => venda.status !== "cancelada");

  // 1. Receita Total (Soma do valor de todas as vendas ativas filtradas)
  const receitaTotal = vendasAtivas.reduce((acc, venda) => acc + Number(venda.valor_total || 0), 0);

  // 2. Vendas Realizadas
  const totalVendas = vendasAtivas.length;

  // 3. Ticket Médio (Receita / Quantidade de Vendas)
  const ticketMedio = totalVendas > 0 ? receitaTotal / totalVendas : 0;

  // 4. Alertas de Estoque (Conta quantos produtos têm 5 ou menos unidades)
  const alertasEstoque = produtos.filter(p => p.estoque_atual <= 5).length;

  const formatarMoeda = (valor: number) => 
    `R$ ${valor.toFixed(2).replace(".", ",")}`;

  return (
    <S.Container>
      <S.HeaderRow>
        <S.Header style={{ marginBottom: 0 }}>
          <h1>Visão Geral</h1>
          <p>Acompanhe o desempenho das suas vendas reais.</p>
        </S.Header>

        <S.FilterGroup>
          <S.FilterGroup style={{ gap: "0.25rem" }}>
            <S.FilterLabel htmlFor="mes-select">Mês:</S.FilterLabel>
            <S.Select
              id="mes-select"
              value={selecionadoMes}
              onChange={(e) => setSelecionadoMes(e.target.value)}
              style={{ minWidth: "130px" }}
            >
              {MESES.map((mes) => (
                <option key={mes.value} value={mes.value}>
                  {mes.label}
                </option>
              ))}
            </S.Select>
          </S.FilterGroup>

          <S.FilterGroup style={{ gap: "0.25rem" }}>
            <S.FilterLabel htmlFor="ano-select">Ano:</S.FilterLabel>
            <S.Select
              id="ano-select"
              value={selecionadoAno}
              onChange={(e) => setSelecionadoAno(e.target.value)}
              style={{ minWidth: "100px" }}
            >
              <option value="todos">Todos</option>
              {anosDisponiveis.map((ano) => (
                <option key={ano} value={ano}>
                  {ano}
                </option>
              ))}
            </S.Select>
          </S.FilterGroup>
        </S.FilterGroup>
      </S.HeaderRow>

      <S.CardsGrid>
        <S.Card>
          <S.CardHeader>
            <h3>Receita Total</h3>
            <span>💰</span>
          </S.CardHeader>
          <S.CardValue>{formatarMoeda(receitaTotal)}</S.CardValue>
          <S.CardTrend $isPositive>Atualizado em tempo real</S.CardTrend>
        </S.Card>

        <S.Card>
          <S.CardHeader>
            <h3>Vendas Realizadas</h3>
            <span>🛍️</span>
          </S.CardHeader>
          <S.CardValue>{totalVendas}</S.CardValue>
          <S.CardTrend $isPositive>Total de pedidos concluídos</S.CardTrend>
        </S.Card>

        <S.Card>
          <S.CardHeader>
            <h3>Ticket Médio</h3>
            <span>📊</span>
          </S.CardHeader>
          <S.CardValue>{formatarMoeda(ticketMedio)}</S.CardValue>
          <S.CardTrend $isPositive={true}>Média por venda</S.CardTrend>
        </S.Card>

        <S.Card>
          <S.CardHeader>
            <h3>Alertas de Estoque</h3>
            <span>⚠️</span>
          </S.CardHeader>
          <S.CardValue>{alertasEstoque} Itens</S.CardValue>
          <S.CardTrend $isPositive={alertasEstoque === 0}>
            {alertasEstoque === 0 ? "Estoque saudável" : "Precisam de reposição (<= 5)"}
          </S.CardTrend>
        </S.Card>
      </S.CardsGrid>
    </S.Container>
  );
}