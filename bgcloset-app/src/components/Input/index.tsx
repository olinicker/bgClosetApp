import { type InputHTMLAttributes, forwardRef } from "react";
import * as S from "./styles";

// Herda todas as propriedades padrão de um <input> HTML (type, placeholder, onChange, etc)
export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

// O forwardRef recebe primeiro o tipo do elemento (HTMLInputElement) e depois as props (InputProps)
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, ...props }, ref) => {
    return (
      <S.Wrapper>
        {/* Renderiza a label apenas se ela for passada */}
        {label && <S.Label>{label}</S.Label>}

        <S.Input ref={ref} $hasError={!!error} {...props} />

        {/* Renderiza a mensagem de erro apenas se ela existir */}
        {error && <S.ErrorMessage>{error}</S.ErrorMessage>}
      </S.Wrapper>
    );
  },
);

// É uma boa prática dar um displayName quando usamos forwardRef para facilitar o debug no React DevTools
Input.displayName = "Input";
