import React from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import "../styles.css"; // ajuste o caminho conforme sua estrutura
import { Helmet } from "react-helmet";

const Carrinho = () => {
    
  return (
    
    <div className="pagina">

    <Helmet>
        <title>SeaHorse - Carrinho</title>
    </Helmet>

      <nav className="navbar carrinho">
        <div className="container-fluid">
          <Link to="/" className="voltar" aria-label="voltar">
            &lt;&lt;
          </Link>

          <h2>Seu Carrinho</h2>

          <Link to="/pagamentos" className="navbar-brand" id="pagamentos" aria-label="pagamentos">
            <img
              id="carrinho"
              src="Assets/Imagens/Vector.svg"
              width="50"
              height="60"
              alt="carrinho"
            />
          </Link>
        </div>
      </nav>

      <h1 style={{ textAlign: "center", marginTop: "20px" }}>Itens:</h1>

      <div className="item-carrinho">
        <img src="Assets/Imagens/Pinguim.jpg" alt="Pinguim" />
        <div className="descricao-carrinho">
          <h3 style={{ fontSize: "20px" }}>Pinguim</h3>
          <p>Preço: 57,90</p>
        </div>
        <div className="adicionar-remover">
          <button>
            <img
              src="Assets/Imagens/soma.png"
              alt="Adicionar produto"
              className="soma-carrinho"
            />
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Carrinho;
