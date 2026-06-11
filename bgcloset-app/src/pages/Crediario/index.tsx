import { useState, useEffect } from "react";
import { Users, DollarSign } from "lucide-react";
import { DataTable, type Column } from "../../components/DataTable";
import { Button } from "../../components/Button";
import { Modal } from "../../components/Modal";
import { Input } from "../../components/Input";
import { customerService } from "../../services/customerService";
import { type ICustomer } from "../../interfaces/Customer";
import { type IDebitPayment } from "../../interfaces/DebitPayment";
import * as S from "./styles";

export function Crediario() {
  const [clientes, setClientes] = useState<ICustomer[]>([]);
  const [loading, setLoading] = useState(false);

  // Filtros
  const [searchQuery, setSearchQuery] = useState("");
  const [mostrarApenasDevedores, setMostrarApenasDevedores] = useState(true);

  // Estados do Modal de Pagamento
  const [selectedClient, setSelectedClient] = useState<ICustomer | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [valorPago, setValorPago] = useState("");
  const [metodoPagamento, setMetodoPagamento] = useState("PIX");
  const [descricao, setDescricao] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Estados do Modal de Histórico de Pagamentos
  const [isHistoricoOpen, setIsHistoricoOpen] = useState(false);
  const [clientHistorico, setClientHistorico] = useState<ICustomer | null>(null);
  const [historicoPagamentos, setHistoricoPagamentos] = useState<IDebitPayment[]>([]);
  const [loadingHistorico, setLoadingHistorico] = useState(false);

  const carregarDados = async () => {
    setLoading(true);
    try {
      const dados = await customerService.getAll();
      setClientes(dados || []);
    } catch (error) {
      console.error("Erro ao carregar clientes para o crediário.", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const abrirModalPagamento = (cliente: ICustomer) => {
    setSelectedClient(cliente);
    setValorPago(String(Number(cliente.saldo_devedor) || 0));
    setMetodoPagamento("PIX");
    setDescricao(`Recebimento de Crediário - ${cliente.nome}`);
    setErrorMsg("");
    setSuccessMsg("");
    setIsModalOpen(true);
  };

  const fecharModal = () => {
    setIsModalOpen(false);
    setSelectedClient(null);
    setValorPago("");
    setMetodoPagamento("PIX");
    setDescricao("");
    setErrorMsg("");
    setSuccessMsg("");
  };

  const abrirModalHistorico = async (cliente: ICustomer) => {
    setClientHistorico(cliente);
    setIsHistoricoOpen(true);
    setLoadingHistorico(true);
    try {
      if (cliente.id) {
        const pagamentos = await customerService.getDebtPayments(cliente.id);
        setHistoricoPagamentos(pagamentos || []);
      }
    } catch (error) {
      console.error("Erro ao carregar histórico de pagamentos", error);
    } finally {
      setLoadingHistorico(false);
    }
  };

  const fecharModalHistorico = () => {
    setIsHistoricoOpen(false);
    setClientHistorico(null);
    setHistoricoPagamentos([]);
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!selectedClient || !selectedClient.id) return;

    const valor = Number(valorPago);
    if (isNaN(valor) || valor <= 0) {
      setErrorMsg("Insira um valor de pagamento válido maior que zero.");
      return;
    }

    const saldoAtual = Number(selectedClient.saldo_devedor) || 0;
    if (valor > saldoAtual) {
      setErrorMsg(`O valor de pagamento não pode ser maior que o saldo devedor (R$ ${saldoAtual.toFixed(2).replace(".", ",")}).`);
      return;
    }

    try {
      await customerService.payDebt(selectedClient.id, {
        valor_pago: valor,
        metodo_pagamento: metodoPagamento,
        descricao: descricao.trim() || undefined,
      });

      setSuccessMsg("Pagamento registrado com sucesso!");
      carregarDados();
      setTimeout(() => {
        fecharModal();
      }, 1500);
    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.detail || "Erro ao registrar o pagamento.";
      setErrorMsg(msg);
    }
  };

  const formatarMoeda = (val: number) =>
    `R$ ${val.toFixed(2).replace(".", ",")}`;

  // Filtragem local dos clientes
  const clientesFiltrados = clientes.filter((c) => {
    const matchesSearch = c.nome.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (c.cpf && c.cpf.includes(searchQuery)) ||
                          (c.telefone && c.telefone.includes(searchQuery));
    
    const saldo = Number(c.saldo_devedor) || 0;
    const matchesDevedores = !mostrarApenasDevedores || saldo > 0;

    return matchesSearch && matchesDevedores;
  });

  // Métricas do Crediário
  const devedoresTotais = clientes.filter((c) => (Number(c.saldo_devedor) || 0) > 0);
  const totalAReceber = devedoresTotais.reduce((acc, c) => acc + (Number(c.saldo_devedor) || 0), 0);

  const columns: Column<ICustomer>[] = [
    { key: "id", label: "ID" },
    { key: "nome", label: "Nome" },
    { key: "telefone", label: "Telefone" },
    { key: "cpf", label: "CPF" },
    {
      key: "saldo_devedor",
      label: "Saldo Devedor",
      render: (value) => {
        const saldo = Number(value || 0);
        return saldo > 0 ? (
          <S.DebtBadge>{formatarMoeda(saldo)}</S.DebtBadge>
        ) : (
          <span style={{ color: "#64748b" }}>R$ 0,00</span>
        );
      },
    },
    {
      key: "actions",
      label: "Ações",
      render: (_, row) => {
        const saldo = Number(row.saldo_devedor) || 0;
        return (
          <div style={{ display: "flex", gap: "0.5rem" }}>
            {saldo > 0 && (
              <Button onClick={() => abrirModalPagamento(row)} variant="success">
                Pagar
              </Button>
            )}
            <Button onClick={() => abrirModalHistorico(row)} variant="secondary">
              Histórico
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <S.Container>
      <S.PageHeader>
        <h1>Crediário (Controle de Débitos)</h1>
      </S.PageHeader>

      <S.CardsGrid>
        <S.Card>
          <S.CardHeader>
            <h3>Clientes com Pendências</h3>
            <S.IconBox $variant="warning">
              <Users size={20} />
            </S.IconBox>
          </S.CardHeader>
          <S.CardValue style={{ color: "#d97706" }}>
            {devedoresTotais.length}
          </S.CardValue>
        </S.Card>

        <S.Card>
          <S.CardHeader>
            <h3>Total a Receber</h3>
            <S.IconBox $variant="primary">
              <DollarSign size={20} />
            </S.IconBox>
          </S.CardHeader>
          <S.CardValue style={{ color: "#2563eb" }}>
            {formatarMoeda(totalAReceber)}
          </S.CardValue>
        </S.Card>
      </S.CardsGrid>

      <S.Section>
        <h2>Clientes Devedores</h2>

        <S.FilterContainer>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", flex: 1, minWidth: "220px" }}>
            <span style={{ fontSize: "0.875rem", fontWeight: 500, color: "#64748b" }}>Buscar Cliente</span>
            <S.SearchInput
              placeholder="Digite o nome, telefone ou CPF..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ maxWidth: "100%" }}
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", height: "38px" }}>
            <input
              type="checkbox"
              id="mostrar-devedores-checkbox"
              checked={mostrarApenasDevedores}
              onChange={(e) => setMostrarApenasDevedores(e.target.checked)}
              style={{ cursor: "pointer", width: "18px", height: "18px" }}
            />
            <label 
              htmlFor="mostrar-devedores-checkbox" 
              style={{ fontSize: "0.875rem", fontWeight: 500, color: "#475569", cursor: "pointer", userSelect: "none" }}
            >
              Mostrar apenas clientes com saldo devedor
            </label>
          </div>
        </S.FilterContainer>

        {loading ? (
          <p style={{ textAlign: "center", color: "#64748b", padding: "2rem" }}>Carregando dados...</p>
        ) : (
          <DataTable columns={columns} data={clientesFiltrados} />
        )}
      </S.Section>

      {/* Modal de Pagamento de Débito */}
      <Modal
        isOpen={isModalOpen}
        onClose={fecharModal}
        title={selectedClient ? `Registrar Recebimento - ${selectedClient.nome}` : "Registrar Recebimento"}
      >
        {selectedClient && (
          <S.Form onSubmit={handlePaymentSubmit}>
            <p style={{ fontSize: "0.95rem", color: "#334155", margin: 0 }}>
              Saldo Devedor Atual: <strong style={{ color: "#b45309" }}>{formatarMoeda(selectedClient.saldo_devedor || 0)}</strong>
            </p>

            <Input
              label="Valor Recebido (R$)"
              type="number"
              step="0.01"
              min="0.01"
              max={Number(selectedClient.saldo_devedor) || 0}
              value={valorPago}
              onChange={(e) => setValorPago(e.target.value)}
              required
              placeholder="0,00"
            />

            <div>
              <S.Label htmlFor="metodo-pagamento-select">Forma de Recebimento</S.Label>
              <S.Select
                id="metodo-pagamento-select"
                value={metodoPagamento}
                onChange={(e) => setMetodoPagamento(e.target.value)}
                required
              >
                <option value="PIX">PIX</option>
                <option value="Dinheiro">Dinheiro</option>
                <option value="Cartão de Crédito">Cartão de Crédito</option>
                <option value="Cartão de Débito">Cartão de Débito</option>
              </S.Select>
            </div>

            <Input
              label="Descrição / Observação"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Ex: Recebimento parcial do crediário"
            />

            {errorMsg && <S.ErrorMessage>{errorMsg}</S.ErrorMessage>}
            {successMsg && <S.SuccessMessage>{successMsg}</S.SuccessMessage>}

            <S.FormActions>
              <Button type="button" variant="secondary" onClick={fecharModal}>
                Cancelar
              </Button>
              <Button type="submit" variant="success">
                Confirmar Recebimento
              </Button>
            </S.FormActions>
          </S.Form>
        )}
      </Modal>

      {/* Modal de Histórico de Pagamentos */}
      <Modal
        isOpen={isHistoricoOpen}
        onClose={fecharModalHistorico}
        title={clientHistorico ? `Histórico de Pagamentos - ${clientHistorico.nome}` : "Histórico de Pagamentos"}
      >
        {loadingHistorico ? (
          <p style={{ textAlign: "center", color: "#64748b", padding: "1.5rem" }}>Carregando histórico...</p>
        ) : historicoPagamentos.length === 0 ? (
          <p style={{ textAlign: "center", color: "#64748b", padding: "1.5rem" }}>
            Nenhum pagamento registrado para este cliente.
          </p>
        ) : (
          <div style={{ overflowX: "auto", width: "100%", marginTop: "1rem" }}>
            <table style={{ width: "100%", minWidth: "500px", borderCollapse: "collapse", fontSize: "0.875rem", textAlign: "left" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #e2e8f0", color: "#64748b" }}>
                  <th style={{ padding: "0.75rem 0.5rem" }}>Data</th>
                  <th style={{ padding: "0.75rem 0.5rem" }}>Método</th>
                  <th style={{ padding: "0.75rem 0.5rem" }}>Descrição</th>
                  <th style={{ padding: "0.75rem 0.5rem", textAlign: "right" }}>Valor Pago</th>
                </tr>
              </thead>
              <tbody>
                {historicoPagamentos.map((pag, idx) => (
                  <tr key={idx} style={{ borderBottom: "1px solid #f1f5f9", color: "#334155" }}>
                    <td style={{ padding: "0.75rem 0.5rem" }}>
                      {String(pag.data_pagamento).split("-").reverse().join("/")}
                    </td>
                    <td style={{ padding: "0.75rem 0.5rem" }}>{pag.metodo_pagamento}</td>
                    <td style={{ padding: "0.75rem 0.5rem", color: "#64748b" }}>{pag.descricao || "-"}</td>
                    <td style={{ padding: "0.75rem 0.5rem", textAlign: "right", fontWeight: 600, color: "#10b981" }}>
                      {formatarMoeda(Number(pag.valor_pago) || 0)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1.5rem" }}>
          <Button variant="secondary" onClick={fecharModalHistorico}>
            Fechar
          </Button>
        </div>
      </Modal>
    </S.Container>
  );
}
