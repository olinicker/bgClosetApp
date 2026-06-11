import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;

  h1 {
    font-size: 1.75rem;
    color: ${(props) => props.theme.colors.text};
  }

  @media (max-width: 576px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
`;


export const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

interface CardProps {
  color?: string;
}

export const Card = styled.div<CardProps>`
  background-color: ${(props) => props.theme.colors.surface};
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  border: 1px solid ${(props) => props.theme.colors.border};
  border-left: 4px solid ${(props) => props.color || props.theme.colors.primary};
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
    margin: 0;
  }

  span {
    font-size: 1.25rem;
  }
`;

export const CardValue = styled.strong`
  font-size: 1.75rem;
  color: ${(props) => props.theme.colors.text};
`;

export const Section = styled.section`
  background-color: ${(props) => props.theme.colors.surface};
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 1rem;

  h2 {
    font-size: 1.25rem;
    color: ${(props) => props.theme.colors.text};
    margin: 0;
  }
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 1rem;
`;

export const FormRow = styled.div`
  display: flex;
  gap: 1rem;

  > * {
    flex: 1;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.5rem;
  }
`;

export const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
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
  margin-top: 0.25rem;

  &:focus {
    border-color: ${(props) => props.theme.colors.primary};
  }
`;

export const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: #1e293b;
  margin-top: 0.5rem;
  display: block;
`;

interface BadgeProps {
  type: string;
}

export const Badge = styled.span<BadgeProps>`
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  color: ${(props) => (props.type === "entrada" ? "#065f46" : "#991b1b")};
  background-color: ${(props) => (props.type === "entrada" ? "#d1fae5" : "#fee2e2")};
`;

interface ValueSpanProps {
  type: string;
}

export const ValueSpan = styled.span<ValueSpanProps>`
  font-weight: 600;
  color: ${(props) => (props.type === "entrada" ? "#10b981" : "#ef4444")};
`;

export const ErrorMessage = styled.span`
  color: #ef4444;
  font-size: 0.875rem;
  font-weight: 500;
  margin-top: 0.5rem;
  text-align: center;
`;

export const SuccessMessage = styled.span`
  color: #10b981;
  font-size: 0.875rem;
  font-weight: 500;
  margin-top: 0.5rem;
  text-align: center;
`;

export const CategoryList = styled.div`
  margin-top: 1.5rem;
  max-height: 250px;
  overflow-y: auto;
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: 8px;
  padding: 0.5rem;
  background-color: ${(props) => props.theme.colors.surface};
`;

export const CategoryItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  border-bottom: 1px solid ${(props) => props.theme.colors.border};

  &:last-child {
    border-bottom: none;
  }
`;

export const CategoryInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  
  strong {
    color: ${(props) => props.theme.colors.text};
    font-size: 0.95rem;
  }
`;

export const CategoryActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

export const FilterContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 1rem;
  background-color: ${(props) => props.theme.colors.surface};
  padding: 1.25rem;
  border-radius: 8px;
  border: 1px solid ${(props) => props.theme.colors.border};
  margin-bottom: 1.5rem;
`;

export const MiniSelect = styled.select`
  padding: 0.5rem;
  border-radius: 6px;
  border: 1px solid ${(props) => props.theme.colors.border};
  background-color: ${(props) => props.theme.colors.background};
  color: ${(props) => props.theme.colors.text};
  font-size: 0.875rem;
  outline: none;
  cursor: pointer;

  &:focus {
    border-color: ${(props) => props.theme.colors.primary};
  }
`;
