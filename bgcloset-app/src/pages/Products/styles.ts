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

export const ActionGroup = styled.div`
  display: flex;
  gap: 0.5rem;
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

export const SelectWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
  margin-bottom: 1rem;
`;

export const SelectLabel = styled.label`
  font-size: 0.875rem;
  color: ${(props) => props.theme.colors.text};
  font-weight: 500;
`;

export const Select = styled.select`
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid ${(props) => props.theme.colors.border};
  background-color: ${(props) => props.theme.colors.surface};
  color: ${(props) => props.theme.colors.text};
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s ease-in-out;
  cursor: pointer;

  &:focus {
    border-color: ${(props) => props.theme.colors.primary};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background-color: ${(props) => props.theme.colors.background};
  }
`;

export const FilterContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 1rem;
  background-color: ${(props) => props.theme.colors.surface};
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid ${(props) => props.theme.colors.border};
  margin-bottom: 0.5rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const FilterLabel = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${(props) => props.theme.colors.textSecondary};
`;

export const MiniSelect = styled.select`
  padding: 0.5rem 1rem;
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

export const CategoryList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 1.5rem 0 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-height: 250px;
  overflow-y: auto;
`;

export const CategoryItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background-color: ${(props) => props.theme.colors.background};
  border-radius: 6px;
  border: 1px solid ${(props) => props.theme.colors.border};
`;

export const CategoryName = styled.span`
  font-size: 0.95rem;
  color: ${(props) => props.theme.colors.text};
  font-weight: 500;
`;

export const CategoryForm = styled.form`
  display: flex;
  gap: 0.75rem;
  align-items: flex-end;
  margin-top: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid ${(props) => props.theme.colors.border};

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: stretch;

    > button {
      width: 100%;
    }
  }
`;

