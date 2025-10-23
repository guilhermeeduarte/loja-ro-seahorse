import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PerfilForm from "../components/PerfilForm";
import "../styles.css";

const PerfilUsuario = () => {
  return (
    <div className="pagina">
      <Navbar />

      <div id="texto-perfil" className="texto-perfil">
        <h1>Meu Perfil</h1>
        <p>Aqui você pode gerenciar suas informações pessoais e pedidos anteriores.</p>
      </div>

      <div id="guilherme" className="guilherme">
        <img
          id="guilherme"
          src="/Assets/Imagens/guilherme.jpeg"
          alt="guilherme"
        />

        <PerfilForm />
      </div>

      <Footer />
    </div>
  );
};

export default PerfilUsuario;
