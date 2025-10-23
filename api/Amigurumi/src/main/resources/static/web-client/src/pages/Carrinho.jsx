import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import Footer from "../components/Footer";
import "../styles.css";

const Carrinho = () => {
  return (
    <div className="pagina">


      {/* Navbar simplificada para o carrinho */}
      <nav className="navbar carrinho">
        <div className="container-fluid">
          {/* Botão voltar */}
          <Link to="/" className="navbar-brand">
            <span className="voltar">&lt;&lt;</span>
          </Link>

          <h2>Seu Carrinho</h2>

          {/* Ícone de pagamento */}
          <Link to="/pagamentos" className="navbar-brand" id="pagamentos">
            <img
              id="pagamento"
              src="/Assets/Imagens/Vector.svg"
              width="50"
              height="60"
              alt="Métodos de Pagamento"
            />
          </Link>
        </div>
      </nav>

      {/* Conteúdo principal */}
      <h1 style={{ textAlign: "center", marginTop: "20px" }}>Itens:</h1>

      <div className="item-carrinho">
        <img src="/Assets/Imagens/Pinguim.jpg" alt="Pinguim" />
        <div className="descricao-carrinho">
          <h3 style={{ fontSize: "20px" }}>Pinguim</h3>
          <p>Preço: R$ 57,90</p>
        </div>
        <div className="adicionar-remover">
          <button className="btn-adicionar" onClick={() => adicionarAoCarrinho(produto)}>
            <img
              src="/Assets/Imagens/soma.png"
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
