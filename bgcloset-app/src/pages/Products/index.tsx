import { useState, useEffect } from "react";
import { DataTable, type Column } from "../../components/DataTable";
import { Button } from "../../components/Button";
import { Modal } from "../../components/Modal";
import { Input } from "../../components/Input";
import { productService, type Produto } from "../../services/productService.ts";
import * as S from "./styles";

export function Produtos() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const carregarDados = async () => {
      const dados = await productService.getAll();
      setProdutos(dados);
    };
    carregarDados();
  }, []);

  const columns: Column<Produto>[] = [
    { key: "id", label: "ID" },
    { key: "nome", label: "Nome do Produto" },
    {
      key: "preco_venda",
      label: "Preço",
      render: (value) => {
        const numero = Number(value);
        return `R$ ${numero.toFixed(2).replace(".", ",")}`;
      },
    },
    { key: "estoque_atual", label: "Em Estoque" },
    {
      key: "actions",
      label: "Ações",
      render: (_, row) => (
        <S.ActionGroup>
          <Button
            variant="secondary"
            onClick={() => alert(`Editar ${row.nome}`)}
          >
            Editar
          </Button>
          <Button variant="danger" onClick={() => alert(`Excluir ${row.id}`)}>
            Excluir
          </Button>
        </S.ActionGroup>
      ),
    },
  ];

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <S.Container>
      <S.PageHeader>
        <h1>Gestão de Produtos</h1>
        <Button onClick={handleOpenModal}>+ Novo Produto</Button>
      </S.PageHeader>

      <DataTable columns={columns} data={produtos} />

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Cadastrar Novo Produto"
      >
        <S.Form>
          <Input label="Nome do Produto" placeholder="Ex: Camisa Polo" />

          <S.FormRow>
            <Input
              label="Preço de Venda (R$)"
              type="number"
              step="0.01"
              placeholder="0.00"
            />
            <Input label="Estoque Inicial" type="number" placeholder="0" />
          </S.FormRow>

          <Input label="SKU (Código Interno)" placeholder="Ex: CAM-POL-001" />

          <S.FormActions>
            <Button
              type="button"
              variant="secondary"
              onClick={handleCloseModal}
            >
              Cancelar
            </Button>
            <Button type="submit" variant="success">
              Salvar Produto
            </Button>
          </S.FormActions>
        </S.Form>
      </Modal>
    </S.Container>
  );
}
