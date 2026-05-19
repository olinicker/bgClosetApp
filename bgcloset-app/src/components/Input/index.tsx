import { type InputHTMLAttributes, forwardRef } from "react";
import * as S from "./styles";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

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

Input.displayName = "Input";
