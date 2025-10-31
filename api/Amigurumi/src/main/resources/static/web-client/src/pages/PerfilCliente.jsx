import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const PerfilCliente = () => {
  return (
    <div className="pagina">
      <Navbar />

      <div className="titulo-adm">
        <h2>Bem-vindo, Guilherme!</h2>
      </div>

      {/* FAVORITOS */}
      <h3 className="titulo-area">Favoritos:</h3>
      <div className="cadastro-produto">
        <div className="grid-fav">
          <div className="item">
            <img src="/Assets/Imagens/Hermione.jpg" alt="Hermione Granger" />
            <p>Hermione Granger</p>
          </div>
          <div className="item">
            <img src="/Assets/Imagens/Harry_Potter.jpg" alt="Harry Potter" />
            <p>Harry Potter</p>
          </div>
        </div>
      </div>

      <br />

      {/* PEDIDOS ANTERIORES */}
      <h3 className="titulo-area">Pedidos anteriores:</h3>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          margin: "20px 0",
        }}
      >
        <img
          src="/Assets/Imagens/Pinguim.jpg"
          alt="Pinguim"
          style={{
            width: "125px",
            marginLeft: "40px",
            borderRadius: "13px",
          }}
        />
        <div style={{ marginLeft: "20px" }}>
          <h3 style={{ margin: 0, fontSize: "18px", color: "#333" }}>Pinguim</h3>
          <p style={{ margin: "5px 0 0", fontSize: "16px", color: "#666" }}>
            Preço: R$ 57,90
          </p>
          <Link to="/statuspedido" style={{ textDecoration: "none" }}>
            Acompanhar status do pedido
          </Link>
        </div>
      </div>

      <br />

      {/* EDIÇÃO DO PERFIL */}
      <h3 className="titulo-area">Edição do perfil:</h3>
      <div className="edicao-produto" style={{ marginBottom: "30px" }}>
        <Link to="/perfil_usuario">
          <img
            src="/Assets/Imagens/edicao.png"
            alt="Edição de perfil"
            className="edicao"
          />
        </Link>
      </div>

      <Footer />
    </div>
  );
};

export default PerfilCliente;
