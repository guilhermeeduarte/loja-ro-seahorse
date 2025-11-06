import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  // Verifica se o usuário está logado (exemplo: cookie ou localStorage)
  const isLoggedIn = localStorage.getItem("usuarioLogado") === "true";

  return (
    <nav className="navbar principal">
      <div className="container-fluid">
        {/* Logo leva para Home */}
        <Link to="/" className="navbar-brand" id="logo-minimalista">
          <img
            id="logo-minimalista"
            src="/assets/imagens/logo_minimalista.png"
            width="101"
            height="101"
            style={{ borderRadius: "80px" }}
            alt="logo-minimalista"
          />
        </Link>

        {/* Perfil leva para /perfil se logado, /login se não */}
        <Link
          to={isLoggedIn ? "/perfil" : "/login"}
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
            width="50"
            height="60"
            alt="carrinho"
          />
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
