import { Routes, Route } from "react-router-dom";
import { DefaultLayout } from "../components/DefaultLayout";

const Dashboard = () => <h1>Dashboard: Gráficos em breve</h1>;
const Produtos = () => <h1>CRUD de Produtos</h1>;
const Clientes = () => <h1>Gestão de Clientes</h1>;
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
