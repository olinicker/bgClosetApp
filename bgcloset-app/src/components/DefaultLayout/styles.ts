import styled from "styled-components";

export const LayoutContainer = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
`;

export const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

export const MainContent = styled.main`
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
  background-color: ${(props) => props.theme.colors.background};
`;
