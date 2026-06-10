import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const Section = styled.section`
  background-color: ${(props) => props.theme.colors.surface};
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  h1 {
    font-size: 1.75rem;
    color: ${(props) => props.theme.colors.text};
  }
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 1rem;
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

export const RestrictedContainer = styled.div`
  background-color: #fef2f2;
  border: 1px solid #fee2e2;
  border-radius: 12px;
  padding: 2.5rem;
  text-align: center;
  max-width: 500px;
  margin: 3rem auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);

  h2 {
    color: #ef4444;
    margin-bottom: 0.5rem;
  }

  p {
    color: #64748b;
    font-size: 1rem;
    margin-bottom: 1.5rem;
  }
`;
