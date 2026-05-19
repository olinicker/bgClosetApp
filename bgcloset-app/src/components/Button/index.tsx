import { type ButtonHTMLAttributes } from "react";
import * as S from "./styles";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & S.ButtonStyleProps;

export function Button({
  children,
  variant = "primary",
  fullWidth,
  ...props
}: Props) {
  return (
    <S.Button variant={variant} fullWidth={fullWidth} {...props}>
      {children}
    </S.Button>
  );
}
