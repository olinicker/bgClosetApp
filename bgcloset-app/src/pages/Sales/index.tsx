import { useState, useEffect } from "react";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { DataTable, type Column } from "../../components/DataTable";
import { Modal } from "../../components/Modal";
import { vendaService } from "../../services/saleService";
import { productService } from "../../services/productService"; // Importamos o serviço de produtos
import { customerService } from "../../services/customerService"; // Importamos o serviço de clientes
import { type ISaleItem, type CriarSaleDTO, type ISale } from "../../interfaces/Sale";
import { type IProduct } from "../../interfaces/Product"; 
import { type ICustomer } from "../../interfaces/Customer"; // Importamos a interface de Clientes
import * as S from "./styles";

// Função para abrir o Token e pescar o ID do utilizador logado
const obterIdUsuarioLogado = (): number => {
  try {
    const token = localStorage.getItem("@BG_Token");
    if (!token) return 1;
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.id || 1; 
  } catch (error) {
    return 1;
  }
};

export function Vendas() {
  const [carrinho, setCarrinho] = useState<ISaleItem[]>([]);
  
  // Novo estado para guardar a lista de produtos que vem da API
  const [produtosDisponiveis, setProdutosDisponiveis] = useState<IProduct[]>([]);
  // Estados para guardar os clientes
  const [clientesDisponiveis, setClientesDisponiveis] = useState<ICustomer[]>([]);
  const [clienteId, setClienteId] = useState("");
  
  const [produtoId, setProdutoId] = useState("");
  const [quantidade, setQuantidade] = useState("1");
  const [precoUnitario, setPrecoUnitario] = useState("");

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [itemErrorMsg, setItemErrorMsg] = useState("");
  const [metodoPagamento, setMetodoPagamento] = useState("PIX");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Estados para controle de abas e histórico de vendas
  const [activeTab, setActiveTab] = useState<"pdv" | "historico">("pdv");
  const [vendasHistorico, setVendasHistorico] = useState<ISale[]>([]);
  const [vendaSelecionada, setVendaSelecionada] = useState<ISale | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const [isConfirmingCancel, setIsConfirmingCancel] = useState(false);
  const [cancelErrorMsg, setCancelErrorMsg] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  // Estados específicos para Consignações
  const [tipoOperacao, setTipoOperacao] = useState<"venda" | "consignada">("venda");
  const [itensDevolvidos, setItensDevolvidos] = useState<Record<number, string | number>>({});
  const [metodoPagamentoAcerto, setMetodoPagamentoAcerto] = useState("PIX");
  const [isSettleError, setIsSettleError] = useState("");

  // Estados de filtros para o histórico de vendas
  const [filtroCliente, setFiltroCliente] = useState("");
  const [filtroPagamento, setFiltroPagamento] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("");
  const [filtroDataInicio, setFiltroDataInicio] = useState("");
  const [filtroDataFim, setFiltroDataFim] = useState("");

  const carregarDadosBase = async () => {
    try {
      const [dadosProdutos, dadosClientes] = await Promise.all([
        productService.getAll(),
        customerService.getAll()
      ]);
      setProdutosDisponiveis(dadosProdutos);
      setClientesDisponiveis(dadosClientes);
    } catch (error) {
      console.error("Erro ao carregar dados base no PDV.", error);
    }
  };

  const carregarHistorico = async () => {
    try {
      const params: any = {};
      if (filtroCliente) params.cliente_id = Number(filtroCliente);
      if (filtroPagamento) params.metodo_pagamento = filtroPagamento;
      if (filtroStatus) params.status = filtroStatus;
      if (filtroDataInicio) params.data_inicio = filtroDataInicio;
      if (filtroDataFim) params.data_fim = filtroDataFim;

      const dadosVendas = await vendaService.getAll(params);
      setVendasHistorico(dadosVendas || []);
    } catch (error) {
      console.error("Erro ao carregar histórico de vendas.", error);
    }
  };

  useEffect(() => {
    carregarDadosBase();
    const token = localStorage.getItem("@BG_Token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setIsAdmin(payload.perfil === "admin");
      } catch (e) {
        console.error("Erro ao decodificar token no PDV:", e);
      }
    }
  }, []);

  useEffect(() => {
    if (activeTab === "historico") {
      carregarHistorico();
    }
  }, [activeTab, filtroCliente, filtroPagamento, filtroStatus, filtroDataInicio, filtroDataFim]);

  // Quando o usuário escolhe um produto na lista
  const handleProdutoSelecionado = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const idSelecionado = e.target.value;
    setProdutoId(idSelecionado);

    // Bônus: Busca o produto na lista e preenche o preço automaticamente
    const produtoEncontrado = produtosDisponiveis.find(p => p.id === Number(idSelecionado));
    if (produtoEncontrado) {
      setPrecoUnitario(produtoEncontrado.preco_venda.toString()); // Ajuste 'preco' se na sua interface for outro nome
    } else {
      setPrecoUnitario("");
    }
  };

  const handleAdicionarItem = () => {
    setItemErrorMsg("");
    if (!produtoId || !quantidade || !precoUnitario) {
      setItemErrorMsg("Selecione um produto, defina a quantidade e o preço!");
      setTimeout(() => setItemErrorMsg(""), 4000);
      return;
    }

    const qtd = Number(quantidade);
    const preco = Number(precoUnitario);

    if (qtd <= 0) {
      setItemErrorMsg("A quantidade deve ser maior que zero!");
      setTimeout(() => setItemErrorMsg(""), 4000);
      return;
    }

    if (preco < 0) {
      setItemErrorMsg("O preço unitário não pode ser negativo!");
      setTimeout(() => setItemErrorMsg(""), 4000);
      return;
    }

    const produtoEncontrado = produtosDisponiveis.find(p => p.id === Number(produtoId));
    if (!produtoEncontrado) {
      setItemErrorMsg("Produto não encontrado.");
      setTimeout(() => setItemErrorMsg(""), 4000);
      return;
    }

    // Verifica se a quantidade total (carrinho + nova) excede o estoque disponível
    const qtdJaNoCarrinho = carrinho
      .filter((item) => item.produto_id === produtoEncontrado.id)
      .reduce((sum, item) => sum + item.quantidade, 0);

    const totalDesejado = qtdJaNoCarrinho + qtd;

    if (produtoEncontrado.estoque_atual < totalDesejado) {
      setItemErrorMsg(
        `Estoque insuficiente para "${produtoEncontrado.nome}"! Disponível: ${produtoEncontrado.estoque_atual} (Já possui ${qtdJaNoCarrinho} no carrinho).`
      );
      setTimeout(() => setItemErrorMsg(""), 5000);
      return;
    }

    const nomeReal = produtoEncontrado.nome;

    const novoItem: ISaleItem = {
      produto_id: Number(produtoId),
      nome_produto: nomeReal, 
      quantidade: qtd,
      preco_unitario: preco,
      subtotal: qtd * preco,
    };

    setCarrinho([...carrinho, novoItem]);
    setProdutoId("");
    setQuantidade("1");
    setPrecoUnitario("");
  };

  const handleRemoverItem = (indexParaRemover: number) => {
    setCarrinho(carrinho.filter((_, index) => index !== indexParaRemover));
  };

  const valorTotal = carrinho.reduce((acc, item) => acc + item.subtotal, 0);

  const handleFinalizarVenda = async () => {
    if (carrinho.length === 0) {
      setErrorMsg("O carrinho está vazio!");
      return;
    }
    if (tipoOperacao === "consignada" && !clienteId) {
      setErrorMsg("Para Consignações, é obrigatório selecionar um cliente!");
      return;
    }
    if (tipoOperacao !== "consignada" && metodoPagamento === "Crediário" && !clienteId) {
      setErrorMsg("Para vendas no Crediário (A Prazo), é obrigatório selecionar um cliente!");
      return;
    }
    setErrorMsg("");
    setSuccessMsg("");
    setIsSubmitting(true);

    const novaVenda: CriarSaleDTO = {
      usuario_id: obterIdUsuarioLogado(), 
      cliente_id: clienteId ? Number(clienteId) : undefined,
      metodo_pagamento: tipoOperacao === "consignada" ? "Consignado" : metodoPagamento,
      status: tipoOperacao === "consignada" ? "consignada" : "concluida",
      itens: carrinho.map((item) => ({
        produto_id: item.produto_id,
        quantidade: item.quantidade,
        preco_unitario: item.preco_unitario,
      })),
    };

    try {
      await vendaService.create(novaVenda);
      setSuccessMsg(tipoOperacao === "consignada" ? "Consignação registrada com sucesso!" : "Venda finalizada com sucesso!");
      setCarrinho([]);
      setClienteId("");
      setTipoOperacao("venda");
      carregarDadosBase();
      if (activeTab === "historico") {
        carregarHistorico();
      }
      setTimeout(() => {
        setSuccessMsg("");
      }, 3000);
    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.detail || "Erro ao finalizar a venda. Verifique o estoque.";
      setErrorMsg(msg);
      setTimeout(() => {
        setErrorMsg("");
      }, 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatarMoeda = (valor: number) =>
    `R$ ${valor.toFixed(2).replace(".", ",")}`;

  const obterNomeCliente = (id?: number) => {
    if (!id) return "Consumidor Final";
    const cli = clientesDisponiveis.find((c) => c.id === id);
    return cli ? cli.nome : `Cliente #${id}`;
  };

  const obterNomeProduto = (id: number) => {
    const prod = produtosDisponiveis.find((p) => p.id === id);
    return prod ? prod.nome : `Produto #${id}`;
  };

  const handleVerVendaDetalhes = (venda: ISale) => {
    setVendaSelecionada(venda);
    setIsConfirmingCancel(false);
    setCancelErrorMsg("");
    setIsDetailsModalOpen(true);

    // Inicializa o mapa de devoluções com 0 para todos os itens da venda
    const inicial: Record<number, number> = {};
    if (venda.itens) {
      venda.itens.forEach((item) => {
        inicial[item.produto_id] = 0;
      });
    }
    setItensDevolvidos(inicial);
    setMetodoPagamentoAcerto("PIX");
    setIsSettleError("");
  };

  const handleFinalizarAcerto = async () => {
    if (!vendaSelecionada) return;
    setIsSettleError("");

    if (metodoPagamentoAcerto === "Crediário" && !vendaSelecionada.cliente_id) {
      setIsSettleError("Para acerto no Crediário (A Prazo), é obrigatório selecionar um cliente.");
      return;
    }
    
    const itens_devolvidos = Object.entries(itensDevolvidos).map(([prodId, qty]) => ({
      produto_id: Number(prodId),
      quantidade_devolvida: Number(qty) || 0
    }));

    try {
      await vendaService.settleConsignment(vendaSelecionada.id, {
        metodo_pagamento: metodoPagamentoAcerto,
        itens_devolvidos
      });
      setIsDetailsModalOpen(false);
      carregarHistorico();
      carregarDadosBase();
    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.detail || "Erro ao realizar o acerto de consignado.";
      setIsSettleError(msg);
    }
  };

  const handleExecuteCancel = async (id: number) => {
    setCancelErrorMsg("");
    try {
      await vendaService.cancel(id);
      setIsConfirmingCancel(false);
      setIsDetailsModalOpen(false);
      carregarHistorico();
      carregarDadosBase();
    } catch (error: any) {
      const msg = error.response?.data?.detail || "Erro ao cancelar a venda.";
      setCancelErrorMsg(msg);
    }
  };

  const columnsHistorico: Column<ISale>[] = [
    { key: "id", label: "Pedido" },
    {
      key: "data_venda",
      label: "Data",
      render: (value) => {
        const datePart = String(value).split("T")[0];
        const parts = datePart.split("-");
        return parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : String(value);
      },
    },
    {
      key: "cliente_id",
      label: "Cliente",
      render: (value) => obterNomeCliente(value ? Number(value) : undefined),
    },
    { key: "metodo_pagamento", label: "Forma de Pagamento" },
    {
      key: "status",
      label: "Status",
      render: (value) => {
        const statusStr = String(value);
        if (statusStr === "cancelada") {
          return <span style={{ color: "#ef4444", fontWeight: 600 }}>Cancelada</span>;
        }
        if (statusStr === "consignada") {
          return <span style={{ color: "#f97316", fontWeight: 600 }}>Consignada</span>;
        }
        return <span style={{ color: "#10b981", fontWeight: 600 }}>Concluída</span>;
      }
    },
    {
      key: "valor_total",
      label: "Valor Total",
      render: (value) => `R$ ${Number(value || 0).toFixed(2).replace(".", ",")}`,
    },
    {
      key: "actions",
      label: "Ações",
      render: (_, row) => (
        <Button 
          variant={row.status === "consignada" ? "primary" : "secondary"} 
          onClick={() => handleVerVendaDetalhes(row)}
        >
          {row.status === "consignada" ? "Fazer Acerto" : "Ver Itens"}
        </Button>
      ),
    },
  ];

  return (
    <S.Container>
      <S.PageHeader>
        <h1>PDV & Histórico de Vendas</h1>
      </S.PageHeader>

      <S.TabContainer>
        <S.TabButton $isActive={activeTab === "pdv"} onClick={() => setActiveTab("pdv")}>
          Frente de Caixa (PDV)
        </S.TabButton>
        <S.TabButton $isActive={activeTab === "historico"} onClick={() => setActiveTab("historico")}>
          Histórico de Vendas
        </S.TabButton>
      </S.TabContainer>

      {activeTab === "pdv" ? (
        <S.Content>
          <S.Panel>
            <S.PanelTitle>Adicionar Item</S.PanelTitle>

            <S.FormRow>
              <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1rem" }}>
                <label style={{ fontSize: "0.875rem", fontWeight: 500, color: "#1E293B" }}>
                  Selecionar Produto
                </label>
                <S.Select value={produtoId} onChange={handleProdutoSelecionado}>
                  <option value="">Selecione um produto...</option>
                  {produtosDisponiveis.map((produto) => (
                    <option key={produto.id} value={produto.id}>
                      {produto.nome} {produto.categoria ? `(${produto.categoria})` : ""} - R$ {Number(produto.preco_venda).toFixed(2).replace(".", ",")} (Estoque: {produto.estoque_atual})
                    </option>
                  ))}
                </S.Select>
              </div>
            </S.FormRow>

            <S.FormRow>
              <Input
                label="Qtd."
                type="number"
                min="1"
                value={quantidade}
                onChange={(e) => setQuantidade(e.target.value)}
              />
              <Input
                label="Preço Unitário (R$)"
                type="number"
                step="0.01"
                value={precoUnitario}
                onChange={(e) => setPrecoUnitario(e.target.value)}
              />
              <Button onClick={handleAdicionarItem} type="button">
                Adicionar
              </Button>
            </S.FormRow>
            {itemErrorMsg && <S.ErrorMessage style={{ display: "block", marginTop: "0.5rem" }}>{itemErrorMsg}</S.ErrorMessage>}
          </S.Panel>

          <S.Panel>
            <S.PanelTitle>Resumo da Venda</S.PanelTitle>

            <S.CartList>
              {carrinho.length === 0 && (
                <p style={{ color: "#94A3B8" }}>Nenhum item adicionado.</p>
              )}

              {carrinho.map((item, index) => (
                <S.CartItem key={index}>
                  <S.ItemInfo>
                    <strong>{item.nome_produto}</strong>
                    <span>
                      {item.quantidade}x de {formatarMoeda(item.preco_unitario)}
                    </span>
                  </S.ItemInfo>
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <strong style={{ color: "#1E293B" }}>
                      {formatarMoeda(item.subtotal)}
                    </strong>
                    <S.RemoveButton
                      onClick={() => handleRemoverItem(index)}
                      title="Remover"
                    >
                      &times;
                    </S.RemoveButton>
                  </div>
                </S.CartItem>
              ))}
            </S.CartList>

            <S.CheckoutSection>
              <div>
                <label style={{ fontSize: "0.875rem", fontWeight: 500, marginBottom: "0.5rem", display: "block" }}>
                  Selecionar Cliente (Opcional)
                </label>
                <S.Select
                  value={clienteId}
                  onChange={(e) => setClienteId(e.target.value)}
                >
                  <option value="">Consumidor Final (Sem identificação)</option>
                  {clientesDisponiveis.map((cliente) => (
                    <option key={cliente.id} value={cliente.id}>
                      {cliente.nome} {cliente.cpf ? `(${cliente.cpf})` : ""}
                    </option>
                  ))}
                </S.Select>
              </div>

              <div>
                <label style={{ fontSize: "0.875rem", fontWeight: 500, marginBottom: "0.5rem", display: "block" }}>
                  Tipo de Operação
                </label>
                <S.Select
                  value={tipoOperacao}
                  onChange={(e) => setTipoOperacao(e.target.value as "venda" | "consignada")}
                >
                  <option value="venda">Venda Direta</option>
                  <option value="consignada">Consignado</option>
                </S.Select>
              </div>

              {tipoOperacao === "venda" && (
                <div>
                  <label style={{ fontSize: "0.875rem", fontWeight: 500, marginBottom: "0.5rem", display: "block" }}>
                    Forma de Pagamento
                  </label>
                  <S.Select
                    value={metodoPagamento}
                    onChange={(e) => setMetodoPagamento(e.target.value)}
                  >
                    <option value="PIX">PIX</option>
                    <option value="Cartão de Crédito">Cartão de Crédito</option>
                    <option value="Cartão de Débito">Cartão de Débito</option>
                    <option value="Dinheiro">Dinheiro</option>
                    <option value="Crediário">Crediário (A Prazo)</option>
                  </S.Select>
                </div>
              )}

              <S.TotalRow>
                <span>Total:</span>
                <span>{formatarMoeda(valorTotal)}</span>
              </S.TotalRow>

              {errorMsg && <S.ErrorMessage>{errorMsg}</S.ErrorMessage>}
              {successMsg && <S.SuccessMessage>{successMsg}</S.SuccessMessage>}

              <Button
                variant="success"
                fullWidth
                onClick={handleFinalizarVenda}
                disabled={carrinho.length === 0 || isSubmitting}
              >
                {isSubmitting ? "PROCESSANDO..." : "FINALIZAR VENDA"}
              </Button>
            </S.CheckoutSection>
          </S.Panel>
        </S.Content>
      ) : (
        <S.Panel>
          <S.PanelTitle>Lista de Pedidos Concluídos</S.PanelTitle>

          {/* Filtros para o Histórico de Vendas */}
          <S.FilterContainer>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", minWidth: "180px", flex: 1 }}>
              <span style={{ fontSize: "0.875rem", fontWeight: 500, color: "#64748b" }}>Cliente</span>
              <S.MiniSelect 
                value={filtroCliente} 
                onChange={(e) => setFiltroCliente(e.target.value)}
                style={{ width: "100%" }}
              >
                <option value="">Todos os Clientes</option>
                {clientesDisponiveis.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nome}
                  </option>
                ))}
              </S.MiniSelect>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", minWidth: "150px", flex: 1 }}>
              <span style={{ fontSize: "0.875rem", fontWeight: 500, color: "#64748b" }}>Método de Pagamento</span>
              <S.MiniSelect 
                value={filtroPagamento} 
                onChange={(e) => setFiltroPagamento(e.target.value)}
                style={{ width: "100%" }}
              >
                <option value="">Todos os Métodos</option>
                <option value="PIX">PIX</option>
                <option value="Cartão de Crédito">Cartão de Crédito</option>
                <option value="Cartão de Débito">Cartão de Débito</option>
                <option value="Dinheiro">Dinheiro</option>
                <option value="Crediário">Crediário</option>
              </S.MiniSelect>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", minWidth: "130px", flex: 1 }}>
              <span style={{ fontSize: "0.875rem", fontWeight: 500, color: "#64748b" }}>Status</span>
              <S.MiniSelect 
                value={filtroStatus} 
                onChange={(e) => setFiltroStatus(e.target.value)}
                style={{ width: "100%" }}
              >
                <option value="">Todos os Status</option>
                <option value="concluida">Concluída</option>
                <option value="consignada">Consignada</option>
                <option value="cancelada">Cancelada</option>
              </S.MiniSelect>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", minWidth: "130px" }}>
              <span style={{ fontSize: "0.875rem", fontWeight: 500, color: "#64748b" }}>Data Início</span>
              <input 
                type="date" 
                value={filtroDataInicio} 
                onChange={(e) => setFiltroDataInicio(e.target.value)}
                style={{ 
                  padding: "0.5rem", 
                  borderRadius: "6px", 
                  border: "1px solid #cbd5e1",
                  fontSize: "0.875rem",
                  color: "#0f172a",
                  outline: "none"
                }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", minWidth: "130px" }}>
              <span style={{ fontSize: "0.875rem", fontWeight: 500, color: "#64748b" }}>Data Fim</span>
              <input 
                type="date" 
                value={filtroDataFim} 
                onChange={(e) => setFiltroDataFim(e.target.value)}
                style={{ 
                  padding: "0.5rem", 
                  borderRadius: "6px", 
                  border: "1px solid #cbd5e1",
                  fontSize: "0.875rem",
                  color: "#0f172a",
                  outline: "none"
                }}
              />
            </div>

            <div style={{ display: "flex", alignItems: "flex-end" }}>
              <Button 
                variant="secondary" 
                onClick={() => {
                  setFiltroCliente("");
                  setFiltroPagamento("");
                  setFiltroStatus("");
                  setFiltroDataInicio("");
                  setFiltroDataFim("");
                }}
              >
                Limpar Filtros
              </Button>
            </div>
          </S.FilterContainer>

          <DataTable columns={columnsHistorico} data={vendasHistorico} />
        </S.Panel>
      )}

      {/* Modal de Detalhes da Venda */}
      <Modal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        title={vendaSelecionada ? `Detalhamento do Pedido #${vendaSelecionada.id}` : "Detalhamento da Venda"}
      >
        {vendaSelecionada && (
          <div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1.5rem" }}>
              <p style={{ fontSize: "0.875rem", color: "#64748b" }}>
                <strong>Data:</strong> {String(vendaSelecionada.data_venda || "").split("T")[0].split("-").reverse().join("/")}
              </p>
              <p style={{ fontSize: "0.875rem", color: "#64748b" }}>
                <strong>Cliente:</strong> {obterNomeCliente(vendaSelecionada.cliente_id)}
              </p>
              <p style={{ fontSize: "0.875rem", color: "#64748b" }}>
                <strong>Forma de Pagamento:</strong> {vendaSelecionada.metodo_pagamento}
              </p>
              <p style={{ fontSize: "0.875rem", color: "#64748b" }}>
                <strong>Status:</strong>{" "}
                {vendaSelecionada.status === "consignada" ? (
                  <span style={{ color: "#f97316", fontWeight: 600 }}>Consignada</span>
                ) : vendaSelecionada.status === "cancelada" ? (
                  <span style={{ color: "#ef4444", fontWeight: 600 }}>Cancelada</span>
                ) : (
                  <span style={{ color: "#10b981", fontWeight: 600 }}>Concluída</span>
                )}
              </p>
            </div>

            <h3 style={{ fontSize: "1rem", color: "#0f172a", marginBottom: "0.5rem", borderBottom: "1px solid #e2e8f0", paddingBottom: "0.25rem" }}>
              Itens do Pedido
            </h3>

            {vendaSelecionada.status === "consignada" ? (
              // Modo de Acerto de Consignado
              <div style={{ overflowX: "auto", width: "100%" }}>
                <table style={{ width: "100%", minWidth: "650px", borderCollapse: "collapse", fontSize: "0.875rem", textAlign: "left" }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid #e2e8f0", color: "#64748b" }}>
                      <th style={{ padding: "0.5rem 0.5rem" }}>Produto</th>
                      <th style={{ padding: "0.5rem 0.5rem", textAlign: "center" }}>Levou</th>
                      <th style={{ padding: "0.5rem 0.5rem", textAlign: "center" }}>Devolvidos</th>
                      <th style={{ padding: "0.5rem 0.5rem", textAlign: "center" }}>Vendidos</th>
                      <th style={{ padding: "0.5rem 0.5rem", textAlign: "right" }}>Preço Unit.</th>
                      <th style={{ padding: "0.5rem 0.5rem", textAlign: "right" }}>Subtotal Vendido</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(vendaSelecionada.itens || []).map((item, idx) => {
                      const devolvidoRaw = itensDevolvidos[item.produto_id];
                      const devolvido = Number(devolvidoRaw) || 0;
                      const vendido = Math.max(0, item.quantidade - devolvido);
                      return (
                        <tr key={idx} style={{ borderBottom: "1px solid #f1f5f9", color: "#334155" }}>
                          <td style={{ padding: "0.5rem 0.5rem" }}>{obterNomeProduto(item.produto_id)}</td>
                          <td style={{ padding: "0.5rem 0.5rem", textAlign: "center" }}>{item.quantidade}</td>
                          <td style={{ padding: "0.5rem 0.5rem", textAlign: "center" }}>
                            <input
                              type="number"
                              min="0"
                              max={item.quantidade}
                              value={devolvidoRaw ?? ""}
                              onChange={(e) => {
                                const valStr = e.target.value;
                                if (valStr === "") {
                                  setItensDevolvidos({
                                    ...itensDevolvidos,
                                    [item.produto_id]: ""
                                  });
                                  return;
                                }
                                const valNum = Math.min(item.quantidade, Math.max(0, parseInt(valStr, 10) || 0));
                                setItensDevolvidos({
                                  ...itensDevolvidos,
                                  [item.produto_id]: valNum
                                });
                              }}
                              style={{
                                width: "60px",
                                padding: "0.25rem",
                                textAlign: "center",
                                borderRadius: "4px",
                                border: "1px solid #cbd5e1",
                                outline: "none"
                              }}
                            />
                          </td>
                          <td style={{ padding: "0.5rem 0.5rem", textAlign: "center", fontWeight: 600 }}>{vendido}</td>
                          <td style={{ padding: "0.5rem 0.5rem", textAlign: "right" }}>
                            R$ {Number(item.preco_unitario || 0).toFixed(2).replace(".", ",")}
                          </td>
                          <td style={{ padding: "0.5rem 0.5rem", textAlign: "right", fontWeight: 600 }}>
                            R$ {(Number(item.preco_unitario || 0) * vendido).toFixed(2).replace(".", ",")}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {/* Cálculo do Total de Acerto */}
                {(() => {
                  const totalSettle = (vendaSelecionada.itens || []).reduce((acc, item) => {
                    const devolvido = Number(itensDevolvidos[item.produto_id]) || 0;
                    const vendido = Math.max(0, item.quantidade - devolvido);
                    return acc + (Number(item.preco_unitario || 0) * vendido);
                  }, 0);

                  return (
                    <div>
                      {totalSettle > 0 && (
                        <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                          <label style={{ fontSize: "0.875rem", fontWeight: 500, color: "#1E293B" }}>
                            Forma de Pagamento para Acerto
                          </label>
                          <S.Select
                            value={metodoPagamentoAcerto}
                            onChange={(e) => setMetodoPagamentoAcerto(e.target.value)}
                            style={{ maxWidth: "300px" }}
                          >
                            <option value="PIX">PIX</option>
                            <option value="Cartão de Crédito">Cartão de Crédito</option>
                            <option value="Cartão de Débito">Cartão de Débito</option>
                            <option value="Dinheiro">Dinheiro</option>
                            <option value="Crediário">Crediário (A Prazo)</option>
                          </S.Select>
                        </div>
                      )}

                      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1.5rem", borderTop: "2px solid #e2e8f0", paddingTop: "0.75rem", fontSize: "1.1rem", fontWeight: "bold", color: "#0f172a" }}>
                        <span>Valor Final a Pagar:</span>
                        <span style={{ color: "#10b981" }}>
                          {formatarMoeda(totalSettle)}
                        </span>
                      </div>
                    </div>
                  );
                })()}

                {isSettleError && (
                  <p style={{ color: "#ef4444", fontSize: "0.75rem", fontWeight: 600, marginTop: "1rem", margin: 0 }}>
                    {isSettleError}
                  </p>
                )}

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "1.5rem" }}>
                  <Button variant="secondary" onClick={() => setIsDetailsModalOpen(false)}>
                    Fechar
                  </Button>
                  <Button variant="success" onClick={handleFinalizarAcerto}>
                    Finalizar Acerto
                  </Button>
                </div>
              </div>
            ) : (
              // Modo de Visualização Padrão / Venda Concluída
              <div style={{ overflowX: "auto", width: "100%" }}>
                <table style={{ width: "100%", minWidth: "500px", borderCollapse: "collapse", fontSize: "0.875rem", textAlign: "left" }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid #e2e8f0", color: "#64748b" }}>
                      <th style={{ padding: "0.5rem 0.5rem" }}>Produto</th>
                      <th style={{ padding: "0.5rem 0.5rem", textAlign: "center" }}>Qtd</th>
                      <th style={{ padding: "0.5rem 0.5rem", textAlign: "right" }}>Preço Unit.</th>
                      <th style={{ padding: "0.5rem 0.5rem", textAlign: "right" }}>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(vendaSelecionada.itens || []).map((item, idx) => (
                      <tr key={idx} style={{ borderBottom: "1px solid #f1f5f9", color: "#334155" }}>
                        <td style={{ padding: "0.5rem 0.5rem" }}>{obterNomeProduto(item.produto_id)}</td>
                        <td style={{ padding: "0.5rem 0.5rem", textAlign: "center" }}>{item.quantidade}</td>
                        <td style={{ padding: "0.5rem 0.5rem", textAlign: "right" }}>
                          R$ {Number(item.preco_unitario || 0).toFixed(2).replace(".", ",")}
                        </td>
                        <td style={{ padding: "0.5rem 0.5rem", textAlign: "right", fontWeight: 600 }}>
                          R$ {(Number(item.preco_unitario || 0) * item.quantidade).toFixed(2).replace(".", ",")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1.5rem", borderTop: "2px solid #e2e8f0", paddingTop: "0.75rem", fontSize: "1.1rem", fontWeight: "bold", color: "#0f172a" }}>
                  <span>Total do Pedido:</span>
                  <span style={{ color: "#10b981" }}>
                    R$ {Number(vendaSelecionada.valor_total || 0).toFixed(2).replace(".", ",")}
                  </span>
                </div>

                {isConfirmingCancel && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", padding: "1rem", backgroundColor: "#fef2f2", borderRadius: "8px", border: "1px solid #fee2e2", marginTop: "1.5rem" }}>
                    <p style={{ color: "#991b1b", fontSize: "0.875rem", fontWeight: 600, margin: 0 }}>
                      Confirmar cancelamento da venda #{vendaSelecionada.id}?
                    </p>
                    <p style={{ color: "#7f1d1d", fontSize: "0.75rem", margin: 0 }}>
                      Os itens voltarão ao estoque e a receita financeira será estornada do caixa permanentemente.
                    </p>
                    {cancelErrorMsg && (
                      <p style={{ color: "#ef4444", fontSize: "0.75rem", fontWeight: 600, margin: 0 }}>
                        {cancelErrorMsg}
                      </p>
                    )}
                    <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
                      <Button variant="danger" onClick={() => handleExecuteCancel(vendaSelecionada.id)}>
                        Confirmar
                      </Button>
                      <Button variant="secondary" onClick={() => { setIsConfirmingCancel(false); setCancelErrorMsg(""); }}>
                        Voltar
                      </Button>
                    </div>
                  </div>
                )}

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "1.5rem" }}>
                  {isAdmin && vendaSelecionada.status === "concluida" && !isConfirmingCancel && (
                    <Button 
                      variant="danger" 
                      onClick={() => setIsConfirmingCancel(true)}
                    >
                      Cancelar Venda
                    </Button>
                  )}
                  {!isConfirmingCancel && (
                    <Button onClick={() => setIsDetailsModalOpen(false)}>Fechar</Button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </S.Container>
  );
}