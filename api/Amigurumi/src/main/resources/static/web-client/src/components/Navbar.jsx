import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  // Verifica se o usuário está logado (exemplo: cookie ou localStorage)
  const isLoggedIn = localStorage.getItem("usuarioLogado") === "true";
  const tipoUsuario = localStorage.getItem("tipoUsuario");

  // Define o link correto para o perfil
    const perfilLink = !isLoggedIn
      ? "/login"
      : tipoUsuario === "ADMINISTRADOR"
        ? "/perfil_adm"
        : "/perfil";

  return (
    <nav className="navbar principal">
      <div className="container-fluid">
        {/* Logo leva para Home */}
        <Link to="/" className="navbar-brand" id="logo-minimalista">
          <img
            id="logo-minimalista"
            src="/assets/imagens/logo_minimalista.png"
            width="70"
            height="70"
            style={{ borderRadius: "80px" }}
            alt="logo-minimalista"
          />
        </Link>

        {/* Perfil leva para /perfil se CLIENTE, /perfil se ADMINISTRADOR, /login se nada */}
        <Link
          to={perfilLink}
          className="navbar-brand"
          id="perfil"
        >
          <img
            id="perfil"
            src="/assets/imagens/perfil.png"
            width="60"
            height="60"
            alt="perfil"
          />
        </Link>

        {/* Carrinho */}
        <Link to="/carrinho" className="navbar-brand" id="carrinho">
          <img
            id="carrinho"
            src="/assets/imagens/carrinho.png"
            width="60"
            height="60"
            alt="carrinho"
          />
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
