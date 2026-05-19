import styled from "styled-components";

export const Container = styled.header`
  background-color: ${(props) => props.theme.colors.surface};
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: flex-end; /* Alinha os itens para a direita */
  padding: 0 2rem;
  border-bottom: 1px solid ${(props) => props.theme.colors.border};

  /* Como a sidebar tem 250px fixos, o Header ocupa o resto da tela */
  width: 100%;
`;

export const UserProfile = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

export const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;

  strong {
    color: ${(props) => props.theme.colors.text};
    font-size: 0.875rem;
  }

  span {
    color: ${(props) => props.theme.colors.textSecondary};
    font-size: 0.75rem;
  }
`;

export const LogoutButton = styled.button`
  background: transparent;
  border: none;
  color: ${(props) => props.theme.colors.danger};
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.7;
  }
`;
