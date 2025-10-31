import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Whatsapp from "../components/Whatsapp";
import Contato from "../components/Contato";
import Mapa from "../components/Mapa";
import EsqueciForm from "../components/EsqueciForm"; // ✅ import do componente separado
import "../styles.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const Esqueci = () => {
  return (
    <div className="pagina">
      <Navbar />

      <section id="titulo-cadastro" className="titulo-cadastro">
        <h1>Esqueci minha senha</h1>
      </section>

      <EsqueciForm />
      <Contato />
      <Footer />
    </div>
  );
};

export default Esqueci;
