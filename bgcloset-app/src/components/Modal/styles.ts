import styled from "styled-components";

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999; /* Fica por cima de tudo */
  padding: 1rem; /* Margem de respiro no mobile */
`;

export const Container = styled.div`
  background-color: ${(props) => props.theme.colors.surface};
  border-radius: 12px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;

  /* Animação suave ao abrir */
  animation: modal-appear 0.2s ease-out;

  @keyframes modal-appear {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 1.5rem 1rem;
  border-bottom: 1px solid ${(props) => props.theme.colors.border};

  h2 {
    margin: 0;
    color: ${(props) => props.theme.colors.text};
    font-size: 1.25rem;
    font-weight: 600;
  }
`;

export const CloseButton = styled.button`
  background: transparent;
  border: none;
  font-size: 1.5rem;
  line-height: 1;
  color: ${(props) => props.theme.colors.textSecondary};
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    color: ${(props) => props.theme.colors.danger};
  }
`;

export const Content = styled.div`
  padding: 1.5rem;
  overflow-y: auto;
  max-height: calc(
    100vh - 200px
  ); /* Evita que o modal fique maior que a tela */
`;
