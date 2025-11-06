// web-client/src/pages/FinalCompra.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useCarrinho } from "../contexts/CartContext";
import "../styles.css";

const API_URL = "http://localhost:3000/api";

const ItemResumo = ({ nome, preco, quantidade }) => (
  <li className="item-resumo">
    <span className="produto" style={{ fontSize: "20px", marginLeft: "20px" }}>
      {nome} {quantidade > 1 && `(x${quantidade})`}
    </span>
    <span className="preco">R$ {preco}</span>
  </li>
);

const FinalCompra = () => {
  const { cartItems, limparCarrinho, recarregarCarrinho } = useCarrinho();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [enderecoEntrega, setEnderecoEntrega] = useState("");
  const [formaPagamento, setFormaPagamento] = useState("PIX");

  // ✅ Recarregar carrinho do backend ao entrar na página
  useEffect(() => {
    recarregarCarrinho();
  }, []);

  const taxaEntrega = 24.2;

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

  const finalizarCompra = async () => {
    if (!enderecoEntrega.trim()) {
      alert("Por favor, informe o endereço de entrega!");
      return;
    }

    if (cartItems.length === 0) {
      alert("Seu carrinho está vazio!");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/pedido/finalizar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          enderecoEntrega: enderecoEntrega,
          formaPagamento: formaPagamento
        })
      });

      if (!response.ok) {
        const erro = await response.text();
        throw new Error(erro);
      }

      const resultado = await response.json();

      alert(`✅ Pedido #${resultado.pedidoId} criado com sucesso!\nTotal: R$ ${resultado.valorTotal.toFixed(2).replace(".", ",")}\nStatus: PENDENTE`);

      limparCarrinho();
      navigate(`/statuspedido?pedidoId=${resultado.pedidoId}`);

    } catch (error) {
      console.error("Erro ao finalizar compra:", error);
      alert(`Erro ao finalizar compra: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pagina">
      <Navbar />

      <section id="titulo-cadastro" className="titulo-cadastro">
        <h1>Resumo da Compra</h1>
      </section>

      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
            Endereço de Entrega:
          </label>
          <input
            type="text"
            className="form-control"
            placeholder="Rua, Número - Bairro - Cidade/Estado"
            value={enderecoEntrega}
            onChange={(e) => setEnderecoEntrega(e.target.value)}
            required
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
            Forma de Pagamento:
          </label>
          <select
            className="form-control"
            value={formaPagamento}
            onChange={(e) => setFormaPagamento(e.target.value)}
          >
            <option value="PIX">PIX</option>
            <option value="BOLETO">Boleto</option>
            <option value="CREDITO">Cartão de Crédito</option>
            <option value="DEBITO">Cartão de Débito</option>
          </select>
        </div>
      </div>

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
        onClick={finalizarCompra}
        disabled={loading}
      >
        {loading ? "Processando..." : "Confirmar Pedido"}
      </button>

      <Footer />
    </div>
  );
};

export default FinalCompra;