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

  // Cria array de imagens disponíveis
  const imagens = [
    produto?.img,
    produto?.imagemUrl2,
    produto?.imagemUrl3
  ].filter(Boolean);

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

  const proximaImagem = () => {
    setImagemAtual((prev) => (prev + 1) % imagens.length);
  };

  const imagemAnterior = () => {
    setImagemAtual((prev) => (prev - 1 + imagens.length) % imagens.length);
  };

  return (
    <div className="pagina">
      <Navbar />

      <div className="produto-detalhe" style={{ textAlign: "center", padding: "40px 20px" }}>
        {/* Carousel de Imagens */}
        <div style={{ position: 'relative', display: 'inline-block', marginBottom: '20px' }}>
          <SmartImage
            src={imagens[imagemAtual]}
            alt={`${produto.nome} - Imagem ${imagemAtual + 1}`}
            style={{
              width: "350px",
              height: "350px",
              borderRadius: "16px",
              objectFit: "cover"
            }}
          />

          {/* Setas de navegação - só aparecem se houver mais de 1 imagem */}
          {imagens.length > 1 && (
            <>
              <button
                onClick={imagemAnterior}
                style={{
                  position: 'absolute',
                  left: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'rgba(0, 0, 0, 0.5)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  fontSize: '24px',
                  cursor: 'pointer',
                  zIndex: 10
                }}
              >
                ‹
              </button>
              <button
                onClick={proximaImagem}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'rgba(0, 0, 0, 0.5)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  fontSize: '24px',
                  cursor: 'pointer',
                  zIndex: 10
                }}
              >
                ›
              </button>
            </>
          )}

          {/* Indicadores de imagem */}
          {imagens.length > 1 && (
            <div style={{
              position: 'absolute',
              bottom: '10px',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: '8px',
              zIndex: 10
            }}>
              {imagens.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setImagemAtual(index)}
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    border: 'none',
                    background: imagemAtual === index ? 'white' : 'rgba(255, 255, 255, 0.5)',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Miniaturas */}
        {imagens.length > 1 && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '10px',
            marginBottom: '20px',
            flexWrap: 'wrap'
          }}>
            {imagens.map((img, index) => (
              <SmartImage
                key={index}
                src={img}
                alt={`Miniatura ${index + 1}`}
                onClick={() => setImagemAtual(index)}
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '8px',
                  objectFit: 'cover',
                  cursor: 'pointer',
                  border: imagemAtual === index ? '3px solid #007bff' : '3px solid transparent',
                  transition: 'all 0.3s'
                }}
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

          {!jaAvaliou && !mostrarFormulario && (
            <button
              className="botao"
              onClick={() => setMostrarFormulario(true)}
              style={{ width: '90%', marginTop: '20px' }}
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