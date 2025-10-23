import React from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { produtos } from "./Home"; // importa array de produtos da Home
import "../styles.css";

export default function ProdutoDetalhe() {
  const { produtoNome } = useParams();

  const produto = produtos.find(
    (p) => p.nome.toLowerCase() === decodeURIComponent(produtoNome).toLowerCase()
  );

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
        <button type="button" className="btn-comprar-produto">Comprar</button>

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
