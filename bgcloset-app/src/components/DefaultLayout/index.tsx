import { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { Sidebar } from "../Sidebar";
import { Header } from "../Header";
import * as S from "./styles";

export function DefaultLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const token = localStorage.getItem("@BG_Token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <S.LayoutContainer>
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      {isSidebarOpen && <S.Backdrop onClick={closeSidebar} />}

      <S.ContentWrapper>
        <Header onMenuClick={toggleSidebar} />

        <S.MainContent>
          <Outlet />
        </S.MainContent>
      </S.ContentWrapper>
    </S.LayoutContainer>
  );
}


