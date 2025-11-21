import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import { useCarrinho } from "../contexts/CartContext";
import SmartImage from "../components/SmartImage";
import "../styles.css";

const Carrinho = () => {
  const { cartItems, atualizarQuantidade, removerDoCarrinho, recarregarCarrinho, loading } = useCarrinho();
  const navigate = useNavigate();

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

  const handleQuantidadeChange = async (itemId, novaQuantidade) => {
    if (novaQuantidade < 1) return;
    await atualizarQuantidade(itemId, novaQuantidade);
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

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginTop: '10px'
              }}>
                <span style={{ fontWeight: 'bold' }}>Quantidade:</span>

                <button
                  onClick={() => handleQuantidadeChange(produto.id, produto.quantidade - 1)}
                  disabled={produto.quantidade <= 1}
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    border: '2px solid #007bff',
                    background: 'white',
                    color: '#007bff',
                    cursor: 'pointer',
                    fontSize: '18px',
                    fontWeight: 'bold'
                  }}
                >
                  −
                </button>

                <span style={{
                  minWidth: '30px',
                  textAlign: 'center',
                  fontSize: '18px',
                  fontWeight: 'bold'
                }}>
                  {produto.quantidade}
                </span>

                <button
                  onClick={() => handleQuantidadeChange(produto.id, produto.quantidade + 1)}
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    border: '2px solid #007bff',
                    background: 'white',
                    color: '#007bff',
                    cursor: 'pointer',
                    fontSize: '18px',
                    fontWeight: 'bold'
                  }}
                >
                  +
                </button>
              </div>

              <p style={{ marginTop: '10px', fontWeight: 'bold', color: '#007bff' }}>
                Subtotal: R$ {(parseFloat(produto.preco.replace(',', '.')) * produto.quantidade).toFixed(2).replace('.', ',')}
              </p>
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

      {cartItems.length > 0 && (
        <div style={{
          textAlign: 'center',
          marginTop: '30px',
          padding: '20px',
          background: '#f8f9fa',
          borderRadius: '10px',
          maxWidth: '600px',
          marginLeft: 'auto',
          marginRight: 'auto'
        }}>
          <h3 style={{ marginBottom: '10px' }}>
            Total: R$ {
              cartItems.reduce((acc, item) => {
                const preco = parseFloat(item.preco.replace(',', '.'));
                return acc + (preco * item.quantidade);
              }, 0).toFixed(2).replace('.', ',')
            }
          </h3>
          <p style={{ fontSize: '14px', color: '#666' }}>
            ({cartItems.reduce((acc, item) => acc + item.quantidade, 0)} {
              cartItems.reduce((acc, item) => acc + item.quantidade, 0) === 1
                ? 'item'
                : 'itens'
            })
          </p>
        </div>
      )}

      <div style={{ textAlign: "center", marginTop: "20px", marginBottom: "40px" }}>
        <button className="btn-comprar-produto" onClick={finalizarCompra}>
          Finalizar Compra
        </button>
      </div>

      <Footer />
    </div>
  );
};

export default Carrinho;