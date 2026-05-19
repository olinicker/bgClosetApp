import { Outlet } from "react-router-dom";
import { Sidebar } from "../Sidebar";
import { Header } from "../Header";
import * as S from "./styles";

export function DefaultLayout() {
  return (
    <S.LayoutContainer>
      <Sidebar />

      <S.ContentWrapper>
        <Header />

        <S.MainContent>
          <Outlet />
        </S.MainContent>
      </S.ContentWrapper>
    </S.LayoutContainer>
  );
}
