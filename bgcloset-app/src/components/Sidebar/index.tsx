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

export function Sidebar() {
  const [isAdmin] = useState(() => authService.getUsuarioLogado()?.perfil === "admin");

  return (
    <S.Container>
      <S.LogoWrapper>
        <Gem size={26} />
        <h1>B & G Closet</h1>
      </S.LogoWrapper>

      <S.Nav>
        <S.NavSection>
          <S.NavSectionTitle>Navegação</S.NavSectionTitle>
          <S.LinkItem to="/">
            <LayoutDashboard size={20} />
            Dashboard
          </S.LinkItem>
        </S.NavSection>

        <S.NavSection>
          <S.NavSectionTitle>Cadastros</S.NavSectionTitle>
          <S.LinkItem to="/produtos">
            <ShoppingBag size={20} />
            Produtos
          </S.LinkItem>
          <S.LinkItem to="/clientes">
            <Users size={20} />
            Clientes
          </S.LinkItem>
        </S.NavSection>

        <S.NavSection>
          <S.NavSectionTitle>Operações</S.NavSectionTitle>
          <S.LinkItem to="/vendas">
            <ShoppingCart size={20} />
            Vendas PDV
          </S.LinkItem>
          <S.LinkItem to="/crediario">
            <CreditCard size={20} />
            Crediário
          </S.LinkItem>
        </S.NavSection>

        <S.NavSection>
          <S.NavSectionTitle>Financeiro</S.NavSectionTitle>
          <S.LinkItem to="/financas">
            <DollarSign size={20} />
            Finanças
          </S.LinkItem>
        </S.NavSection>

        {isAdmin && (
          <S.NavSection>
            <S.NavSectionTitle>Configurações</S.NavSectionTitle>
            <S.LinkItem to="/usuarios">
              <Settings size={20} />
              Usuários
            </S.LinkItem>
          </S.NavSection>
        )}
      </S.Nav>
    </S.Container>
  );
}

