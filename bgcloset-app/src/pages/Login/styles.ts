import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f8fafc;
`;

export const LoginBox = styled.div`
  background: white;
  padding: 2.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;

  @media (max-width: 480px) {
    padding: 1.75rem;
    max-width: 90%;
  }
`;

export const Title = styled.h1`
  text-align: center;
  color: #1e293b;
  font-size: 1.5rem;
  margin-bottom: 2rem;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

export const ErrorMessage = styled.span`
  color: #ef4444; /* Vermelho claro/alerta */
  font-size: 0.875rem;
  text-align: center;
  margin-top: -0.5rem;
  margin-bottom: 0.5rem;
  font-weight: 500;
`;