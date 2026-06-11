import { useState, useEffect } from "react";
import { 
  DollarSign, 
  ShoppingBag, 
  TrendingUp, 
  AlertTriangle, 
  ArrowUpRight, 
  Calendar, 
  CheckCircle2, 
  Package, 
  Sparkles,
  ClipboardList
} from "lucide-react";
import { vendaService } from "../../services/saleService";
import { productService } from "../../services/productService";
import { customerService } from "../../services/customerService";
import { type ICustomer } from "../../interfaces/Customer";
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
  const [vendas, setVendas] = useState<any[]>([]);
  const [produtos, setProdutos] = useState<any[]>([]);
  const [clientes, setClientes] = useState<ICustomer[]>([]);
  const [selecionadoMes, setSelecionadoMes] = useState("todos");
  const [selecionadoAno, setSelecionadoAno] = useState("todos");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const carregarDashboard = async () => {
      try {
        setIsLoading(true);
        const [dadosVendas, dadosProdutos, dadosClientes] = await Promise.all([
          vendaService.getAll(),
          productService.getAll(),
          customerService.getAll().catch(() => [])
        ]);

        setVendas(dadosVendas || []);
        setProdutos(dadosProdutos || []);
        setClientes(dadosClientes || []);
      } catch (error) {
        console.error("Erro ao carregar dados do dashboard", error);
      } finally {
        setIsLoading(false);
      }
    };

    carregarDashboard();
  }, []);

  const obterNomeCliente = (id?: number) => {
    if (!id) return "Consumidor Geral";
    const cliente = clientes.find((c) => c.id === id);
    return cliente ? cliente.nome : `Cliente #${id}`;
  };

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

  // 5. Últimas vendas filtradas ordenadas por data descrescente (limite 5)
  const ultimasVendas = [...vendasFiltradas]
    .sort((a, b) => new Date(b.data_venda).getTime() - new Date(a.data_venda).getTime())
    .slice(0, 5);

  // 6. Produtos com estoque baixo ordenados pelo menor estoque (limite 5)
  const produtosEstoqueBaixo = produtos
    .filter((p) => p.estoque_atual <= 5)
    .sort((a, b) => a.estoque_atual - b.estoque_atual)
    .slice(0, 5);

  const formatarMoeda = (valor: number) => 
    `R$ ${valor.toFixed(2).replace(".", ",")}`;

  const formatarData = (dataStr: string) => {
    try {
      const datePart = dataStr.split("T")[0];
      const parts = datePart.split("-");
      return parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : dataStr;
    } catch {
      return dataStr;
    }
  };

  const traduzirMetodoPagamento = (metodo: string) => {
    const metodos: Record<string, string> = {
      dinheiro: "Dinheiro",
      pix: "Pix",
      cartao_credito: "Crédito",
      cartao_debito: "Débito",
      crediario: "Crediário",
      consignado: "Consignado"
    };
    return metodos[metodo.toLowerCase()] || metodo;
  };

  return (
    <S.Container>
      <S.HeaderRow>
        <S.Header>
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
              style={{ minWidth: "140px" }}
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
            <S.IconBox $variant="success">
              <DollarSign size={20} />
            </S.IconBox>
          </S.CardHeader>
          <S.CardValue>{formatarMoeda(receitaTotal)}</S.CardValue>
          <S.CardTrend $isPositive>
            <ArrowUpRight size={14} /> Faturamento consolidado
          </S.CardTrend>
        </S.Card>

        <S.Card>
          <S.CardHeader>
            <h3>Vendas Realizadas</h3>
            <S.IconBox $variant="primary">
              <ShoppingBag size={20} />
            </S.IconBox>
          </S.CardHeader>
          <S.CardValue>{totalVendas}</S.CardValue>
          <S.CardTrend $isPositive>
            <CheckCircle2 size={14} /> Pedidos faturados
          </S.CardTrend>
        </S.Card>

        <S.Card>
          <S.CardHeader>
            <h3>Ticket Médio</h3>
            <S.IconBox $variant="primary">
              <TrendingUp size={20} />
            </S.IconBox>
          </S.CardHeader>
          <S.CardValue>{formatarMoeda(ticketMedio)}</S.CardValue>
          <S.CardTrend $isPositive>
            <Sparkles size={14} /> Média por transação
          </S.CardTrend>
        </S.Card>

        <S.Card>
          <S.CardHeader>
            <h3>Alertas de Estoque</h3>
            <S.IconBox $variant={alertasEstoque === 0 ? "success" : "danger"}>
              <AlertTriangle size={20} />
            </S.IconBox>
          </S.CardHeader>
          <S.CardValue>{alertasEstoque}</S.CardValue>
          <S.CardTrend $isPositive={alertasEstoque === 0}>
            {alertasEstoque === 0 ? "Estoque 100% saudável" : "Itens com nível crítico (<= 5)"}
          </S.CardTrend>
        </S.Card>
      </S.CardsGrid>

      <S.WidgetsGrid>
        {/* Bloco de Últimas Vendas */}
        <S.WidgetCard>
          <S.WidgetHeader>
            <h2>
              <ClipboardList size={18} style={{ color: "#C6A87C" }} />
              Últimas Transações
            </h2>
            <span className="badge">Filtradas por mês/ano</span>
          </S.WidgetHeader>
          
          <S.SalesList>
            {isLoading ? (
              <S.EmptyState>
                <p className="desc">Carregando...</p>
              </S.EmptyState>
            ) : ultimasVendas.length === 0 ? (
              <S.EmptyState>
                <p className="title">Nenhuma venda encontrada</p>
                <p className="desc">Não há registros para o período filtrado.</p>
              </S.EmptyState>
            ) : (
              ultimasVendas.map((venda) => (
                <S.SaleItem key={venda.id}>
                  <S.SaleInfo>
                    <span className="customer-name">{obterNomeCliente(venda.cliente_id)}</span>
                    <span className="sale-details">
                      <Calendar size={12} />
                      {formatarData(venda.data_venda)}
                      <span>•</span>
                      {traduzirMetodoPagamento(venda.metodo_pagamento)}
                    </span>
                  </S.SaleInfo>
                  <S.SaleMeta>
                    <span className="sale-value">{formatarMoeda(Number(venda.valor_total))}</span>
                    <S.StatusBadge $status={venda.status}>
                      {venda.status === "consignada" ? "Consignada" : venda.status === "cancelada" ? "Cancelada" : "Concluída"}
                    </S.StatusBadge>
                  </S.SaleMeta>
                </S.SaleItem>
              ))
            )}
          </S.SalesList>
        </S.WidgetCard>

        {/* Bloco de Alertas de Estoque */}
        <S.WidgetCard>
          <S.WidgetHeader>
            <h2>
              <Package size={18} style={{ color: "#ef4444" }} />
              Estoque Crítico
            </h2>
            <span className="badge">Mínimo 5 unid.</span>
          </S.WidgetHeader>

          <S.StockList>
            {isLoading ? (
              <S.EmptyState>
                <p className="desc">Carregando...</p>
              </S.EmptyState>
            ) : produtosEstoqueBaixo.length === 0 ? (
              <S.EmptyState>
                <CheckCircle2 size={32} style={{ color: "#10B981", marginBottom: "0.25rem" }} />
                <p className="title" style={{ color: "#10B981" }}>Tudo sob controle!</p>
                <p className="desc">Não há produtos abaixo do estoque mínimo de 5 unidades.</p>
              </S.EmptyState>
            ) : (
              produtosEstoqueBaixo.map((produto) => (
                <S.StockItem key={produto.id}>
                  <S.ProductInfo>
                    <span className="product-name">{produto.nome}</span>
                    <span className="product-category">{produto.categoria || "Geral"}</span>
                  </S.ProductInfo>
                  <S.StockBadge $count={produto.estoque_atual}>
                    {produto.estoque_atual} {produto.estoque_atual === 1 ? "unidade" : "unidades"}
                  </S.StockBadge>
                </S.StockItem>
              ))
            )}
          </S.StockList>
        </S.WidgetCard>
      </S.WidgetsGrid>
    </S.Container>
  );
}