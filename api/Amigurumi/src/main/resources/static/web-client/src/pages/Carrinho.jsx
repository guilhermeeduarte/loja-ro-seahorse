// web-client/src/pages/Carrinho.jsx
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import { useCarrinho } from "../contexts/CartContext";
import SmartImage from "../components/SmartImage";
import "../styles.css";

const Carrinho = () => {
  const { cartItems, removerDoCarrinho, recarregarCarrinho, loading } = useCarrinho();
  const navigate = useNavigate();

  // ✅ Recarrega carrinho do backend ao abrir a página
  useEffect(() => {
    recarregarCarrinho();
  }, []);

  const finalizarCompra = () => {
    if (cartItems.length === 0) {
      alert("Seu carrinho está vazio!");
      return;
    }
    navigate("/finalcompra");
  };

  if (loading) {
    return (
      <div className="pagina">
        <nav className="navbar carrinho">
          <div className="container-fluid">
            <Link to="/" className="navbar-brand">
              <span className="voltar">&lt;&lt;</span>
            </Link>
            <h2 className="texto-preto">Seu Carrinho</h2>

          </div>
        </nav>
        <p style={{ textAlign: "center", marginTop: "50px" }}>Carregando carrinho...</p>
        <Footer />
      </div>
    );
  }

  return (
    <div className="pagina">
      <nav className="navbar carrinho">
        <div className="container-fluid">
          <Link to="/" className="navbar-brand">
            <span className="voltar">&lt;&lt;</span>
          </Link>
          <h2>Seu Carrinho</h2>
          <Link to="/pagamentos" className="navbar-brand ms-auto" id="pagamentos">
            <img
              id="pagamento"
              src="/Assets/Imagens/dinheiro.png"
              width="80"
              height="65"
              
              alt="Métodos de Pagamento"
            />
          </Link>
        </div>
      </nav>

      <h1 style={{ textAlign: "center", marginTop: "20px" }}>Itens:</h1>

      {cartItems.length === 0 ? (
        <p style={{ textAlign: "center" }}>Seu carrinho está vazio.</p>
      ) : (
        cartItems.map((produto, index) => (
          <div className="item-carrinho" key={index}>
            <SmartImage src={produto.img} alt={produto.nome} />
            <div className="descricao-carrinho">
              <h3 style={{ fontSize: "20px" }}>{produto.nome}</h3>
              <p>Preço: R$ {produto.preco}</p>
              <p>Quantidade: {produto.quantidade || 1}</p>
            </div>
            <div className="adicionar-remover">
              <button
                className="btn-danger"
                style={{ marginLeft: "12px", marginTop: "8px" }}
                onClick={() => removerDoCarrinho(produto.id)}
              >
                Remover
              </button>
            </div>
          </div>
        ))
      )}

      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button className="btn-comprar-produto" onClick={finalizarCompra}>
          Finalizar Compra
        </button>
      </div>

      <Footer />
    </div>
  );
};

export default Carrinho;