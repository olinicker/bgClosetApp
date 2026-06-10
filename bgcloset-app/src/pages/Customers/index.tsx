import { useState, useEffect } from "react";
import { DataTable, type Column } from "../../components/DataTable";
import { Button } from "../../components/Button";
import { Modal } from "../../components/Modal";
import { Input } from "../../components/Input";
import { customerService } from "../../services/customerService";
import { vendaService } from "../../services/saleService"; // Importamos o serviço de vendas
import { type ICustomer } from "../../interfaces/Customer";
import { type ISale } from "../../interfaces/Sale"; // Importamos a interface de vendas
import * as S from "./styles";

const formatarCPF = (value: string) => {
  const apenasNumeros = value.replace(/\D/g, "");
  const cpfLimitado = apenasNumeros.substring(0, 11);
  if (cpfLimitado.length <= 3) {
    return cpfLimitado;
  }
  if (cpfLimitado.length <= 6) {
    return `${cpfLimitado.substring(0, 3)}.${cpfLimitado.substring(3)}`;
  }
  if (cpfLimitado.length <= 9) {
    return `${cpfLimitado.substring(0, 3)}.${cpfLimitado.substring(3, 6)}.${cpfLimitado.substring(6)}`;
  }
  return `${cpfLimitado.substring(0, 3)}.${cpfLimitado.substring(3, 6)}.${cpfLimitado.substring(6, 9)}-${cpfLimitado.substring(9)}`;
};

const formatarTelefone = (value: string) => {
  const apenasNumeros = value.replace(/\D/g, "");
  const telLimitado = apenasNumeros.substring(0, 11);
  if (telLimitado.length <= 2) {
    return telLimitado;
  }
  if (telLimitado.length <= 6) {
    return `(${telLimitado.substring(0, 2)}) ${telLimitado.substring(2)}`;
  }
  if (telLimitado.length <= 10) {
    return `(${telLimitado.substring(0, 2)}) ${telLimitado.substring(2, 6)}-${telLimitado.substring(6)}`;
  }
  return `(${telLimitado.substring(0, 2)}) ${telLimitado.substring(2, 7)}-${telLimitado.substring(7)}`;
};

