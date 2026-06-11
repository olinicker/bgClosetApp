import { useState, useEffect } from "react";
import { Settings, Plus } from "lucide-react";
import { DataTable, type Column } from "../../components/DataTable";
import { Button } from "../../components/Button";
import { Modal } from "../../components/Modal";
import { Input } from "../../components/Input";
import { productService, type IProductCategory } from "../../services/productService";
import { type IProduct } from "../../interfaces/Product";
import * as S from "./styles";

export function Produtos() {
  const [produtos, setProdutos] = useState<IProduct[]>([]);
  const [categories, setCategories] = useState<IProductCategory[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Estado para saber se estamos editando (guarda o ID) ou criando (fica null)
  const [produtoIdEmEdicao, setProdutoIdEmEdicao] = useState<number | null>(null);

  const [nome, setNome] = useState("");
  const [precoVenda, setPrecoVenda] = useState("");
  const [estoqueAtual, setEstoqueAtual] = useState("");
  const [sku, setSku] = useState("");
  const [categoria, setCategoria] = useState("");
  const [valorCusto, setValorCusto] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("");

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  
  const [categoryErrorMsg, setCategoryErrorMsg] = useState("");
  const [categorySuccessMsg, setCategorySuccessMsg] = useState("");

  const [confirmDeleteInfo, setConfirmDeleteInfo] = useState<{ id: number; type: "produto" | "categoria"; name: string } | null>(null);
  const [deleteErrorMsg, setDeleteErrorMsg] = useState("");

  const carregarDados = async (filterCategory?: string) => {
    try {
      const dados = await productService.getAll(filterCategory);
      setProdutos(dados);
    } catch (error) {
      console.error("Erro ao carregar produtos. Verifique o servidor e o token.", error);
    }
  };

  const carregarCategorias = async () => {
    try {
      const dados = await productService.getCategories();
      setCategories(dados);
    } catch (error) {
      console.error("Erro ao carregar categorias de produtos.", error);
    }
  };

  useEffect(() => {
    carregarDados(selectedCategoryFilter);
    carregarCategorias();
    try {
      const token = localStorage.getItem("@BG_Token");
      if (token) {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setIsAdmin(payload.perfil === "admin");
      }
    } catch (e) {
      console.error(e);
    }
  }, [selectedCategoryFilter]);

  // Função para limpar tudo e fechar o modal
  const fecharModal = () => {
    setIsModalOpen(false);
    setProdutoIdEmEdicao(null);
    setNome("");
    setPrecoVenda("");
    setEstoqueAtual("");
    setSku("");
    setCategoria("");
    setValorCusto("");
    setErrorMsg("");
    setSuccessMsg("");
  };

  // Função que é chamada ao clicar no botão Editar
  const handleEditarClick = (produto: IProduct) => {
    setProdutoIdEmEdicao(produto.id!);
    setNome(produto.nome);
    setPrecoVenda(produto.preco_venda.toString());
    setEstoqueAtual(produto.estoque_atual.toString());
    setSku(produto.sku || "");
    setCategoria(produto.categoria || "");
    setValorCusto(produto.valor_custo ? produto.valor_custo.toString() : "0");
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setErrorMsg("");
    setSuccessMsg("");
    
    try {
      const dadosProduto = {
        nome,
        preco_venda: Number(precoVenda),
        estoque_atual: Number(estoqueAtual),
        sku: sku.trim() || null,
        valor_custo: Number(valorCusto || 0), 
        categoria, 
      };

      if (produtoIdEmEdicao) {
        await productService.update(produtoIdEmEdicao, dadosProduto);
        setSuccessMsg("Produto atualizado com sucesso!");
      } else {
        await productService.create(dadosProduto);
        setSuccessMsg("Produto cadastrado com sucesso!");
      }
      
      carregarDados(selectedCategoryFilter); 
      setTimeout(() => {
        fecharModal();
      }, 1500);
      
    } catch (error: any) {
      const msg = error.response?.data?.detail || "Erro ao salvar o produto.";
      setErrorMsg(msg);
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    setCategoryErrorMsg("");
    setCategorySuccessMsg("");
    try {
      await productService.createCategory({ nome: newCategoryName.trim() });
      setNewCategoryName("");
      setCategorySuccessMsg("Categoria criada com sucesso!");
      carregarCategorias();
      setTimeout(() => setCategorySuccessMsg(""), 3000);
    } catch (error: any) {
      const msg = error.response?.data?.detail || "Erro ao criar categoria.";
      setCategoryErrorMsg(msg);
    }
  };

  const handleExecuteDelete = async () => {
    if (!confirmDeleteInfo) return;
    const { id, type } = confirmDeleteInfo;
    setDeleteErrorMsg("");
    
    try {
      if (type === "produto") {
        await productService.delete(id);
        setConfirmDeleteInfo(null);
        carregarDados(selectedCategoryFilter);
      } else if (type === "categoria") {
        await productService.deleteCategory(id);
        setConfirmDeleteInfo(null);
        setCategorySuccessMsg("Categoria removida com sucesso!");
        carregarCategorias();
        setTimeout(() => setCategorySuccessMsg(""), 3000);
      }
    } catch (error: any) {
      const msg = error.response?.data?.detail || `Erro ao excluir o(a) ${type === "produto" ? "produto" : "categoria"}.`;
      setDeleteErrorMsg(msg);
    }
  };

  const columns: Column<IProduct>[] = [
    { key: "id", label: "ID" },
    { key: "sku", label: "SKU" },
    { key: "nome", label: "Nome do Produto" },
    { key: "categoria", label: "Categoria" },
    {
      key: "valor_custo",
      label: "Custo",
      render: (value) => {
        const numero = Number(value);
        return `R$ ${numero.toFixed(2).replace(".", ",")}`;
      },
    },
    {
      key: "preco_venda",
      label: "Preço de Venda",
      render: (value) => {
        const numero = Number(value);
        return `R$ ${numero.toFixed(2).replace(".", ",")}`;
      },
    },
    { key: "estoque_atual", label: "Em Estoque" },
  ];

  if (isAdmin) {
    columns.push({
      key: "actions",
      label: "Ações",
      render: (_, row) => (
        <S.ActionGroup>
          <Button variant="secondary" onClick={() => handleEditarClick(row)}>
            Editar
          </Button>
          <Button variant="danger" onClick={() => setConfirmDeleteInfo({ id: row.id!, type: "produto", name: row.nome })}>
            Excluir
          </Button>
        </S.ActionGroup>
      ),
    });
  }

  return (
    <S.Container>
      <S.PageHeader>
        <h1>Gestão de Produtos</h1>
        <div style={{ display: "flex", gap: "1rem" }}>
          {isAdmin && (
            <>
              <Button 
                variant="secondary" 
                onClick={() => setIsCategoryModalOpen(true)}
                style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}
              >
                <Settings size={16} /> Gerenciar Categorias
              </Button>
              <Button 
                onClick={() => { fecharModal(); setIsModalOpen(true); }}
                style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}
              >
                <Plus size={16} /> Novo Produto
              </Button>
            </>
          )}
        </div>
      </S.PageHeader>

      <S.FilterContainer>
        <S.FilterLabel>Filtrar por Categoria:</S.FilterLabel>
        <S.MiniSelect 
          value={selectedCategoryFilter} 
          onChange={(e) => setSelectedCategoryFilter(e.target.value)}
        >
          <option value="">Todas as Categorias</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.nome}>
              {cat.nome}
            </option>
          ))}
        </S.MiniSelect>
      </S.FilterContainer>

      <DataTable columns={columns} data={produtos} />

      {/* Modal de Cadastro/Edição de Produto */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={fecharModal} 
        title={produtoIdEmEdicao ? "Editar Produto" : "Cadastrar Novo Produto"}
      >
        <S.Form onSubmit={handleSubmit}>
          <Input 
            label="Nome do Produto" 
            placeholder="Ex: Camisa Polo" 
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />

          <S.FormRow>
            <S.SelectWrapper>
              <S.SelectLabel>Categoria</S.SelectLabel>
              <S.Select 
                value={categoria} 
                onChange={(e) => setCategoria(e.target.value)}
                required
              >
                <option value="">Selecione uma Categoria</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.nome}>
                    {cat.nome}
                  </option>
                ))}
              </S.Select>
            </S.SelectWrapper>

            <Input 
              label="SKU (Código Interno) - Opcional" 
              placeholder="Ex: CAM-POL-001" 
              value={sku}
              onChange={(e) => setSku(e.target.value)}
            />
          </S.FormRow>

          <S.FormRow>
            <Input
              label="Valor de Custo (R$)"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={valorCusto}
              onChange={(e) => setValorCusto(e.target.value)}
              required
            />
            <Input
              label="Preço de Venda (R$)"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={precoVenda}
              onChange={(e) => setPrecoVenda(e.target.value)}
              required
            />
          </S.FormRow>

          <Input 
            label="Estoque Inicial" 
            type="number" 
            placeholder="0" 
            value={estoqueAtual}
            onChange={(e) => setEstoqueAtual(e.target.value)}
            required
          />

          {errorMsg && <S.ErrorMessage>{errorMsg}</S.ErrorMessage>}
          {successMsg && <S.SuccessMessage>{successMsg}</S.SuccessMessage>}

          <S.FormActions>
            <Button type="button" variant="secondary" onClick={fecharModal}>
              Cancelar
            </Button>
            <Button type="submit" variant={produtoIdEmEdicao ? "primary" : "success"}>
              {produtoIdEmEdicao ? "Atualizar Produto" : "Salvar Produto"}
            </Button>
          </S.FormActions>
        </S.Form>
      </Modal>

      {/* Modal de Gerenciamento de Categorias */}
      <Modal
        isOpen={isCategoryModalOpen}
        onClose={() => {
          setIsCategoryModalOpen(false);
          setCategoryErrorMsg("");
          setCategorySuccessMsg("");
          setNewCategoryName("");
        }}
        title="Gerenciar Categorias de Produtos"
      >
        <S.CategoryForm onSubmit={handleCreateCategory}>
          <div style={{ flex: 1 }}>
            <Input
              label="Nome da Categoria"
              placeholder="Ex: Calças, Acessórios"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              required
            />
          </div>
          <Button type="submit" variant="success" style={{ marginBottom: "1rem" }}>
            Adicionar
          </Button>
        </S.CategoryForm>

        {categoryErrorMsg && <S.ErrorMessage style={{ display: "block", marginBottom: "1rem" }}>{categoryErrorMsg}</S.ErrorMessage>}
        {categorySuccessMsg && <S.SuccessMessage style={{ display: "block", marginBottom: "1rem" }}>{categorySuccessMsg}</S.SuccessMessage>}

        <S.CategoryList>
          {categories.map((cat) => (
            <S.CategoryItem key={cat.id}>
              <S.CategoryName>{cat.nome}</S.CategoryName>
              <Button variant="danger" onClick={() => setConfirmDeleteInfo({ id: cat.id!, type: "categoria", name: cat.nome })}>
                Excluir
              </Button>
            </S.CategoryItem>
          ))}
          {categories.length === 0 && (
            <p style={{ textAlign: "center", color: "#6b7280", padding: "1rem" }}>
              Nenhuma categoria cadastrada.
            </p>
          )}
        </S.CategoryList>
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
            Tem certeza que deseja excluir o(a) {confirmDeleteInfo?.type === "produto" ? "produto" : "categoria"} <strong>{confirmDeleteInfo?.name}</strong>?
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