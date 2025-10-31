import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import { useCarrinho } from "../contexts/CartContext";
import SmartImage from "../components/SmartImage";
import "../styles.css";

const Carrinho = () => {
  const { cartItems, removerDoCarrinho } = useCarrinho();
  const navigate = useNavigate(); // ✅ Hook do React Router

  const enviarCarrinho = async () => {
    try {
      const response = await fetch("https://localhost:5173/api/carrinho/adicionar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itens: cartItems }),
      });

      const resultado = await response.json();
      console.log("Carrinho enviado:", resultado);
    } catch (error) {
      console.error("Erro ao enviar carrinho:", error);
    }
  };

  const finalizarCompra = async () => {
    await enviarCarrinho();
    navigate("/finalcompra"); // ✅ Navegação sem recarregar a página
  };

  return (
    <div className="pagina">
      <nav className="navbar carrinho">
        <div className="container-fluid">
          <Link to="/" className="navbar-brand">
            <span className="voltar">&lt;&lt;</span>
          </Link>
          <h2>Seu Carrinho</h2>
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
            </div>
            <div className="adicionar-remover">
              <button
                className="btn-danger"
                style={{ marginLeft: "12px", marginTop: "8px" }}
                onClick={() => removerDoCarrinho(produto.nome)}
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
