import styled, { css } from "styled-components";

export interface ButtonStyleProps {
  variant?: "primary" | "secondary" | "danger" | "success";
  fullWidth?: boolean;
}

export const Button = styled.button<ButtonStyleProps>`
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  width: ${(props) => (props.fullWidth ? "100%" : "auto")};

  ${(props) => {
    switch (props.variant) {
      case "secondary":
        return css`
          background-color: ${props.theme.colors.secondary};
          color: ${props.theme.colors.background};
        `;
      case "danger":
        return css`
          background-color: ${props.theme.colors.danger};
          color: #fff;
        `;
      case "success":
        return css`
          background-color: ${props.theme.colors.success};
          color: #fff;
        `;
      case "primary":
      default:
        return css`
          background-color: ${props.theme.colors.primary};
          color: ${props.theme.colors.surface};
        `;
    }
  }}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    filter: brightness(0.9);
  }
`;
