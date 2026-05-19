import styled from "styled-components";

export const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  background-color: ${(props) => props.theme.colors.surface};
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;
`;

export const Th = styled.th`
  padding: 1rem;
  background-color: ${(props) => props.theme.colors.background};
  color: ${(props) => props.theme.colors.textSecondary};
  font-weight: 600;
  border-bottom: 2px solid ${(props) => props.theme.colors.border};
  white-space: nowrap;
`;

export const Td = styled.td`
  padding: 1rem;
  color: ${(props) => props.theme.colors.text};
  border-bottom: 1px solid ${(props) => props.theme.colors.border};
`;

export const Tr = styled.tr`
  transition: background-color 0.2s;

  &:hover {
    background-color: ${(props) => props.theme.colors.background};
  }
`;

export const EmptyMessage = styled.p`
  padding: 1.5rem;
  text-align: center;
  color: ${(props) => props.theme.colors.textSecondary};
  margin: 0;
`;
