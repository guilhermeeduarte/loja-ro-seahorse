import React from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useCarrinho } from "../contexts/CartContext";
import "../styles.css";
import { useNavigate } from "react-router-dom";

// Componente para exibir cada item do resumo
const ItemResumo = ({ nome, preco }) => (
  <li className="item-resumo">
    <span className="produto" style={{ fontSize: "20px", marginLeft: "20px" }}>
      {nome}
    </span>
    <span className="preco">{preco}</span>
  </li>
);

const FinalCompra = () => {
  const { cartItems } = useCarrinho();
  const taxaEntrega = 24.2;

  const calcularTotal = () => {
    const somaProdutos = cartItems.reduce((acc, item) => {
      const precoNumerico = parseFloat(item.preco.replace(",", "."));
      return acc + precoNumerico;
    }, 0);
    return (somaProdutos + taxaEntrega).toFixed(2).replace(".", ",");
  };

  const navigate = useNavigate();

  const finalizarCompra = async () => {
    try {
      const response = await fetch("https://localhost:5173/api/compra/finalizar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itens: cartItems,
          taxaEntrega,
          total: calcularTotal(),
        }),
      });

      const resultado = await response.json();
      alert("Compra finalizada com sucesso!");
      console.log("Resposta do servidor:", resultado);
    } catch (error) {
      console.error("Erro ao finalizar compra:", error);
    } finally {
      navigate('/pagamentos'); // Will navigate regardless of success or error
    }
  };

  return (
    <div className="pagina">
      <Navbar />

      <section id="titulo-cadastro" className="titulo-cadastro">
        <h1>Resumo da Compra</h1>
      </section>

      <ul className="carrinhos">
        {cartItems.map((item, index) => (
          <ItemResumo key={index} nome={item.nome} preco={`R$ ${item.preco}`} />
        ))}
        <ItemResumo nome="Taxa de Entrega" preco={`R$ ${taxaEntrega.toFixed(2).replace(".", ",")}`} />
      </ul>

      <div className="total">
        <span style={{ marginLeft: "20px", fontSize: "20px" }}>Total:</span>
        <span className="valor-total">R$ {calcularTotal()}</span>
      </div>

      <button
        className="botao"
        style={{ display: "block", margin: "0 auto", marginTop: "20px", marginBottom: "20px" }}
        onClick={finalizarCompra}
      >
        Ir ao pagamento
      </button>

      <Footer />
    </div>
  );
};

export default FinalCompra;
