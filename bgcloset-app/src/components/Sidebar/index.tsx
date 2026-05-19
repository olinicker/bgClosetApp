import * as S from "./styles";

export function Sidebar() {
  return (
    <S.Container>
      <S.LogoWrapper>
        <h1>B & G Closet</h1>
      </S.LogoWrapper>

      <S.Nav>
        <S.LinkItem to="/">Dashboard</S.LinkItem>
        <S.LinkItem to="/produtos">Produtos</S.LinkItem>
        <S.LinkItem to="/clientes">Clientes</S.LinkItem>
        <S.LinkItem to="/vendas">Vendas PDV</S.LinkItem>
      </S.Nav>
    </S.Container>
  );
}
