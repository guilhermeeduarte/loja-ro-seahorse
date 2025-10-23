import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Localizacao from "./pages/Localizacao.jsx";
import Cadastro from "./pages/Cadastro.jsx";
import Carrinho from "./pages/Carrinho.jsx";
import Contatar from "./pages/Contatar.jsx";
import Faq from "./pages/Faq.jsx";
import Esqueci from "./pages/Esqueci.jsx";
import Login from "./pages/Login.jsx";
import RedefinirSenha from "./pages/Redefinir-Senha.jsx";
import ProdutoDetalhe from "./pages/ProdutoDetalhe.jsx";
import PerfilCliente from "./pages/PerfilCliente";
import PerfilUsuario from "./pages/PerfilUsuario";
import React from "react";
import PerfilAdm from "./pages/PerfilAdm.jsx";
import CadastroProduto from "./pages/CadastroProduto.jsx";
import AddEndereco from "./pages/AddEndereco.jsx";
import Perfil from "./pages/Perfil.jsx";
import Pagamentos from "./pages/Pagamentos.jsx";
import ExclusaoProdutos from "./pages/ExclusaoProdutos.jsx";
import FinalCompra from "./pages/FinalCompra.jsx";
import StatusPedido from "./pages/StatusPedido.jsx";



export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/localizacao" element={<Localizacao />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/carrinho" element={<Carrinho />} />
        <Route path="/contatar" element={<Contatar />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/esqueci" element={<Esqueci />} />
        <Route path="/login" element={<Login />} />
        <Route path="/redefinir-senha" element={<RedefinirSenha />} />
        <Route path="/produto/:produtoNome" element={<ProdutoDetalhe />} />
        <Route path="/perfil" element={<PerfilCliente />} />
        <Route path="/perfil_usuario" element={<PerfilUsuario />} />
        <Route path="/perfil_adm" element={<PerfilAdm />} />
        <Route path="/cadastroproduto" element={<CadastroProduto />} />
        <Route path="/addendereco" element={<AddEndereco />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/pagamentos" element={<Pagamentos />} />
        <Route path="/exclusaoprodutos" element={<ExclusaoProdutos />} />
        <Route path="/finalcompra" element={<FinalCompra />} />
        <Route path="/statuspedido" element={<StatusPedido />} />
      </Routes>
    </BrowserRouter>
  );
}
