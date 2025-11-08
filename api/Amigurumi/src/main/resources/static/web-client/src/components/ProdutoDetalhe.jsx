import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useCarrinho } from "../contexts/CartContext";
import { useWishlist } from "../contexts/WishlistContext";
import SmartImage from "./SmartImage";
import AvaliacaoForm from "./AvaliacaoForm";
import AvaliacoesList from "./AvaliacoesList";
import "../styles.css";

const API_URL = 'http://localhost:3000/api';

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
  const [jaAvaliou, setJaAvaliou] = useState(false);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [refreshAvaliacoes, setRefreshAvaliacoes] = useState(0);

  useEffect(() => {
    const verificar = async () => {
      if (produto?.id) {
        const resultado = await verificarSeEstaNoDesejo(produto.id);
        setEstaNoDesejo(resultado);
        
        // Verificar se já avaliou
        const resAvaliacao = await fetch(`${API_URL}/avaliacao/verificar/${produto.id}`, {
          credentials: 'include'
        });
        if (resAvaliacao.ok) {
          const data = await resAvaliacao.json();
          setJaAvaliou(data.jaAvaliou);
        }
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
    setErroFavorito("");

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

  const handleAvaliacaoEnviada = () => {
    setJaAvaliou(true);
    setMostrarFormulario(false);
    setRefreshAvaliacoes(prev => prev + 1);
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
              cursor: "pointer",
              transition: "width 0.5s, height 0.5s, background-color 0.5s, transform 0.5s"
            }}
          >
            {desejoLoading
              ? "..."
              : estaNoDesejo
                ? "❤️ Remover dos Favoritos"
                : "🤍 Adicionar aos Favoritos"}
          </button>
        </div>

        {erroFavorito && (
          <p style={{ color: "red", marginTop: "10px", fontWeight: "bold" }}>
            {erroFavorito}
          </p>
        )}

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

        {/* Seção de Avaliações */}
        <div style={{ maxWidth: "800px", margin: "40px auto", textAlign: "left" }}>
          <AvaliacoesList produtoId={produto.id} refresh={refreshAvaliacoes} />
          
          {/* Botão/Formulário de Avaliação */}
          {!jaAvaliou && !mostrarFormulario && (
            <button
              className="botao"
              onClick={() => setMostrarFormulario(true)}
              style={{ width: '100%', marginTop: '20px' }}
            >
              ⭐ Avaliar este produto
            </button>
          )}

          {mostrarFormulario && !jaAvaliou && (
            <AvaliacaoForm
              produtoId={produto.id}
              onAvaliacaoEnviada={handleAvaliacaoEnviada}
            />
          )}

          {jaAvaliou && (
            <p style={{ textAlign: 'center', color: '#28a745', marginTop: '20px', fontWeight: 'bold' }}>
              ✅ Você já avaliou este produto
            </p>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}