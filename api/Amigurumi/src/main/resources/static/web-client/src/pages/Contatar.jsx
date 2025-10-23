import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles.css";

const Contato = () => {
  useEffect(() => {
    document.title = "Contato - RO SeaHorse";
  }, []);

  return (
    <div className="pagina">
      <Navbar />

      <section id="titulo-cadastro" className="titulo-cadastro">
        <h1>Contato</h1>
      </section>

      <form action="" className="form-contato">
        <input type="text" id="nome" name="nome" placeholder="Nome completo" /><br />
        <input type="email" id="email" name="email" placeholder="E-mail" /><br />
        <input type="tel" id="whatsapp" name="whatsapp" placeholder="WhatsApp" /><br />
        <textarea id="mensagem" name="mensagem" placeholder="Mensagem"></textarea><br />
        <button type="submit" className="enviar"><strong>Enviar</strong></button>
        <button type="reset" className="limpar"><strong>Limpar</strong></button>
      </form>

      <div className="logos-contato">
        <a href="https://wa.me/?text=https://www.exemplo.com" target="_blank">
          <img src="Assets/Imagens/whatsapp.png" alt="WhatsApp" className="contato-whatsapp" />
        </a>
        <a href="mailto:exemplo@email.com">
          <img src="Assets/Imagens/email.png" alt="E-mail" className="contato-email" />
        </a>
      </div>

      <Footer />
    </div>
  );
};

export default Contato;
