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
            src="/assets/imagens/logo_minimalista.png"
            width="101"
            height="101"
            border-radius= "80px"
            alt="logo-minimalista"
          />
        </Link>

        {/* Perfil leva para Login */}
        <Link to="/login" className="navbar-brand" id="perfil">
          <img
            id="perfil"
            src="/assets/imagens/perfil.png"
            width="60"
            height="60"
            alt="perfil"
          />
        </Link>

        {/* Carrinho, exemplo: você pode criar rota /carrinho */}
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


/* rapaiz *//* eu to tentando entender pq o logo n ta aparecendo */