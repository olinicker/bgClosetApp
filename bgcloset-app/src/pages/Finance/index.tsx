import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { DataTable, type Column } from "../../components/DataTable";
import { Button } from "../../components/Button";
import { Modal } from "../../components/Modal";
import { Input } from "../../components/Input";
import { financeService } from "../../services/financeService";
import { type IMovimentacao, type ICategoriaFinanceira } from "../../interfaces/Finance";
import * as S from "./styles";

export function Financas() {
  const [movimentacoes, setMovimentacoes] = useState<IMovimentacao[]>([]);
  const [categorias, setCategorias] = useState<ICategoriaFinanceira[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Campos do formulário manual
  const [valor, setValor] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [descricao, setDescricao] = useState("");
  const [dataOcorrencia, setDataOcorrencia] = useState(new Date().toISOString().substring(0, 10));

  // Estados de erro/sucesso
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Estados de filtros
  const [filtroTipo, setFiltroTipo] = useState("todos");
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [filtroDataInicio, setFiltroDataInicio] = useState("");
  const [filtroDataFim, setFiltroDataFim] = useState("");

  // Estados para gerenciar categorias
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [catNome, setCatNome] = useState("");
  const [catTipo, setCatTipo] = useState("entrada");
  const [catIdEmEdicao, setCatIdEmEdicao] = useState<number | null>(null);
  const [catErrorMsg, setCatErrorMsg] = useState("");
  const [catSuccessMsg, setCatSuccessMsg] = useState("");

  const [confirmDeleteInfo, setConfirmDeleteInfo] = useState<{ id: number; name: string } | null>(null);
  const [deleteErrorMsg, setDeleteErrorMsg] = useState("");

  const carregarDados = async () => {
    try {
      const [dadosMov, dadosCat] = await Promise.all([
        financeService.getAll(),
        financeService.getCategories()
      ]);
      setMovimentacoes(dadosMov || []);
      setCategorias(dadosCat || []);
    } catch (error) {
      console.error("Erro ao carregar dados financeiros.", error);
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

  const fecharModal = () => {
    setIsModalOpen(false);
    setValor("");
    setCategoriaId("");
    setDescricao("");
    setDataOcorrencia(new Date().toISOString().substring(0, 10));
    setErrorMsg("");
    setSuccessMsg("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!valor || Number(valor) <= 0) {
      setErrorMsg("O valor da movimentação deve ser maior que zero.");
      return;
    }

    if (!categoriaId) {
      setErrorMsg("Selecione uma categoria financeira.");
      return;
    }

    try {
      await financeService.createManual({
        categoria_id: Number(categoriaId),
        valor: Number(valor),
        descricao,
        data_ocorrencia: dataOcorrencia,
      });

      setSuccessMsg("Lançamento financeiro registrado!");
      carregarDados();
      setTimeout(() => {
        fecharModal();
      }, 1500);
    } catch (error: any) {
      const msg = error.response?.data?.detail || "Erro ao salvar lançamento.";
      setErrorMsg(msg);
    }
  };

  const fecharCategoryModal = () => {
    setIsCategoryModalOpen(false);
    setCatNome("");
    setCatTipo("entrada");
    setCatIdEmEdicao(null);
    setCatErrorMsg("");
    setCatSuccessMsg("");
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCatErrorMsg("");
    setCatSuccessMsg("");

    if (!catNome.trim()) {
      setCatErrorMsg("O nome da categoria não pode estar em branco.");
      return;
    }
    if (catNome.trim().length < 3) {
      setCatErrorMsg("O nome da categoria deve conter pelo menos 3 caracteres.");
      return;
    }
    if (!catTipo) {
      setCatErrorMsg("Selecione um tipo para a categoria.");
      return;
    }

    try {
      if (catIdEmEdicao) {
        await financeService.updateCategory(catIdEmEdicao, {
          nome: catNome.trim(),
          tipo: catTipo,
        });
        setCatSuccessMsg("Categoria atualizada com sucesso!");
      } else {
        await financeService.createCategory({
          nome: catNome.trim(),
          tipo: catTipo,
        });
        setCatSuccessMsg("Categoria cadastrada com sucesso!");
      }

      setCatNome("");
      setCatTipo("entrada");
      setCatIdEmEdicao(null);
      carregarDados();
    } catch (error: any) {
      const msg = error.response?.data?.detail || "Erro ao salvar categoria financeira.";
      setCatErrorMsg(msg);
    }
  };

  const handleExecuteDelete = async () => {
    if (!confirmDeleteInfo) return;
    const { id } = confirmDeleteInfo;
    setDeleteErrorMsg("");
    setCatErrorMsg("");
    setCatSuccessMsg("");
    try {
      await financeService.deleteCategory(id);
      setConfirmDeleteInfo(null);
      setCatSuccessMsg("Categoria excluída com sucesso!");
      carregarDados();
      setTimeout(() => setCatSuccessMsg(""), 3000);
    } catch (error: any) {
      const msg = error.response?.data?.detail || "Erro ao excluir categoria financeira. Ela pode possuir lançamentos vinculados.";
      setDeleteErrorMsg(msg);
    }
  };

  // --- FILTRAGEM ---
  const movimentacoesFiltradas = movimentacoes.filter((m) => {
    // 1. Filtro de Tipo
    if (filtroTipo !== "todos") {
      const tipoM = m.tipo_movimentacao.toLowerCase() === "saída" ? "saida" : m.tipo_movimentacao.toLowerCase();
      if (tipoM !== filtroTipo) return false;
    }
    // 2. Filtro de Categoria
    if (filtroCategoria && m.categoria_id !== Number(filtroCategoria)) {
      return false;
    }
    // 3. Filtro de Data Início
    if (filtroDataInicio && m.data_ocorrencia < filtroDataInicio) {
      return false;
    }
    // 4. Filtro de Data Fim
    if (filtroDataFim && m.data_ocorrencia > filtroDataFim) {
      return false;
    }
    return true;
  });

  // --- CÁLCULOS FINANCEIROS ---
  const totalEntradas = movimentacoesFiltradas
    .filter((m) => m.tipo_movimentacao === "entrada")
    .reduce((acc, m) => acc + (m.valor || 0), 0);

  const totalSaidas = movimentacoesFiltradas
    .filter((m) => m.tipo_movimentacao === "saída" || m.tipo_movimentacao === "saida")
    .reduce((acc, m) => acc + (m.valor || 0), 0);

  const saldoCaixa = totalEntradas - totalSaidas;

  const obterNomeCategoria = (id: number) => {
    const cat = categorias.find((c) => c.id === id);
    return cat ? cat.nome : `Categoria #${id}`;
  };

  const formatarMoeda = (val: number) =>
    `R$ ${val.toFixed(2).replace(".", ",")}`;

  const columns: Column<IMovimentacao>[] = [
    { key: "id", label: "ID" },
    {
      key: "data_ocorrencia",
      label: "Data",
      render: (value) => {
        const datePart = String(value).split("T")[0];
        const parts = datePart.split("-");
        if (parts.length === 3) {
          return `${parts[2]}/${parts[1]}/${parts[0]}`;
        }
        return String(value);
      },
    },
    {
      key: "categoria_id",
      label: "Categoria",
      render: (value) => obterNomeCategoria(Number(value)),
    },
    { key: "descricao", label: "Descrição" },
    {
      key: "tipo_movimentacao",
      label: "Tipo",
      render: (value) => (
        <S.Badge type={String(value)}>{String(value)}</S.Badge>
      ),
    },
    {
      key: "valor",
      label: "Valor",
      render: (value, row) => (
        <S.ValueSpan type={row.tipo_movimentacao}>
          {row.tipo_movimentacao === "entrada" ? "+ " : "- "}
          {formatarMoeda(Number(value))}
        </S.ValueSpan>
      ),
    },
  ];

  return (
    <S.Container>
      <S.PageHeader>
        <h1>Fluxo de Caixa & Finanças</h1>
        {isAdmin && (
          <S.ButtonGroup>
            <Button variant="secondary" onClick={() => setIsCategoryModalOpen(true)}>
              ⚙️ Gerenciar Categorias
            </Button>
            <Button onClick={() => setIsModalOpen(true)}>
              + Registrar Ajuste / Lançamento
            </Button>
          </S.ButtonGroup>
        )}
      </S.PageHeader>

      <S.CardsGrid>
        <S.Card>
          <S.CardHeader>
            <h3>Total de Entradas</h3>
            <S.IconBox $variant="success">
              <TrendingUp size={20} />
            </S.IconBox>
          </S.CardHeader>
          <S.CardValue style={{ color: "#10B981" }}>
            {formatarMoeda(totalEntradas)}
          </S.CardValue>
        </S.Card>

        <S.Card>
          <S.CardHeader>
            <h3>Total de Saídas</h3>
            <S.IconBox $variant="danger">
              <TrendingDown size={20} />
            </S.IconBox>
          </S.CardHeader>
          <S.CardValue style={{ color: "#EF4444" }}>
            {formatarMoeda(totalSaidas)}
          </S.CardValue>
        </S.Card>

        <S.Card>
          <S.CardHeader>
            <h3>Saldo em Caixa</h3>
            <S.IconBox $variant={saldoCaixa >= 0 ? "success" : "danger"}>
              <Wallet size={20} />
            </S.IconBox>
          </S.CardHeader>
          <S.CardValue style={{ color: saldoCaixa >= 0 ? "#10B981" : "#EF4444" }}>
            {formatarMoeda(saldoCaixa)}
          </S.CardValue>
        </S.Card>
      </S.CardsGrid>

      {/* Filtros de Fluxo de Caixa */}
      <S.FilterContainer>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", minWidth: "150px", flex: 1 }}>
          <span style={{ fontSize: "0.875rem", fontWeight: 500, color: "#64748b" }}>Tipo</span>
          <S.MiniSelect 
            value={filtroTipo} 
            onChange={(e) => setFiltroTipo(e.target.value)}
            style={{ width: "100%" }}
          >
            <option value="todos">Todos os Lançamentos</option>
            <option value="entrada">Entradas</option>
            <option value="saida">Saídas</option>
          </S.MiniSelect>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", minWidth: "180px", flex: 1 }}>
          <span style={{ fontSize: "0.875rem", fontWeight: 500, color: "#64748b" }}>Categoria</span>
          <S.MiniSelect 
            value={filtroCategoria} 
            onChange={(e) => setFiltroCategoria(e.target.value)}
            style={{ width: "100%" }}
          >
            <option value="">Todas as Categorias</option>
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nome} ({cat.tipo})
              </option>
            ))}
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
              outline: "none",
              marginTop: "0.25rem"
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
              outline: "none",
              marginTop: "0.25rem"
            }}
          />
        </div>

        <div style={{ display: "flex", alignItems: "flex-end" }}>
          <Button 
            variant="secondary" 
            onClick={() => {
              setFiltroTipo("todos");
              setFiltroCategoria("");
              setFiltroDataInicio("");
              setFiltroDataFim("");
            }}
          >
            Limpar Filtros
          </Button>
        </div>
      </S.FilterContainer>

      <S.Section>
        <h2>Histórico de Movimentações</h2>
        <DataTable columns={columns} data={movimentacoesFiltradas} />
      </S.Section>

      <Modal
        isOpen={isModalOpen}
        onClose={fecharModal}
        title="Registrar Movimentação Manual"
      >
        <S.Form onSubmit={handleSubmit}>
          <Input
            label="Valor (R$)"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            required
          />

          <div>
            <S.Label htmlFor="categoria-select">Categoria Financeira</S.Label>
            <S.Select
              id="categoria-select"
              value={categoriaId}
              onChange={(e) => setCategoriaId(e.target.value)}
              required
            >
              <option value="">Selecione uma categoria...</option>
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nome} ({cat.tipo})
                </option>
              ))}
            </S.Select>
          </div>

          <Input
            label="Data de Ocorrência"
            type="date"
            value={dataOcorrencia}
            onChange={(e) => setDataOcorrencia(e.target.value)}
            required
          />

          <Input
            label="Descrição (Opcional)"
            placeholder="Ex: Pagamento de conta de luz"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />

          {errorMsg && <S.ErrorMessage>{errorMsg}</S.ErrorMessage>}
          {successMsg && <S.SuccessMessage>{successMsg}</S.SuccessMessage>}

          <S.FormActions>
            <Button type="button" variant="secondary" onClick={fecharModal}>
              Cancelar
            </Button>
            <Button type="submit" variant="success">
              Salvar Lançamento
            </Button>
          </S.FormActions>
        </S.Form>
      </Modal>

      <Modal
        isOpen={isCategoryModalOpen}
        onClose={fecharCategoryModal}
        title="Gerenciar Categorias Financeiras"
      >
        <S.Form onSubmit={handleCategorySubmit}>
          <S.FormRow>
            <Input
              label="Nome da Categoria"
              placeholder="Ex: Aluguel, Vendas, Salários"
              value={catNome}
              onChange={(e) => setCatNome(e.target.value)}
              required
            />
            <div>
              <S.Label htmlFor="cat-tipo-select" style={{ marginTop: 0 }}>Tipo de Categoria</S.Label>
              <S.Select
                id="cat-tipo-select"
                value={catTipo}
                onChange={(e) => setCatTipo(e.target.value)}
                required
                style={{ marginTop: 0 }}
              >
                <option value="entrada">Entrada</option>
                <option value="saída">Saída</option>
              </S.Select>
            </div>
          </S.FormRow>

          {catErrorMsg && <S.ErrorMessage>{catErrorMsg}</S.ErrorMessage>}
          {catSuccessMsg && <S.SuccessMessage>{catSuccessMsg}</S.SuccessMessage>}

          <S.FormActions>
            {catIdEmEdicao && (
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setCatIdEmEdicao(null);
                  setCatNome("");
                  setCatTipo("entrada");
                  setCatErrorMsg("");
                  setCatSuccessMsg("");
                }}
              >
                Cancelar Edição
              </Button>
            )}
            <Button type="submit" variant={catIdEmEdicao ? "primary" : "success"}>
              {catIdEmEdicao ? "Atualizar Categoria" : "Cadastrar Categoria"}
            </Button>
          </S.FormActions>
        </S.Form>

        <S.CategoryList>
          {categorias.map((cat) => (
            <S.CategoryItem key={cat.id}>
              <S.CategoryInfo>
                <strong>{cat.nome}</strong>
                <S.Badge type={cat.tipo}>{cat.tipo}</S.Badge>
              </S.CategoryInfo>
              <S.CategoryActions>
                <Button
                  variant="primary"
                  onClick={() => {
                    setCatIdEmEdicao(cat.id);
                    setCatNome(cat.nome);
                    setCatTipo(cat.tipo);
                    setCatErrorMsg("");
                    setCatSuccessMsg("");
                  }}
                >
                  Editar
                </Button>
                <Button
                  variant="danger"
                  onClick={() => setConfirmDeleteInfo({ id: cat.id, name: cat.nome })}
                >
                  Excluir
                </Button>
              </S.CategoryActions>
            </S.CategoryItem>
          ))}
        </S.CategoryList>

        <S.FormActions style={{ marginTop: "1.5rem" }}>
          <Button type="button" variant="secondary" onClick={fecharCategoryModal}>
            Fechar
          </Button>
        </S.FormActions>
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
            Tem certeza que deseja excluir a categoria financeira <strong>{confirmDeleteInfo?.name}</strong>?
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
