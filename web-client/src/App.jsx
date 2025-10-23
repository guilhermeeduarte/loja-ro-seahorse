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
      </Routes>
    </BrowserRouter>
  );
}
