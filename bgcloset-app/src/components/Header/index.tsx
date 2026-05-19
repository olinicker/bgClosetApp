import * as S from "./styles";

export function Header() {
  return (
    <S.Container>
      <S.UserProfile>
        <S.UserInfo>
          <strong>Vendedor Padrão</strong>
          <span>vendedor@bgcloset.com.br</span>
        </S.UserInfo>

        <S.LogoutButton>Sair</S.LogoutButton>
      </S.UserProfile>
    </S.Container>
  );
}
