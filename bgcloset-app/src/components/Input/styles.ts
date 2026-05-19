import styled from "styled-components";

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
  margin-bottom: 1rem;
`;

export const Label = styled.label`
  font-size: 0.875rem;
  color: ${(props) => props.theme.colors.text};
  font-weight: 500;
`;

// Tipagem exclusiva para o estilo do input
export interface InputStyleProps {
  $hasError?: boolean;
}

export const Input = styled.input<InputStyleProps>`
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid
    ${(props) =>
      props.$hasError ? props.theme.colors.danger : props.theme.colors.border};
  background-color: ${(props) => props.theme.colors.surface};
  color: ${(props) => props.theme.colors.text};
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s ease-in-out;

  &::placeholder {
    color: ${(props) => props.theme.colors.textSecondary};
  }

  &:focus {
    border-color: ${(props) => props.theme.colors.primary};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background-color: ${(props) => props.theme.colors.background};
  }
`;

export const ErrorMessage = styled.span`
  font-size: 0.75rem;
  color: ${(props) => props.theme.colors.danger};
  margin-top: -0.25rem;
`;
