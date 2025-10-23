import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Whatsapp from "../components/Whatsapp";
import Mapa from "../components/Mapa";
import Contato from "../components/Contato";
import LoginForm from "../components/LoginForm";
import "../styles.css";

const Login = () => {
  return (
    <div className="pagina">
      <Navbar />

      <section id="titulo-cadastro" className="titulo-cadastro">
        <h1>Área de Clientes</h1>
      </section>

      <LoginForm />

      <Contato />

      <Footer />
    </div>
  );
};

export default Login;
