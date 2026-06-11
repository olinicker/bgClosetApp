import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import * as S from "./styles";
import { authService } from "../../services/authService";

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const navigate = useNavigate();

  // Estado para guardar os dados do utilizador logado
  const [usuario] = useState(() => {
    const payload = authService.getUsuarioLogado();
    return {
      nome: payload?.nome || "Vendedor Ativo",
      email: payload?.email || payload?.sub || "vendedor@bgcloset.com.br",
    };
  });

  const handleLogout = () => {
    localStorage.removeItem("@BG_Token");
    navigate("/login");
  };

  return (
    <S.Container>
      <S.MenuButton onClick={onMenuClick}>
        <Menu size={24} />
      </S.MenuButton>

      <S.UserProfile>
        <S.UserInfo>
          <strong>{usuario.nome}</strong>
          <span>{usuario.email}</span>
        </S.UserInfo>

        <S.LogoutButton onClick={handleLogout}>
          Sair
        </S.LogoutButton>
      </S.UserProfile>
    </S.Container>
  );
}