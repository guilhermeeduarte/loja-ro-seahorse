import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useCarrinho } from "../contexts/CartContext";
import { useWishlist } from "../contexts/WishlistContext";
import SmartImage from "./SmartImage";
import "../styles.css";

export default function ProdutoDetalhe({ produto }) {
  const { adicionarAoCarrinho, loading: carrinhoLoading } = useCarrinho();
  const {
    adicionarAoDesejo,
    removerDoDesejo,
    verificarSeEstaNoDesejo,
    loading: desejoLoading
  } = useWishlist();

  const [estaNoDesejo, setEstaNoDesejo] = useState(false);
  const [erroFavorito, setErroFavorito] = useState("");

  useEffect(() => {
    const verificar = async () => {
      if (produto?.id) {
        const resultado = await verificarSeEstaNoDesejo(produto.id);
        setEstaNoDesejo(resultado);
      }
    };
    verificar();
  }, [produto, verificarSeEstaNoDesejo]);

  if (!produto) return <p>Produto não encontrado.</p>;

  const handleAdicionar = () => {
    const produtoFormatado = {
      id: produto.id,
      nome: produto.nome,
      preco:
        typeof produto.preco === "string"
          ? produto.preco
          : produto.preco.toFixed(2).replace(".", ","),
      img: produto.img,
      descricao: produto.descricao
    };

    adicionarAoCarrinho(produtoFormatado);
  };

  const handleToggleDesejo = async () => {
    setErroFavorito(""); // limpa erro anterior

    try {
      if (estaNoDesejo) {
        await removerDoDesejo(produto.id);
        setEstaNoDesejo(false);
      } else {
        await adicionarAoDesejo(produto.id);
        setEstaNoDesejo(true);
      }
    } catch (error) {
      setErroFavorito(error.message || "Erro ao atualizar favoritos.");
    }
  };

  return (
    <div className="pagina">
      <Navbar />

      <div className="produto-detalhe" style={{ textAlign: "center", padding: "40px 20px" }}>
        <SmartImage
          src={produto.img}
          alt={produto.nome}
          style={{
            width: "350px",
            height: "350px",
            borderRadius: "16px",
            objectFit: "cover"
          }}
        />
        <h2>{produto.nome}</h2>
        <h3>
          R${" "}
          {typeof produto.preco === "string"
            ? produto.preco
            : produto.preco?.toFixed(2).replace(".", ",") || "0,00"}
        </h3>

        {/* ✅ Botões lado a lado */}
        <div style={{ display: "flex", gap: "15px", justifyContent: "center", marginTop: "20px" }}>
          <button
            className="btn-comprar-produto"
            onClick={handleAdicionar}
            disabled={carrinhoLoading}
          >
            {carrinhoLoading ? "Adicionando..." : "Adicionar ao Carrinho"}
          </button>

          <button
            className={estaNoDesejo ? "btn-remover-desejo" : "btn-adicionar-desejo"}
            onClick={handleToggleDesejo}
            disabled={desejoLoading}
            style={{
              background: estaNoDesejo ? "#ff4444" : "#ff6b9d",
              color: "white",
              borderRadius: "20px",
              fontSize: "20px",
              fontWeight: "bold",
              padding: "20px",
              border: "none",
              fontFamily: "poppins, sans-serif",
              cursor: "pointer"
            }}
          >
            {desejoLoading
              ? "..."
              : estaNoDesejo
                ? "❤️ Remover dos Favoritos"
                : "🤍 Adicionar aos Favoritos"}
          </button>
        </div>
        {/* ✅ Mensagem de erro */}
        {erroFavorito && (
          <p style={{ color: "red", marginTop: "10px", fontWeight: "bold" }}>
            {erroFavorito}
          </p>
        )}

        <div className="descricao" style={{ marginTop: "20px" }}>
          <h2 style={{ textAlign: "center" }}>Descrição</h2>
          <p style={{ textAlign: "left" }}>{produto.descricao}</p>


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
