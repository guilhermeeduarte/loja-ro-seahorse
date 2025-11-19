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
  const [imagemAtual, setImagemAtual] = useState(0);

  // Agora usamos diretamente produto.imagens
  const imagens = React.useMemo(() => {
    return Array.isArray(produto?.imagens) && produto.imagens.length > 0
      ? produto.imagens
      : ['/assets/imagens/placeholder.png'];
  }, [produto]);

  useEffect(() => {
    const verificar = async () => {
      if (produto?.id) {
        const resultado = await verificarSeEstaNoDesejo(produto.id);
        setEstaNoDesejo(resultado);

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
      img: imagens[0], // usa a primeira imagem como principal
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

  const proximaImagem = () => {
    setImagemAtual((prev) => (prev + 1) % imagens.length);
  };

  const imagemAnterior = () => {
    setImagemAtual((prev) => (prev - 1 + imagens.length) % imagens.length);
  };

console.log("Imagem atual:", imagens[imagemAtual], "Lista completa:", imagens);

  return (
    <div className="pagina">
      <Navbar />

      <div className="produto-detalhe" style={{ textAlign: "center", padding: "40px 20px" }}>
        {/* ✅ Carousel de Imagens */}
        <div className="image-carousel-container">
          <img
            src={imagens[imagemAtual]}
            alt={`${produto.nome} - Imagem ${imagemAtual + 1}`}
            className="produto-imagem-principal"
          />


          {imagens.length > 1 && (
            <>
              <button
                onClick={imagemAnterior}
                className="carousel-btn carousel-btn-prev"
                aria-label="Imagem anterior"
              >
                ‹
              </button>
              <button
                onClick={proximaImagem}
                className="carousel-btn carousel-btn-next"
                aria-label="Próxima imagem"
              >
                ›
              </button>
            </>
          )}

          {imagens.length > 1 && (
            <div className="carousel-indicators">
              {imagens.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setImagemAtual(index)}
                  className={`indicator ${imagemAtual === index ? 'active' : ''}`}
                  aria-label={`Ir para imagem ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {imagens.length > 1 && (
          <div className="thumbnails-container">
            {imagens.map((img, index) => (
              <SmartImage
                key={index}
                src={img}
                alt={`Miniatura ${index + 1}`}
                onClick={() => setImagemAtual(index)}
                className={`thumbnail ${imagemAtual === index ? 'active' : ''}`}
              />
            ))}
          </div>
        )}

        <h2>{produto.nome}</h2>
        <h3>
          R${" "}
          {typeof produto.preco === "string"
            ? produto.preco
            : produto.preco?.toFixed(2).replace(".", ",") || "0,00"}
        </h3>

        <div className="produto-actions">
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
          >
            {desejoLoading
              ? "..."
              : estaNoDesejo
                ? "❤️ Remover dos Favoritos"
                : "🤍 Adicionar aos Favoritos"}
          </button>
        </div>

        {erroFavorito && (
          <p className="erro-favorito">{erroFavorito}</p>
        )}

        <div className="descricao">
          <h2>Descrição</h2>
          <p>{produto.descricao}</p>

          {produto.detalhes && (
            <>
              <h2>Detalhes do Produto</h2>
              <p>{produto.detalhes}</p>
            </>
          )}
        </div>

        <div className="avaliacoes-section">
          <AvaliacoesList produtoId={produto.id} refresh={refreshAvaliacoes} />

          {!jaAvaliou && !mostrarFormulario && (
            <button
              className="botao"
              onClick={() => setMostrarFormulario(true)}
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
            <p className="ja-avaliou-msg">
              ✅ Você já avaliou este produto
            </p>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
