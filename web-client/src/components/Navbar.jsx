import React from "react";

const Navbar = () => {
  return (
    <nav className="navbar principal">
      <div className="container-fluid">
        <a className="navbar-brand" href="#" id="logo-minimalista">
          <img
            id="logo-minimalista"
            src="Assets/Imagens/logo_minimalista.png"
            width="101"
            height="101"
            alt="logo-minimalista"
          />
        </a>

        <a className="navbar-brand" href="/web-client/cadastro.html" id="perfil">
          <img
            id="perfil"
            src="Assets/Imagens/perfil.png"
            width="60"
            height="60"
            alt="perfil"
          />
        </a>

        <a className="navbar-brand" href="#" id="carrinho">
          <img
            id="carrinho"
            src="Assets/Imagens/carrinho.png"
            width="50"
            height="60"
            alt="carrinho"
          />
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
