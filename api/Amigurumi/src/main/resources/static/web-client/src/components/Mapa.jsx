import React from "react";

const Mapa = () => {
  return (
    <div className="mapa">
      <iframe
        src="https://www.google.com/maps/embed?pb=..."
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Mapa Localização"
      />
    </div>
  );
};

export default Mapa;
