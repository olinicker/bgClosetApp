import styled from "styled-components";
import { NavLink } from "react-router-dom";

export const Container = styled.aside`
  width: 250px;
  background-color: ${(props) => props.theme.colors.primary};
  height: 100vh;
  padding: 2rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  box-shadow: 4px 0 10px rgba(0, 0, 0, 0.1);
  z-index: 10;
`;

export const LogoWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  h1 {
    color: ${(props) => props.theme.colors.secondary};
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0;
    text-align: center;
  }
`;

export const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const LinkItem = styled(NavLink)`
  color: ${(props) => props.theme.colors.surface};
  text-decoration: none;
  padding: 0.875rem 1rem;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  &.active {
    background-color: ${(props) => props.theme.colors.secondary};
    color: ${(props) => props.theme.colors.primary};
    font-weight: 600;
  }
`;
