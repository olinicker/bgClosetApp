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

export const DetailCard = styled.div`
  background-color: ${(props) => props.theme.colors.background};
  padding: 1.25rem;
  border-radius: 8px;
  border: 1px solid ${(props) => props.theme.colors.border};
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;

  h3 {
    font-size: 1.1rem;
    color: ${(props) => props.theme.colors.text};
    margin: 0 0 0.25rem 0;
    border-bottom: 1px solid ${(props) => props.theme.colors.border};
    padding-bottom: 0.5rem;
  }
`;

export const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  
  strong {
    color: ${(props) => props.theme.colors.textSecondary};
  }

  span {
    color: ${(props) => props.theme.colors.text};
    font-weight: 500;
  }
`;
