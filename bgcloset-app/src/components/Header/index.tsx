import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as S from "./styles";
import { authService } from "../../services/authService";

export function Header() {
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