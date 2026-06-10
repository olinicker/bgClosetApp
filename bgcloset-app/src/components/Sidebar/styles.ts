import styled from "styled-components";
import { NavLink } from "react-router-dom";

export const Container = styled.aside`
  width: 260px;
  background-color: ${(props) => props.theme.colors.primary};
  height: 100vh;
  padding: 2rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  box-shadow: 4px 0 15px rgba(0, 0, 0, 0.15);
  z-index: 10;
  flex-shrink: 0;
`;

export const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  color: ${(props) => props.theme.colors.secondary};

  h1 {
    color: ${(props) => props.theme.colors.secondary};
    font-size: 1.35rem;
    font-weight: 700;
    margin: 0;
    letter-spacing: 0.5px;
  }
`;

export const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
  flex: 1;
  overflow-y: auto;
  padding-right: 0.25rem;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
  }
`;

export const NavSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
`;

export const NavSectionTitle = styled.span`
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: ${(props) => props.theme.colors.secondary};
  opacity: 0.65;
  margin-bottom: 0.4rem;
  padding-left: 0.75rem;
`;

export const LinkItem = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 0.85rem;
  color: ${(props) => props.theme.colors.surface};
  opacity: 0.85;
  text-decoration: none;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-weight: 500;
  font-size: 0.95rem;
  transition: all 0.2s ease-in-out;

  svg {
    transition: transform 0.2s ease-in-out;
  }

  &:hover {
    background-color: rgba(255, 255, 255, 0.08);
    opacity: 1;
    
    svg {
      transform: translateX(2px);
    }
  }

  &.active {
    background-color: ${(props) => props.theme.colors.secondary};
    color: ${(props) => props.theme.colors.primary};
    font-weight: 600;
    opacity: 1;
    box-shadow: 0 4px 12px rgba(198, 168, 124, 0.2);

    svg {
      transform: none;
    }
  }
`;

