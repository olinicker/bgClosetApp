import { useState } from "react";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { vendaService } from "../../services/saleService";
import { type ISaleItem, type CriarSaleDTO } from "../../interfaces/Sale";
import * as S from "./styles";

export function Vendas() {
  const [carrinho, setCarrinho] = useState<ISaleItem[]>([]);

  // Estados para o formulário de adicionar item
  const [produtoNome, setProdutoNome] = useState("");
  const [quantidade, setQuantidade] = useState("1");
  const [precoUnitario, setPrecoUnitario] = useState("");

  // Estado para o pagamento
  const [metodoPagamento, setMetodoPagamento] = useState("PIX");

  const handleAdicionarItem = () => {
    if (!produtoNome || !quantidade || !precoUnitario) {
      alert("Preencha os dados do produto!");
      return;
    }

    const qtd = Number(quantidade);
    const preco = Number(precoUnitario);

    const novoItem: ISaleItem = {
      produto_id: Math.floor(Math.random() * 1000),
      nome_produto: produtoNome,
      quantidade: qtd,
      preco_unitario: preco,
      subtotal: qtd * preco,
    };

    setCarrinho([...carrinho, novoItem]);

    setProdutoNome("");
    setQuantidade("1");
    setPrecoUnitario("");
  };

  const handleRemoverItem = (indexParaRemover: number) => {
    setCarrinho(carrinho.filter((_, index) => index !== indexParaRemover));
  };

  const valorTotal = carrinho.reduce((acc, item) => acc + item.subtotal, 0);

  const handleFinalizarVenda = async () => {
    if (carrinho.length === 0) {
      alert("O carrinho está vazio!");
      return;
    }

    const novaVenda: CriarSaleDTO = {
      usuario_id: 1,
      metodo_pagamento: metodoPagamento,
      itens: carrinho.map((item) => ({
        produto_id: item.produto_id,
        quantidade: item.quantidade,
        preco_unitario: item.preco_unitario,
      })),
    };

    try {
      await vendaService.create(novaVenda);
      alert("Venda finalizada com sucesso!");
      setCarrinho([]);
    } catch {
      alert("Erro ao finalizar a venda. Tente novamente.");
    }
  };

  const formatarMoeda = (valor: number) =>
    `R$ ${valor.toFixed(2).replace(".", ",")}`;

  return (
    <S.Container>
      <S.PageHeader>
        <h1>PDV - Frente de Caixa</h1>
      </S.PageHeader>

      <S.Content>
        <S.Panel>
          <S.PanelTitle>Adicionar Item</S.PanelTitle>

          <S.FormRow>
            <Input
              label="Buscar Produto"
              placeholder="Digite o nome..."
              value={produtoNome}
              onChange={(e) => setProdutoNome(e.target.value)}
            />
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
                <div
                  style={{ display: "flex", alignItems: "center", gap: "1rem" }}
                >
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
              <label
                style={{
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  marginBottom: "0.5rem",
                  display: "block",
                }}
              >
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
              </S.Select>
            </div>

            <S.TotalRow>
              <span>Total:</span>
              <span>{formatarMoeda(valorTotal)}</span>
            </S.TotalRow>

            <Button
              variant="success"
              fullWidth
              onClick={handleFinalizarVenda}
              disabled={carrinho.length === 0}
            >
              FINALIZAR VENDA
            </Button>
          </S.CheckoutSection>
        </S.Panel>
      </S.Content>
    </S.Container>
  );
}
