import styled from "styled-components";

export const Container = styled.header`
  background-color: ${(props) => props.theme.colors.surface};
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between; /* Permite o menu à esquerda e o perfil à direita */
  padding: 0 2rem;
  border-bottom: 1px solid ${(props) => props.theme.colors.border};
  width: 100%;

  @media (max-width: 768px) {
    padding: 0 1.25rem;
  }
`;

export const MenuButton = styled.button`
  background: transparent;
  border: none;
  color: ${(props) => props.theme.colors.text};
  cursor: pointer;
  display: none;
  align-items: center;
  justify-content: center;
  outline: none;
  padding: 0.5rem;
  border-radius: 4px;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${(props) => props.theme.colors.background};
  }

  @media (max-width: 768px) {
    display: flex;
  }
`;

export const UserProfile = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-left: auto; /* Garante que o perfil fique alinhado à direita se o MenuButton sumir */
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