export function Clientes() {
  const [clientes, setClientes] = useState<ICustomer[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // NOVO: Estado para saber se estamos a editar (guarda o ID) ou a criar (fica null)
  const [clienteIdEmEdicao, setClienteIdEmEdicao] = useState<number | null>(null);

  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [confirmDeleteInfo, setConfirmDeleteInfo] = useState<{ id: number; name: string } | null>(null);
  const [deleteErrorMsg, setDeleteErrorMsg] = useState("");

  // Estados para detalhes do cliente
  const [todasAsVendas, setTodasAsVendas] = useState<ISale[]>([]);
  const [clienteSelecionado, setClienteSelecionado] = useState<ICustomer | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const carregarDados = async () => {
    try {
      const [dadosClientes, dadosVendas] = await Promise.all([
        customerService.getAll(),
        vendaService.getAll().catch(() => [])
      ]);
      setClientes(dadosClientes);
      setTodasAsVendas(dadosVendas);
    } catch (error) {
      console.error("Erro ao carregar clientes e vendas.", error);
    }
  };

  useEffect(() => {
    carregarDados();
    try {
      const token = localStorage.getItem("@BG_Token");
      if (token) {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setIsAdmin(payload.perfil === "admin");
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // NOVO: Função para limpar tudo e fechar o modal
  const fecharModal = () => {
    setIsModalOpen(false);
    setClienteIdEmEdicao(null);
    setNome("");
    setCpf("");
    setTelefone("");
    setEmail("");
    setErrorMsg("");
    setSuccessMsg("");
  };

  // NOVO: Função que é chamada ao clicar no botão Editar da tabela
  const handleEditarClick = (cliente: ICustomer) => {
    setClienteIdEmEdicao(cliente.id!); // Avisa o sistema que é uma edição
    setNome(cliente.nome);             // Preenche os campos
    setCpf(cliente.cpf || "");
    setTelefone(cliente.telefone || "");
    setEmail(cliente.email || "");
    setIsModalOpen(true);              // Abre o modal
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    
    try {
      const dadosCliente = {
        nome: nome.trim(),
        cpf: cpf.trim() || null,
        telefone: telefone.trim() || null,
        email: email.trim() || null,
      };

      if (clienteIdEmEdicao) {
        await customerService.update(clienteIdEmEdicao, dadosCliente);
        setSuccessMsg("Cliente atualizado com sucesso!");
      } else {
        await customerService.create(dadosCliente);
        setSuccessMsg("Cliente cadastrado com sucesso!");
      }
      
      carregarDados();
      setTimeout(() => {
        fecharModal();
      }, 1500);
    } catch (error: any) {
      const msg = error.response?.data?.detail || "Erro ao salvar cliente na API.";
      setErrorMsg(msg);
    }
  };

  const handleExecuteDelete = async () => {
    if (!confirmDeleteInfo) return;
    const { id } = confirmDeleteInfo;
    setDeleteErrorMsg("");
    try {
      await customerService.delete(id);
      setConfirmDeleteInfo(null);
      carregarDados();
    } catch (error: any) {
      const msg = error.response?.data?.detail || "Erro ao excluir o cliente. Ele pode possuir vendas vinculadas.";
      setDeleteErrorMsg(msg);
    }
  };

  const handleVerDetalhesClick = (cliente: ICustomer) => {
    setClienteSelecionado(cliente);
    setIsDetailsModalOpen(true);
  };

  const columns: Column<ICustomer>[] = [
    { key: "id", label: "ID" },
    { key: "nome", label: "Nome do Cliente" },
    { key: "cpf", label: "CPF" },
    { key: "telefone", label: "Telefone" },
    { key: "email", label: "E-mail" },
    {
      key: "actions",
      label: "Ações",
      render: (_, row) => (
        <S.ActionGroup>
          <Button variant="secondary" onClick={() => handleVerDetalhesClick(row)}>
            Detalhes
          </Button>
          {isAdmin && (
            <>
              <Button variant="primary" onClick={() => handleEditarClick(row)}>
                Editar
              </Button>
              <Button variant="danger" onClick={() => setConfirmDeleteInfo({ id: row.id!, name: row.nome })}>
                Excluir
              </Button>
            </>
          )}
        </S.ActionGroup>
      ),
    },
  ];

  return (
    <S.Container>
      <S.PageHeader>
        <h1>Gestão de Clientes</h1>
        <Button onClick={() => { fecharModal(); setIsModalOpen(true); }}>
          + Novo Cliente
        </Button>
      </S.PageHeader>

      <DataTable columns={columns} data={clientes} />

      <Modal
        isOpen={isModalOpen}
        onClose={fecharModal}
        title={clienteIdEmEdicao ? "Editar Cliente" : "Cadastrar Novo Cliente"}
      >
        <S.Form onSubmit={handleSubmit}>
          <Input 
            label="Nome Completo" 
            placeholder="Ex: Ana Carolina" 
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />

          <S.FormRow>
            <Input 
              label="CPF" 
              placeholder="000.000.000-00" 
              value={cpf}
              onChange={(e) => setCpf(formatarCPF(e.target.value))}
            />
            <Input 
              label="Telefone" 
              placeholder="(00) 00000-0000" 
              value={telefone}
              onChange={(e) => setTelefone(formatarTelefone(e.target.value))}
            />
          </S.FormRow>

          <Input 
            label="E-mail" 
            type="email" 
            placeholder="ana@exemplo.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {errorMsg && <S.ErrorMessage>{errorMsg}</S.ErrorMessage>}
          {successMsg && <S.SuccessMessage>{successMsg}</S.SuccessMessage>}

          <S.FormActions>
            <Button type="button" variant="secondary" onClick={fecharModal}>
              Cancelar
            </Button>
            <Button type="submit" variant={clienteIdEmEdicao ? "primary" : "success"}>
              {clienteIdEmEdicao ? "Atualizar Cliente" : "Salvar Cliente"}
            </Button>
          </S.FormActions>
        </S.Form>
      </Modal>

      {/* Modal de Detalhes do Cliente */}
      <Modal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        title="Perfil do Cliente & Histórico de Compras"
      >
        {clienteSelecionado && (
          <div>
            <S.DetailCard>
              <h3>Dados Cadastrais</h3>
              <S.DetailRow>
                <strong>Nome:</strong>
                <span>{clienteSelecionado.nome}</span>
              </S.DetailRow>
              <S.DetailRow>
                <strong>CPF:</strong>
                <span>{clienteSelecionado.cpf || "Não informado"}</span>
              </S.DetailRow>
              <S.DetailRow>
                <strong>Telefone:</strong>
                <span>{clienteSelecionado.telefone || "Não informado"}</span>
              </S.DetailRow>
              <S.DetailRow>
                <strong>E-mail:</strong>
                <span>{clienteSelecionado.email || "Não informado"}</span>
              </S.DetailRow>
            </S.DetailCard>

            <S.DetailCard style={{ marginBottom: 0 }}>
              <h3>Histórico de Compras</h3>
              {todasAsVendas.filter((v) => v.cliente_id === clienteSelecionado.id).length === 0 ? (
                <p style={{ fontSize: "0.875rem", color: "#94a3b8", textAlign: "center", margin: "1rem 0 0 0" }}>
                  Nenhuma compra registrada para este cliente.
                </p>
              ) : (
                <div style={{ maxHeight: "250px", overflowY: "auto", marginTop: "0.5rem" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem", textAlign: "left" }}>
                    <thead>
                      <tr style={{ borderBottom: "2px solid #e2e8f0", color: "#64748b" }}>
                        <th style={{ padding: "0.5rem 0" }}>Pedido</th>
                        <th style={{ padding: "0.5rem 0" }}>Data</th>
                        <th style={{ padding: "0.5rem 0" }}>Status</th>
                        <th style={{ padding: "0.5rem 0" }}>Pagamento</th>
                        <th style={{ padding: "0.5rem 0", textAlign: "right" }}>Valor</th>
                      </tr>
                    </thead>
                    <tbody>
                      {todasAsVendas
                        .filter((v) => v.cliente_id === clienteSelecionado.id)
                        .map((venda) => {
                          const isCancelada = venda.status === "cancelada";
                          const isConsignada = venda.status === "consignada";
                          return (
                            <tr 
                              key={venda.id} 
                              style={{ 
                                borderBottom: "1px solid #f1f5f9", 
                                color: isCancelada ? "#94a3b8" : "#334155" 
                              }}
                            >
                              <td style={{ padding: "0.5rem 0", textDecoration: isCancelada ? "line-through" : "none" }}>
                                #{venda.id}
                              </td>
                              <td style={{ padding: "0.5rem 0", textDecoration: isCancelada ? "line-through" : "none" }}>
                                {String(venda.data_venda).split("-").reverse().join("/")}
                              </td>
                              <td style={{ padding: "0.5rem 0" }}>
                                {isCancelada ? (
                                  <span style={{ color: "#ef4444", fontWeight: 600, display: "inline-block" }}>
                                    Cancelada
                                  </span>
                                ) : isConsignada ? (
                                  <span style={{ color: "#f97316", fontWeight: 600, display: "inline-block" }}>
                                    Consignada
                                  </span>
                                ) : (
                                  <span style={{ color: "#10b981", fontWeight: 600, display: "inline-block" }}>
                                    Concluída
                                  </span>
                                )}
                              </td>
                              <td style={{ padding: "0.5rem 0", textDecoration: isCancelada ? "line-through" : "none" }}>
                                {venda.metodo_pagamento}
                              </td>
                              <td style={{ padding: "0.5rem 0", textAlign: "right", fontWeight: 600, textDecoration: isCancelada ? "line-through" : "none" }}>
                                R$ {Number(venda.valor_total).toFixed(2).replace(".", ",")}
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              )}
            </S.DetailCard>

            <S.FormActions>
              <Button onClick={() => setIsDetailsModalOpen(false)}>Fechar</Button>
            </S.FormActions>
          </div>
        )}
      </Modal>

      {/* Modal de Confirmação de Exclusão Customizado */}
      <Modal
        isOpen={confirmDeleteInfo !== null}
        onClose={() => {
          setConfirmDeleteInfo(null);
          setDeleteErrorMsg("");
        }}
        title="Confirmar Exclusão"
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1rem" }}>
          <p style={{ color: "#1E293B", fontSize: "1rem" }}>
            Tem certeza que deseja excluir o cliente <strong>{confirmDeleteInfo?.name}</strong>?
          </p>
          <p style={{ color: "#ef4444", fontSize: "0.875rem", fontWeight: 500 }}>
            Esta ação não pode ser desfeita e removerá os dados permanentemente.
          </p>

          {deleteErrorMsg && (
            <S.ErrorMessage style={{ display: "block", textAlign: "left", marginTop: "0.5rem" }}>
              {deleteErrorMsg}
            </S.ErrorMessage>
          )}
          
          <S.FormActions style={{ marginTop: "1rem" }}>
            <Button type="button" variant="secondary" onClick={() => {
              setConfirmDeleteInfo(null);
              setDeleteErrorMsg("");
            }}>
              Cancelar
            </Button>
            <Button type="button" variant="danger" onClick={handleExecuteDelete}>
              Confirmar Exclusão
            </Button>
          </S.FormActions>
        </div>
      </Modal>
    </S.Container>
  );
}