import React from "react";
import Navbar from "../components/Navbar";
import Mapa from "../components/Mapa";
import Contato from "../components/Contato";
import Footer from "../components/Footer";
import "../styles.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";


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
