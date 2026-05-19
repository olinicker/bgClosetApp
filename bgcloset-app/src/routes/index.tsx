import { Routes, Route } from "react-router-dom";
import { DefaultLayout } from "../components/DefaultLayout";
import { Produtos } from "../pages/Products";
import { Dashboard } from "../pages/Dashboard";
import { Clientes } from "../pages/Customers";
const Vendas = () => <h1>PDV: Nova Venda</h1>;

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
