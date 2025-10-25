import React from "react";

const Contato = () => {
  return (
    <div className="logos-contato">
      <a
        href="https://wa.me/?text=https://www.exemplo.com"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          src="https://raw.githubusercontent.com/guilhermeeduarte/loja-ro-seahorse/refs/heads/main/api/Amigurumi/src/main/resources/static/web-client/Assets/Imagens/whatsapp.png"
          alt="WhatsApp"
          className="contato-whatsapp"
        />
      </a>
      <a href="mailto:exemplo@email.com">
        <img
          src="Assets/Imagens/email.png"
          alt="E-mail"
          className="contato-email"
        />
      </a>
    </div>
  );
};

export default Contato;
