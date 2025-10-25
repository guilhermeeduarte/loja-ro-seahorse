import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useCarrinho } from "../contexts/CartContext";
import "../styles.css";

export default function ProdutoDetalhe({ produto }) {
  const { adicionarAoCarrinho } = useCarrinho();

  if (!produto) return <p>Produto não encontrado.</p>;

  return (
    <div className="pagina">
      <Navbar />

      <div className="produto-detalhe" style={{ textAlign: "center", padding: "40px 20px" }}>
        <img
          src={`/Assets/${produto.img}`}
          alt={produto.nome}
          style={{
            width: "350px",
            height: "350px",
            borderRadius: "16px",
            objectFit: "cover",
          }}
        />
        <h2>{produto.nome}</h2>
        <h3>R$ {produto.preco ?? "0,00"}</h3>

        <button className="btn-comprar-produto" onClick={() => adicionarAoCarrinho(produto)}>
          Adicionar ao Carrinho
        </button>

        <div className="descricao" style={{ marginTop: "20px" }}>
          <h2>Descrição</h2>
          <p>{produto.descricao}</p>

          {produto.detalhes && (
            <>
              <h2>Detalhes do Produto</h2>
              <p>{produto.detalhes}</p>
            </>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
