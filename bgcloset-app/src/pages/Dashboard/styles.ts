import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 0.5rem 0;
`;

export const Header = styled.div`
  h1 {
    font-size: 1.85rem;
    font-weight: 700;
    color: ${(props) => props.theme.colors.text};
    margin-bottom: 0.35rem;
    letter-spacing: -0.025em;
  }

  p {
    color: ${(props) => props.theme.colors.textSecondary};
    font-size: 0.95rem;
  }
`;

export const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1.25rem;
  background-color: ${(props) => props.theme.colors.surface};
  padding: 1.25rem 1.5rem;
  border-radius: 16px;
  border: 1px solid ${(props) => props.theme.colors.border};
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
`;

export const FilterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

export const FilterLabel = styled.label`
  font-size: 0.85rem;
  font-weight: 600;
  color: ${(props) => props.theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

export const Select = styled.select`
  padding: 0.5rem 1.75rem 0.5rem 0.75rem;
  border-radius: 8px;
  border: 1px solid ${(props) => props.theme.colors.border};
  background-color: ${(props) => props.theme.colors.surface};
  color: ${(props) => props.theme.colors.text};
  font-size: 0.875rem;
  font-weight: 500;
  outline: none;
  cursor: pointer;
  transition: all 0.2s;
  background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%2364748b' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.25rem;
  appearance: none;

  &:hover {
    border-color: ${(props) => props.theme.colors.secondary};
  }

  &:focus {
    border-color: ${(props) => props.theme.colors.secondary};
    box-shadow: 0 0 0 2px ${(props) => props.theme.colors.secondary}20;
  }
`;

export const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
`;

export const Card = styled.div`
  background-color: ${(props) => props.theme.colors.surface};
  padding: 1.5rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  border: 1px solid ${(props) => props.theme.colors.border};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
    border-color: ${(props) => props.theme.colors.secondary}50;
  }
`;

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  h3 {
    font-size: 0.875rem;
    color: ${(props) => props.theme.colors.textSecondary};
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
`;

export const IconBox = styled.div<{ $variant: "primary" | "success" | "warning" | "danger" }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 10px;
  
  ${({ $variant, theme }) => {
    switch ($variant) {
      case "success":
        return `
          background-color: ${theme.colors.success}12;
          color: ${theme.colors.success};
        `;
      case "danger":
        return `
          background-color: ${theme.colors.danger}12;
          color: ${theme.colors.danger};
        `;
      case "warning":
        return `
          background-color: #f59e0b12;
          color: #d97706;
        `;
      default:
        return `
          background-color: ${theme.colors.secondary}15;
          color: ${theme.colors.secondary};
        `;
    }
  }}
`;

export const CardValue = styled.span`
  font-size: 1.85rem;
  font-weight: 700;
  color: ${(props) => props.theme.colors.text};
  letter-spacing: -0.03em;
`;

export const CardTrend = styled.span<{ $isPositive?: boolean }>`
  font-size: 0.725rem;
  font-weight: 600;
  color: ${(props) =>
    props.$isPositive ? props.theme.colors.success : props.theme.colors.textSecondary};
  background-color: ${(props) =>
    props.$isPositive ? `${props.theme.colors.success}12` : `${props.theme.colors.border}60`};
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  width: fit-content;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

export const WidgetsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;

  @media (min-width: 1024px) {
    grid-template-columns: 1.4fr 1fr;
  }
`;

export const WidgetCard = styled.div`
  background-color: ${(props) => props.theme.colors.surface};
  padding: 1.75rem;
  border-radius: 16px;
  border: 1px solid ${(props) => props.theme.colors.border};
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

export const WidgetHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid ${(props) => props.theme.colors.border};
  padding-bottom: 1rem;

  h2 {
    font-size: 1.125rem;
    font-weight: 700;
    color: ${(props) => props.theme.colors.text};
    display: flex;
    align-items: center;
    gap: 0.5rem;
    letter-spacing: -0.015em;
  }
  
  span.badge {
    background-color: ${(props) => props.theme.colors.border};
    color: ${(props) => props.theme.colors.textSecondary};
    font-size: 0.75rem;
    font-weight: 600;
    padding: 0.15rem 0.5rem;
    border-radius: 9999px;
  }
`;

export const SalesList = styled.div`
  display: flex;
  flex-direction: column;
`;

export const SaleItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 0;
  border-bottom: 1px solid ${(props) => props.theme.colors.border}60;

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
  
  &:first-child {
    padding-top: 0;
  }
`;

export const SaleInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;

  span.customer-name {
    font-size: 0.925rem;
    font-weight: 600;
    color: ${(props) => props.theme.colors.text};
  }

  span.sale-details {
    font-size: 0.775rem;
    color: ${(props) => props.theme.colors.textSecondary};
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;

export const SaleMeta = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.3rem;

  span.sale-value {
    font-size: 0.95rem;
    font-weight: 700;
    color: ${(props) => props.theme.colors.text};
  }
`;

export const StatusBadge = styled.span<{ $status: string }>`
  font-size: 0.675rem;
  font-weight: 700;
  padding: 0.15rem 0.5rem;
  border-radius: 9999px;
  text-transform: uppercase;
  letter-spacing: 0.025em;

  ${({ $status, theme }) => {
    switch ($status) {
      case "cancelada":
        return `
          background-color: ${theme.colors.danger}12;
          color: ${theme.colors.danger};
        `;
      case "consignada":
        return `
          background-color: #f59e0b12;
          color: #d97706;
        `;
      default: // concluida
        return `
          background-color: ${theme.colors.success}12;
          color: ${theme.colors.success};
        `;
    }
  }}
`;

export const StockList = styled.div`
  display: flex;
  flex-direction: column;
`;

export const StockItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.9rem 0;
  border-bottom: 1px solid ${(props) => props.theme.colors.border}60;

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
  
  &:first-child {
    padding-top: 0;
  }
`;

export const ProductInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;

  span.product-name {
    font-size: 0.925rem;
    font-weight: 600;
    color: ${(props) => props.theme.colors.text};
  }

  span.product-category {
    font-size: 0.775rem;
    color: ${(props) => props.theme.colors.textSecondary};
    background-color: ${(props) => props.theme.colors.background};
    padding: 0.1rem 0.4rem;
    border-radius: 4px;
    width: fit-content;
  }
`;

export const StockBadge = styled.span<{ $count: number }>`
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;

  ${({ $count, theme }) => {
    if ($count === 0) {
      return `
        background-color: ${theme.colors.danger}15;
        color: ${theme.colors.danger};
      `;
    }
    if ($count <= 5) {
      return `
        background-color: #f59e0b15;
        color: #d97706;
      `;
    }
    return `
      background-color: ${theme.colors.success}15;
      color: ${theme.colors.success};
    `;
  }}
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2.5rem 1rem;
  text-align: center;
  gap: 0.5rem;
  color: ${(props) => props.theme.colors.textSecondary};

  p.title {
    font-size: 0.95rem;
    font-weight: 600;
    color: ${(props) => props.theme.colors.text};
  }

  p.desc {
    font-size: 0.825rem;
  }
`;
