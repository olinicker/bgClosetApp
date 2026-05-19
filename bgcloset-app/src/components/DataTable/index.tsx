import { type ReactNode } from "react";
import * as S from "./styles";

export interface Column<T> {
  key: keyof T | "actions";
  label: string;
  // Trocamos 'any' por 'unknown'
  render?: (value: unknown, row: T) => ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
}: DataTableProps<T>) {
  if (!data || data.length === 0) {
    return (
      <S.TableWrapper>
        <S.EmptyMessage>Nenhum registro encontrado.</S.EmptyMessage>
      </S.TableWrapper>
    );
  }

  return (
    <S.TableWrapper>
      <S.Table>
        <thead>
          <tr>
            {columns.map((col) => (
              <S.Th key={String(col.key)}>{col.label}</S.Th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <S.Tr key={rowIndex}>
              {columns.map((col) => {
                const cellValue =
                  col.key !== "actions" ? row[col.key as keyof T] : undefined;

                return (
                  <S.Td key={String(col.key)}>
                    {col.render
                      ? col.render(cellValue, row)
                      : (cellValue as ReactNode)}
                  </S.Td>
                );
              })}
            </S.Tr>
          ))}
        </tbody>
      </S.Table>
    </S.TableWrapper>
  );
}
