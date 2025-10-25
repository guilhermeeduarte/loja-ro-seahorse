import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useCarrinho } from "../contexts/CartContext";

const Navbar = () => {
  const { cartCount, carregarContagem } = useCarrinho();

  useEffect(() => {
    carregarContagem();
  }, []);

  return (
    <nav className="navbar principal">
      <div className="container-fluid">
        {/* Logo leva para Home */}
        <Link to="/" className="navbar-brand" id="logo-minimalista">
          <img
            id="logo-minimalista"
            src="/Assets/Imagens/logo_minimalista.png"
            width="101"
            height="101"
            alt="logo-minimalista"
          />
        </Link>

        {/* Perfil leva para Login */}
        <Link to="/login" className="navbar-brand" id="perfil">
          <img
            id="perfil"
            src="/Assets/Imagens/perfilbranco.png"
            width="60"
            height="60"
            alt="perfil"
          />
        </Link>

        {/* Carrinho com contador */}
        <Link to="/carrinho" className="navbar-brand" id="carrinho" style={{ position: 'relative' }}>
          <img
            id="carrinho"
            src="/Assets/Imagens/carrinho.png"
            width="50"
            height="60"
            alt="carrinho"
          />
          {cartCount > 0 && (
            <span style={{
              position: 'absolute',
              top: '0',
              right: '-5px',
              background: '#ff0000',
              color: 'white',
              borderRadius: '50%',
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: 'bold'
            }}>
              {cartCount}
            </span>
          )}
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;