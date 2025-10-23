import React from "react";
import Navbar from "../components/Navbar";
import Mapa from "../components/Mapa";
import Contato from "../components/Contato";
import Footer from "../components/Footer";
import "../styles.css";
import { Helmet } from "react-helmet";


const Localizacao = () => {
  return (
    <div className="pagina">
        
    <Helmet>
        <title>SeaHorse - Carrinho</title>
    </Helmet>

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
