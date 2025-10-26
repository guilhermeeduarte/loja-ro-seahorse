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
              <img src="https://cdn.discordapp.com/attachments/1431799178337583195/1431799425142882384/logo_minimalista.png?ex=68febaa0&is=68fd6920&hm=638eeee0ebd793f40cfff57ffba149e5ec5df33776214dd0dff306478fde6bf9&" alt="Logo" />
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
