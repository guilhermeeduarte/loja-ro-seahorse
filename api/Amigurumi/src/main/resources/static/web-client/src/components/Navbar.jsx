import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar principal">
      <div className="container-fluid">
        {/* Logo leva para Home */}
        <Link to="/" className="navbar-brand" id="logo-minimalista">
          <img
            id="logo-minimalista"
            src="src/main/resources/static/web-client/assets/Imagens/logo_minimalista.png"
            width="101"
            height="101"
            alt="logo-minimalista"
          />
        </Link>

        {/* Perfil leva para Login */}
        <Link to="/login" className="navbar-brand" id="perfil">
          <img
            id="perfil"
            src="/assets/Imagens/perfil.png"
            width="60"
            height="60"
            alt="perfil"
          />
        </Link>

        {/* Carrinho, exemplo: você pode criar rota /carrinho */}
        <Link to="/carrinho" className="navbar-brand" id="carrinho">
          <img
            id="carrinho"
            src="/assets/Imagens/carrinho.png"
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
