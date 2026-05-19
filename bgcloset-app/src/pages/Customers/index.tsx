import { useState, useEffect } from "react";
import { DataTable, type Column } from "../../components/DataTable";
import { Button } from "../../components/Button";
import { Modal } from "../../components/Modal";
import { Input } from "../../components/Input";
import { customerService } from "../../services/customerService";
import { type ICustomer } from "../../interfaces/Customer";
import * as S from "./styles";

export function Clientes() {
  const [clientes, setClientes] = useState<ICustomer[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const carregarDados = async () => {
      const dados = await customerService.getAll();
      setClientes(dados);
    };
    carregarDados();
  }, []);

  const columns: Column<ICustomer>[] = [
    { key: "id", label: "ID" },
    { key: "nome", label: "Nome do Cliente" },
    { key: "telefone", label: "Telefone" },
    { key: "email", label: "E-mail" },
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

  return (
    <S.Container>
      <S.PageHeader>
        <h1>Gestão de Clientes</h1>
        <Button onClick={() => setIsModalOpen(true)}>+ Novo Cliente</Button>
      </S.PageHeader>

      <DataTable columns={columns} data={clientes} />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Cadastrar Novo Cliente"
      >
        <S.Form>
          <Input label="Nome Completo" placeholder="Ex: Ana Carolina" />

          <S.FormRow>
            <Input label="CPF" placeholder="000.000.000-00" />
            <Input label="Telefone" placeholder="(00) 00000-0000" />
          </S.FormRow>

          <Input label="E-mail" type="email" placeholder="ana@exemplo.com" />

          <S.FormActions>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" variant="success">
              Salvar Cliente
            </Button>
          </S.FormActions>
        </S.Form>
      </Modal>
    </S.Container>
  );
}
