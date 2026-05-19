import { Routes, Route } from "react-router-dom";
import { DefaultLayout } from "../components/DefaultLayout";
import { Produtos } from "../pages/Products";
import { Dashboard } from "../pages/Dashboard";
import { Clientes } from "../pages/Customers";
import { Vendas } from "../pages/Sales";

export function Router() {
  return (
    <Routes>
      <Route path="/" element={<DefaultLayout />}>
        <Route path="/" element={<Dashboard />} />

        <Route path="/produtos" element={<Produtos />} />

        <Route path="/clientes" element={<Clientes />} />
        <Route path="/vendas" element={<Vendas />} />
      </Route>
    </Routes>
  );
}
