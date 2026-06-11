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

  h1 {
    font-size: 1.75rem;
    color: ${(props) => props.theme.colors.text};
  }

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
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

export const FilterContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 1rem;
  background-color: ${(props) => props.theme.colors.surface};
  padding: 1.25rem;
  border-radius: 8px;
  border: 1px solid ${(props) => props.theme.colors.border};
  margin-bottom: 0.5rem;
`;

export const SearchInput = styled.input`
  padding: 0.5rem;
  border-radius: 6px;
  border: 1px solid ${(props) => props.theme.colors.border};
  background-color: ${(props) => props.theme.colors.background};
  color: ${(props) => props.theme.colors.text};
  font-size: 0.875rem;
  outline: none;
  width: 100%;
  max-width: 300px;

  &:focus {
    border-color: ${(props) => props.theme.colors.primary};
  }
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
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
  display: block;
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

export const DebtBadge = styled.span`
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 600;
  color: #b45309;
  background-color: #fef3c7;
`;
