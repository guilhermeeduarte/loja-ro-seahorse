import React from "react";

const Footer = () => {
  return (
    <footer>
      <div className="footer-top">
        <ul>
          <li><a href="contato.html">Contato</a></li>
          <li><a href="localizacao.html">Localização</a></li>
          <li><a href="faq.html">Dúvidas</a></li>
        </ul>

        <ul className="logo-footer">
          <li>
            <a href="home.html">
              <img src="Assets/Imagens/logo_minimalista.png" alt="Logo" />
            </a>
          </li>
        </ul>
      </div>

      <div className="footer-bottom">
        <a href="direitosreservados.html">
          <p>Todos os direitos reservados © 2025 - RO SeaHorse</p>
        </a>
      </div>
    </footer>
  );
};

export default Footer;
