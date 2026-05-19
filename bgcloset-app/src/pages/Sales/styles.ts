import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const PageHeader = styled.div`
  h1 {
    font-size: 1.75rem;
    color: ${(props) => props.theme.colors.text};
  }
`;

export const Content = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr; /* O lado esquerdo (produtos) fica maior que o direito (carrinho) */
  gap: 1.5rem;
  align-items: flex-start;

  @media (max-width: 768px) {
    grid-template-columns: 1fr; /* Empilha no mobile */
  }
`;

export const Panel = styled.div`
  background-color: ${(props) => props.theme.colors.surface};
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const PanelTitle = styled.h2`
  font-size: 1.25rem;
  color: ${(props) => props.theme.colors.text};
  border-bottom: 1px solid ${(props) => props.theme.colors.border};
  padding-bottom: 0.75rem;
  margin-bottom: 0.5rem;
`;

export const FormRow = styled.div`
  display: flex;
  gap: 1rem;
  align-items: flex-end; /* Alinha o botão com os inputs na base */

  > *:not(button) {
    flex: 1;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const CartList = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-height: 400px;
  overflow-y: auto; /* Rolagem apenas no carrinho se tiver muitos itens */
`;

export const CartItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: ${(props) => props.theme.colors.background};
  border-radius: 8px;
  border: 1px solid ${(props) => props.theme.colors.border};
`;

export const ItemInfo = styled.div`
  display: flex;
  flex-direction: column;

  strong {
    color: ${(props) => props.theme.colors.text};
    font-size: 0.875rem;
  }
  span {
    font-size: 0.75rem;
    color: ${(props) => props.theme.colors.textSecondary};
  }
`;

export const RemoveButton = styled.button`
  background: transparent;
  border: none;
  color: ${(props) => props.theme.colors.danger};
  font-size: 1.25rem;
  cursor: pointer;

  &:hover {
    opacity: 0.7;
  }
`;

export const CheckoutSection = styled.div`
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 2px dashed ${(props) => props.theme.colors.border};
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 1.25rem;
  font-weight: bold;
  color: ${(props) => props.theme.colors.text};

  span:last-child {
    color: ${(props) => props.theme.colors.primary};
  }
`;

export const Select = styled.select`
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid ${(props) => props.theme.colors.border};
  background-color: ${(props) => props.theme.colors.surface};
  color: ${(props) => props.theme.colors.text};
  font-size: 1rem;
  outline: none;
  width: 100%;

  &:focus {
    border-color: ${(props) => props.theme.colors.primary};
  }
`;
