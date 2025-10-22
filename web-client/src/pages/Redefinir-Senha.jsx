import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Contato from "../components/Contato";
import RedefinirSenhaForm from "../components/RedefinirSenhaForm";
import "../styles.css";

const RedefinirSenha = () => {
  return (
    <div className="pagina">
      <Navbar />

      <section id="titulo-cadastro" className="titulo-cadastro">
        <h1>Redefinir Senha</h1>
      </section>

      <RedefinirSenhaForm />

      <Contato />
      <Footer />
    </div>
  );
};

export default RedefinirSenha;
