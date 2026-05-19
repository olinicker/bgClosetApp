import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

export const Header = styled.div`
  h1 {
    font-size: 1.75rem;
    color: ${(props) => props.theme.colors.text};
    margin-bottom: 0.5rem;
  }

  p {
    color: ${(props) => props.theme.colors.textSecondary};
    font-size: 1rem;
  }
`;

// O Grid ajusta automaticamente a quantidade de colunas baseada no tamanho da tela
export const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
`;

export const Card = styled.div`
  background-color: ${(props) => props.theme.colors.surface};
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  border: 1px solid ${(props) => props.theme.colors.border};
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }
`;

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  h3 {
    font-size: 0.875rem;
    color: ${(props) => props.theme.colors.textSecondary};
    font-weight: 500;
  }
`;

export const CardValue = styled.span`
  font-size: 1.75rem;
  font-weight: 700;
  color: ${(props) => props.theme.colors.primary};
`;

export const CardTrend = styled.span<{ $isPositive?: boolean }>`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${(props) =>
    props.$isPositive ? props.theme.colors.success : props.theme.colors.danger};
  background-color: ${(props) =>
    props.$isPositive
      ? `${props.theme.colors.success}20`
      : `${props.theme.colors.danger}20`};
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  width: fit-content;
`;

export const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  h2 {
    font-size: 1.25rem;
    color: ${(props) => props.theme.colors.text};
  }
`;
