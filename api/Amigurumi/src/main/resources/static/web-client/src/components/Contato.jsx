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
          src="https://cdn.discordapp.com/attachments/1431799178337583195/1431799467656478751/whatsapp.png?ex=68febaaa&is=68fd692a&hm=6f24f31d51af4c492e8d181422a45c0b36fda91bc4b523fb68085a72e7465c76&"
          alt="WhatsApp"
          className="contato-whatsapp"
        />
      </a>
      <a href="mailto:exemplo@email.com">
        <img
          src="https://cdn.discordapp.com/attachments/1431799178337583195/1431799373549010996/email.png?ex=68feba94&is=68fd6914&hm=3994f8fce68ad88d4e6c96d066d8096edd532a7bd80da13896c30d6e2a20e106&"
          alt="E-mail"
          className="contato-email"
        />
      </a>
    </div>
  );
};

export default Contato;
