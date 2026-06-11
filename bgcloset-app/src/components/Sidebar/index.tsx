import { useState } from "react";
import {
  Gem,
  LayoutDashboard,
  ShoppingBag,
  Users,
  ShoppingCart,
  CreditCard,
  DollarSign,
  Settings,
} from "lucide-react";
import * as S from "./styles";
import { authService } from "../../services/authService";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [isAdmin] = useState(() => authService.getUsuarioLogado()?.perfil === "admin");

  return (
    <S.Container $isOpen={isOpen}>
      <S.LogoWrapper>
        <Gem size={26} />
        <h1>B & G Closet</h1>
      </S.LogoWrapper>

      <S.Nav>
        <S.NavSection>
          <S.NavSectionTitle>Navegação</S.NavSectionTitle>
          <S.LinkItem to="/" onClick={onClose}>
            <LayoutDashboard size={20} />
            Dashboard
          </S.LinkItem>
        </S.NavSection>

        <S.NavSection>
          <S.NavSectionTitle>Cadastros</S.NavSectionTitle>
          <S.LinkItem to="/produtos" onClick={onClose}>
            <ShoppingBag size={20} />
            Produtos
          </S.LinkItem>
          <S.LinkItem to="/clientes" onClick={onClose}>
            <Users size={20} />
            Clientes
          </S.LinkItem>
        </S.NavSection>

        <S.NavSection>
          <S.NavSectionTitle>Operações</S.NavSectionTitle>
          <S.LinkItem to="/vendas" onClick={onClose}>
            <ShoppingCart size={20} />
            Vendas PDV
          </S.LinkItem>
          <S.LinkItem to="/crediario" onClick={onClose}>
            <CreditCard size={20} />
            Crediário
          </S.LinkItem>
        </S.NavSection>

        <S.NavSection>
          <S.NavSectionTitle>Financeiro</S.NavSectionTitle>
          <S.LinkItem to="/financas" onClick={onClose}>
            <DollarSign size={20} />
            Finanças
          </S.LinkItem>
        </S.NavSection>

        {isAdmin && (
          <S.NavSection>
            <S.NavSectionTitle>Configurações</S.NavSectionTitle>
            <S.LinkItem to="/usuarios" onClick={onClose}>
              <Settings size={20} />
              Usuários
            </S.LinkItem>
          </S.NavSection>
        )}
      </S.Nav>
    </S.Container>
  );
}


