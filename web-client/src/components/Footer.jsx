import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer>
      <div className="footer-top">
        <ul>
          <li><Link to="/contatar">Contato</Link></li>
          <li><Link to="/localizacao">Localização</Link></li>
          <li><Link to="/faq">Dúvidas</Link></li>
        </ul>

        <ul className="logo-footer">
          <li>
            <Link to="/">
              <img src="Assets/Imagens/logo_minimalista.png" alt="Logo" />
            </Link>
          </li>
        </ul>
      </div>

      <div className="footer-bottom">
        <Link to="/direitosreservados">
          <p>Todos os direitos reservados © 2025 - RO SeaHorse</p>
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
