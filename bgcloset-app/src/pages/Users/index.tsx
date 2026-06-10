import { useState, useEffect } from "react";
import { DataTable, type Column } from "../../components/DataTable";
import { Button } from "../../components/Button";
import { Modal } from "../../components/Modal";
import { Input } from "../../components/Input";
import { userService } from "../../services/userService";
import { type IUser } from "../../interfaces/User";
import * as S from "./styles";

export function Users() {
  const [usuarios, setUsuarios] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState("");
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  // Filtros
  const [searchQuery, setSearchQuery] = useState("");

  // Estados do Modal de Cadastro/Edição
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userIdEmEdicao, setUserIdEmEdicao] = useState<number | null>(null);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [perfil, setPerfil] = useState("vendedor");
  const [senha, setSenha] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Estados do Modal de Exclusão
  const [confirmDeleteInfo, setConfirmDeleteInfo] = useState<{ id: number; name: string } | null>(null);
  const [deleteErrorMsg, setDeleteErrorMsg] = useState("");

  const carregarDados = async () => {
    setLoading(true);
    try {
      const dados = await userService.getAll();
      setUsuarios(dados || []);
    } catch (error) {
      console.error("Erro ao carregar usuários.", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    try {
      const token = localStorage.getItem("@BG_Token");
      if (token) {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const isUserAdmin = payload.perfil === "admin";
        setIsAdmin(isUserAdmin);
        setCurrentUserEmail(payload.email || "");
        setCurrentUserId(payload.id ? Number(payload.id) : null);
        if (isUserAdmin) {
          carregarDados();
        }
      }
    } catch (e) {
      console.error("Erro ao processar token de autenticação.", e);
    }
  }, []);

  const abrirModalCadastro = () => {
    setUserIdEmEdicao(null);
    setNome("");
    setEmail("");
    setPerfil("vendedor");
    setSenha("");
    setErrorMsg("");
    setSuccessMsg("");
    setIsModalOpen(true);
  };

  const abrirModalEdicao = (user: IUser) => {
    setUserIdEmEdicao(user.id || null);
    setNome(user.nome);
    setEmail(user.email);
    setPerfil(user.perfil);
    setSenha(""); // Deixa senha em branco para edição
    setErrorMsg("");
    setSuccessMsg("");
    setIsModalOpen(true);
  };

  const fecharModal = () => {
    setIsModalOpen(false);
    setUserIdEmEdicao(null);
    setNome("");
    setEmail("");
    setPerfil("vendedor");
    setSenha("");
    setErrorMsg("");
    setSuccessMsg("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!nome.trim() || !email.trim()) {
      setErrorMsg("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    if (!userIdEmEdicao && !senha) {
      setErrorMsg("A senha é obrigatória para cadastrar um novo usuário.");
      return;
    }

    const dadosUsuario = {
      nome: nome.trim(),
      email: email.trim(),
      perfil,
      ...(senha ? { senha } : {}),
    };

    try {
      if (userIdEmEdicao) {
        await userService.update(userIdEmEdicao, dadosUsuario);
        setSuccessMsg("Usuário atualizado com sucesso!");
      } else {
        await userService.create(dadosUsuario);
        setSuccessMsg("Usuário cadastrado com sucesso!");
      }
      carregarDados();
      setTimeout(() => {
        fecharModal();
      }, 1500);
    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.detail || "Erro ao salvar o usuário.";
      setErrorMsg(msg);
    }
  };

  const abrirConfirmarExclusao = (user: IUser) => {
    setDeleteErrorMsg("");
    if (user.id === currentUserId || user.email === currentUserEmail) {
      alert("Você não pode excluir a sua própria conta.");
      return;
    }
    setConfirmDeleteInfo({ id: user.id!, name: user.nome });
  };

  const handleExecuteDelete = async () => {
    if (!confirmDeleteInfo) return;
    setDeleteErrorMsg("");
    try {
      await userService.delete(confirmDeleteInfo.id);
      setConfirmDeleteInfo(null);
      carregarDados();
    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.detail || "Erro ao excluir o usuário.";
      setDeleteErrorMsg(msg);
    }
  };

  const usuariosFiltrados = usuarios.filter((u) => {
    const term = searchQuery.toLowerCase();
    return u.nome.toLowerCase().includes(term) || u.email.toLowerCase().includes(term);
  });

  const columns: Column<IUser>[] = [
    { key: "id", label: "ID" },
    { key: "nome", label: "Nome" },
    { key: "email", label: "E-mail" },
    {
      key: "perfil",
      label: "Perfil de Acesso",
      render: (value) => {
        const perf = String(value);
        return perf === "admin" ? (
          <span style={{ color: "#ef4444", fontWeight: 600 }}>Administrador</span>
        ) : (
          <span style={{ color: "#3b82f6", fontWeight: 500 }}>Vendedor</span>
        );
      },
    },
    {
      key: "actions",
      label: "Ações",
      render: (_, row) => {
        const isSelf = row.id === currentUserId || row.email === currentUserEmail;
        return (
          <S.ActionGroup>
            <Button onClick={() => abrirModalEdicao(row)} variant="primary">
              Editar
            </Button>
            {!isSelf && (
              <Button onClick={() => abrirConfirmarExclusao(row)} variant="danger">
                Excluir
              </Button>
            )}
          </S.ActionGroup>
        );
      },
    },
  ];

  if (!isAdmin) {
    return (
      <S.RestrictedContainer>
        <h2>⚠️ Acesso Restrito</h2>
        <p>Você não tem privilégios de administrador para visualizar e gerenciar os usuários do sistema.</p>
        <p style={{ fontSize: "0.875rem" }}>Caso precise de acesso, entre em contato com o proprietário do sistema.</p>
      </S.RestrictedContainer>
    );
  }

  return (
    <S.Container>
      <S.PageHeader>
        <h1>Gerenciamento de Usuários</h1>
        <Button onClick={abrirModalCadastro} variant="success">
          Novo Usuário
        </Button>
      </S.PageHeader>

      <S.Section style={{ backgroundColor: "#ffffff", padding: "1.5rem", borderRadius: "12px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "flex-end", marginBottom: "1rem" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", flex: 1, minWidth: "250px" }}>
            <span style={{ fontSize: "0.875rem", fontWeight: 500, color: "#64748b" }}>Buscar Usuário</span>
            <input
              type="text"
              placeholder="Digite o nome ou e-mail..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                padding: "0.5rem",
                borderRadius: "6px",
                border: "1px solid #cbd5e1",
                outline: "none",
                fontSize: "0.875rem",
                width: "100%",
                maxWidth: "350px",
              }}
            />
          </div>
        </div>

        {loading ? (
          <p style={{ textAlign: "center", color: "#64748b", padding: "2rem" }}>Carregando dados...</p>
        ) : (
          <DataTable columns={columns} data={usuariosFiltrados} />
        )}
      </S.Section>

      {/* Modal de Criar/Editar Usuário */}
      <Modal
        isOpen={isModalOpen}
        onClose={fecharModal}
        title={userIdEmEdicao ? `Editar Usuário` : "Cadastrar Novo Usuário"}
      >
        <S.Form onSubmit={handleSubmit}>
          <Input
            label="Nome Completo"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            placeholder="Ex: João da Silva"
          />

          <Input
            label="E-mail (Login)"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Ex: joao@email.com"
          />

          <div>
            <S.Label htmlFor="perfil-select">Perfil de Acesso</S.Label>
            <S.Select
              id="perfil-select"
              value={perfil}
              onChange={(e) => setPerfil(e.target.value)}
              required
            >
              <option value="vendedor">Vendedor</option>
              <option value="admin">Administrador</option>
            </S.Select>
          </div>

          <Input
            label={userIdEmEdicao ? "Nova Senha (deixe em branco para manter)" : "Senha de Acesso"}
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required={!userIdEmEdicao}
            placeholder={userIdEmEdicao ? "Senha atual inalterada" : "Digite a senha"}
          />

          {errorMsg && <S.ErrorMessage>{errorMsg}</S.ErrorMessage>}
          {successMsg && <S.SuccessMessage>{successMsg}</S.SuccessMessage>}

          <S.FormActions>
            <Button type="button" variant="secondary" onClick={fecharModal}>
              Cancelar
            </Button>
            <Button type="submit" variant="success">
              {userIdEmEdicao ? "Salvar Alterações" : "Cadastrar Usuário"}
            </Button>
          </S.FormActions>
        </S.Form>
      </Modal>

      {/* Modal de Confirmação de Exclusão */}
      <Modal
        isOpen={confirmDeleteInfo !== null}
        onClose={() => setConfirmDeleteInfo(null)}
        title="Confirmar Exclusão"
      >
        {confirmDeleteInfo && (
          <div>
            <p style={{ margin: 0, color: "#334155" }}>
              Você tem certeza que deseja remover o usuário <strong>{confirmDeleteInfo.name}</strong>?
            </p>
            <p style={{ margin: "0.5rem 0 0 0", fontSize: "0.825rem", color: "#64748b" }}>
              Esta ação removerá permanentemente o acesso dele ao sistema e não poderá ser desfeita.
            </p>

            {deleteErrorMsg && <S.ErrorMessage>{deleteErrorMsg}</S.ErrorMessage>}

            <S.FormActions>
              <Button type="button" variant="secondary" onClick={() => setConfirmDeleteInfo(null)}>
                Cancelar
              </Button>
              <Button type="button" variant="danger" onClick={handleExecuteDelete}>
                Excluir Usuário
              </Button>
            </S.FormActions>
          </div>
        )}
      </Modal>
    </S.Container>
  );
}
