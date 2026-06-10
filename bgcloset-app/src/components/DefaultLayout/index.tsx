import { Navigate, Outlet } from "react-router-dom";
import { Sidebar } from "../Sidebar";
import { Header } from "../Header";
import * as S from "./styles";

export function DefaultLayout() {
  const token = localStorage.getItem("@BG_Token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

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

