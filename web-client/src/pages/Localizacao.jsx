import React from "react";
import Navbar from "./Navbar";
import Mapa from "./Mapa";
import Contato from "./Contato";
import Footer from "./Footer";
import "./styles.css";

const Localizacao = () => {
  return (
    <div className="pagina">
      <Navbar />

      <section id="titulo-cadastro" className="titulo-cadastro">
        <h1>Localização</h1>
      </section>

      <Mapa />

      <div className="texto-localizacao">
        <p>Mais dúvidas? Entre em contato por meio das nossas redes!</p>
      </div>

      <Contato />

      <Footer />
    </div>
  );
};

export default Localizacao;
