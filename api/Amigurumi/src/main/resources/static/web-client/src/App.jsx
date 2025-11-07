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
import Devolucao from "./pages/Devolucao.jsx";
import PerfilCliente from "./pages/PerfilCliente";
import PerfilUsuario from "./pages/PerfilUsuario";
import React from "react";
import PerfilAdm from "./pages/PerfilAdm.jsx";
import CadastroProduto from "./pages/CadastroProduto.jsx";
import AddEndereco from "./pages/AddEndereco.jsx";
import Pagamentos from "./pages/Pagamentos.jsx";


import FinalCompra from "./pages/FinalCompra.jsx";
import StatusPedido from "./pages/StatusPedido.jsx";
import GerenciarPedidos from "./pages/GerenciarPedidos.jsx";
import { CartProvider } from "./contexts/CartContext";
import { WishlistProvider } from "./contexts/WishlistContext";
import ProdutoPage from "./pages/ProdutoPage.jsx";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <WishlistProvider>
          <Routes>
            {/* Rotas públicas */}
            <Route path="/" element={<Home />} />
            <Route path="/localizacao" element={<Localizacao />} />
            <Route path="/cadastro" element={<Cadastro />} />
            <Route path="/contatar" element={<Contatar />} />
            <Route path="/faq" element={<Faq />} />
            <Route path="/esqueci" element={<Esqueci />} />
            <Route path="/login" element={<Login />} />
            <Route path="/redefinir-senha" element={<RedefinirSenha />} />
            <Route path="/produto/:produtoNome" element={<ProdutoPage />} />
            <Route path="/pagamentos" element={<Pagamentos />} />
            <Route path="/devolucao" element={<Devolucao />} />

            {/* Rotas que exigem login */}
            <Route
              path="/carrinho"
              element={
                <ProtectedRoute allowedRoles={['CLIENTE', 'FUNCIONARIO', 'ADMINISTRADOR']}>
                  <Carrinho />
                </ProtectedRoute>
              }
            />
            <Route
              path="/perfil"
              element={
                <ProtectedRoute allowedRoles={['CLIENTE', 'FUNCIONARIO', 'ADMINISTRADOR']}>
                  <PerfilCliente />
                </ProtectedRoute>
              }
            />
            <Route
              path="/perfil_edicao"
              element={
                <ProtectedRoute allowedRoles={['CLIENTE', 'FUNCIONARIO', 'ADMINISTRADOR']}>
                  <PerfilUsuario />
                </ProtectedRoute>
              }
            />
            <Route
              path="/addendereco"
              element={
                <ProtectedRoute allowedRoles={['CLIENTE', 'FUNCIONARIO', 'ADMINISTRADOR']}>
                  <AddEndereco />
                </ProtectedRoute>
              }
            />
            <Route
              path="/finalcompra"
              element={
                <ProtectedRoute allowedRoles={['CLIENTE', 'FUNCIONARIO', 'ADMINISTRADOR']}>
                  <FinalCompra />
                </ProtectedRoute>
              }
            />
            <Route
              path="/statuspedido"
              element={
                <ProtectedRoute allowedRoles={['CLIENTE', 'FUNCIONARIO', 'ADMINISTRADOR']}>
                  <StatusPedido />
                </ProtectedRoute>
              }
            />

            {/* Rotas apenas para FUNCIONARIO e ADMINISTRADOR */}
            <Route
              path="/perfil_adm"
              element={
                <ProtectedRoute allowedRoles={['FUNCIONARIO', 'ADMINISTRADOR']}>
                  <PerfilAdm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/cadastroproduto"
              element={
                <ProtectedRoute allowedRoles={['FUNCIONARIO', 'ADMINISTRADOR']}>
                  <CadastroProduto />
                </ProtectedRoute>
              }
            />
            <Route
              path="/exclusaoprodutos"
              element={
                <ProtectedRoute allowedRoles={['FUNCIONARIO', 'ADMINISTRADOR']}>
                  <ExclusaoProdutos />
                </ProtectedRoute>
              }
            />
            <Route
              path="/gerenciar-pedidos"
              element={
                <ProtectedRoute allowedRoles={['FUNCIONARIO', 'ADMINISTRADOR']}>
                  <GerenciarPedidos />
                </ProtectedRoute>
              }
            />
          </Routes>
        </WishlistProvider>
      </CartProvider>
    </BrowserRouter>
  );
}