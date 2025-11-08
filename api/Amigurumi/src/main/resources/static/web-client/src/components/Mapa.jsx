import React from "react";

const Mapa = () => {
  return (
    <div className="mapa">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3658.2771949554253!2d-46.478550425407306!3d-23.522530560165375!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce61270808f47f%3A0xddc2deca4778eb69!2sFATEC%20Zona%20Leste!5e0!3m2!1spt-BR!2sbr!4v1762627781481!5m2!1spt-BR!2sbr"
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Mapa Localização"
      />
    </div>
  );
};

export default Mapa;
