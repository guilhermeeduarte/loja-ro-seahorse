import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useCarrinho } from "../contexts/CartContext";
import "../styles.css";

const ItemResumo = ({ nome, preco, quantidade }) => (
  <li className="item-resumo">
    <span className="produto" style={{ fontSize: "20px", marginLeft: "20px" }}>
      {nome} {quantidade > 1 && `(x${quantidade})`}
    </span>
    <span className="preco">R$ {preco}</span>
  </li>
);

const FinalCompra = () => {
  const { cartItems, recarregarCarrinho } = useCarrinho();
  const navigate = useNavigate();
  const taxaEntrega = 24.2;

  useEffect(() => {
    recarregarCarrinho();
  }, []);

  const calcularTotal = () => {
    const somaProdutos = cartItems.reduce((acc, item) => {
      const precoNumerico = typeof item.preco === 'string'
        ? parseFloat(item.preco.replace(",", "."))
        : parseFloat(item.preco);
      const quantidade = item.quantidade || 1;
      return acc + (precoNumerico * quantidade);
    }, 0);
    return (somaProdutos + taxaEntrega).toFixed(2);
  };

  const prosseguirParaEndereco = () => {
    if (cartItems.length === 0) {
      alert("Seu carrinho está vazio!");
      navigate("/carrinho");
      return;
    }

    // Salva o valor total no sessionStorage para usar depois
    sessionStorage.setItem("valorTotal", calcularTotal());
    navigate("/addendereco");
  };

  if (cartItems.length === 0) {
    return (
      <div className="pagina">
        <Navbar />
        <div style={{ textAlign: "center", padding: "50px" }}>
          <h2>Seu carrinho está vazio</h2>
          <button className="botao" onClick={() => navigate("/")}>
            Voltar para Home
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="pagina">
      <Navbar />

      <section id="titulo-cadastro" className="titulo-cadastro">
        <h1>Resumo da Compra</h1>
      </section>

      <ul className="carrinhos">
        {cartItems.map((item, index) => {
          const precoUnitario = typeof item.preco === 'string'
            ? item.preco
            : item.preco.toFixed(2).replace(".", ",");
          const quantidade = item.quantidade || 1;
          const subtotal = (parseFloat(precoUnitario.replace(",", ".")) * quantidade).toFixed(2).replace(".", ",");

          return (
            <ItemResumo
              key={index}
              nome={item.nome}
              preco={subtotal}
              quantidade={quantidade}
            />
          );
        })}
        <ItemResumo nome="Taxa de Entrega" preco={taxaEntrega.toFixed(2).replace(".", ",")} quantidade={1} />
      </ul>

      <div className="total">
        <span style={{ marginLeft: "20px", fontSize: "20px" }}>Total:</span>
        <span className="valor-total">R$ {calcularTotal().replace(".", ",")}</span>
      </div>

      <button
        className="botao"
        style={{ display: "block", margin: "20px auto" }}
        onClick={prosseguirParaEndereco}
      >
        Confirmar Pedido
      </button>

      <Footer />
    </div>
  );
};

export default FinalCompra;