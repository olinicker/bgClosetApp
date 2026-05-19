import { type ReactNode } from "react";
import * as S from "./styles";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <S.Overlay onClick={onClose}>
      <S.Container onClick={(e) => e.stopPropagation()}>
        <S.Header>
          <h2>{title}</h2>
          <S.CloseButton onClick={onClose} aria-label="Fechar">
            &times;
          </S.CloseButton>
        </S.Header>

        <S.Content>{children}</S.Content>
      </S.Container>
    </S.Overlay>
  );
}
