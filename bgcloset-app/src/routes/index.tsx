import { Routes, Route } from "react-router-dom";
import { DefaultLayout } from "../components/DefaultLayout";
import { Produtos } from "../pages/Products";
import { Dashboard } from "../pages/Dashboard";
import { Clientes } from "../pages/Customers";
import { Vendas } from "../pages/Sales";
import { Login } from "../pages/Login"; 
import { Financas } from "../pages/Finance"; // Importamos a tela de Finanças
import { Crediario } from "../pages/Crediario"; // Importamos a tela de Crediário
import { Users } from "../pages/Users"; // Importamos a tela de Usuários

export function Router() {
  return (
    <Routes>
      {/* Rota Pública: Fora do layout, sem menu lateral */}
      <Route path="/login" element={<Login />} />

      {/* Rotas Protegidas: Dentro do layout, com menu lateral */}
      <Route path="/" element={<DefaultLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/produtos" element={<Produtos />} />
        <Route path="/clientes" element={<Clientes />} />
        <Route path="/vendas" element={<Vendas />} />
        <Route path="/financas" element={<Financas />} />
        <Route path="/crediario" element={<Crediario />} />
        <Route path="/usuarios" element={<Users />} />
      </Route>
    </Routes>
  );
}