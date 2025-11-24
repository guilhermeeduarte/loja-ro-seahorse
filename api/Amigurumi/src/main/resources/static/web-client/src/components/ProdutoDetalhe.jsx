import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { API_URL } from '../config/api';
import { useCarrinho } from "../contexts/CartContext";
import { useWishlist } from "../contexts/WishlistContext";
import SmartImage from "./SmartImage";
import AvaliacaoForm from "./AvaliacaoForm";
import AvaliacoesList from "./AvaliacoesList";
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
  const [jaAvaliou, setJaAvaliou] = useState(false);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [refreshAvaliacoes, setRefreshAvaliacoes] = useState(0);
  const [imagemAtual, setImagemAtual] = useState(0);

  const [quantidade, setQuantidade] = useState(1);
  const [erroQuantidade, setErroQuantidade] = useState("");

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

  const aumentarQuantidade = () => {
    setErroQuantidade("");
    const estoqueDisponivel = produto.quantidade ?? produto.estoqueDisponivel ?? 1;
    if (quantidade < estoqueDisponivel) {
      setQuantidade(prev => prev + 1);
    } else {
      setErroQuantidade(`Estoque disponível: ${estoqueDisponivel} unidades`);
    }
  };

  const diminuirQuantidade = () => {
    setErroQuantidade("");
    if (quantidade > 1) {
      setQuantidade(prev => prev - 1);
    }
  };

  const handleQuantidadeChange = (e) => {
    setErroQuantidade("");
    const valor = parseInt(e.target.value) || 1;
    const estoqueDisponivel = produto.quantidade ?? produto.estoqueDisponivel ?? 1;

    if (valor < 1) {
      setQuantidade(1);
    } else if (valor > estoqueDisponivel) {
      setQuantidade(estoqueDisponivel);
      setErroQuantidade(`Estoque disponível: ${estoqueDisponivel} unidades`);
    } else {
      setQuantidade(valor);
    }
  };

  const handleAdicionar = async () => {
    setErroQuantidade("");
    const estoqueDisponivel = produto.quantidade ?? produto.estoqueDisponivel ?? 1;

    if (quantidade > estoqueDisponivel) {
      setErroQuantidade(`Apenas ${estoqueDisponivel} unidades disponíveis`);
      return;
    }

    if (quantidade < 1) {
      setErroQuantidade("Quantidade mínima: 1 unidade");
      return;
    }

    const produtoFormatado = {
      id: produto.id,
      nome: produto.nome,
      preco: typeof produto.preco === "string"
        ? produto.preco
        : produto.preco.toFixed(2).replace(".", ","),
      img: imagens[0],
      descricao: produto.descricao,
      quantidade: quantidade
    };

    try {
      await adicionarAoCarrinho(produtoFormatado);
      setQuantidade(1);
    } catch (error) {
      setErroQuantidade(error.message || "Erro ao adicionar ao carrinho");
    }
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

        <p style={{ color: '#666', fontSize: '14px', marginTop: '10px' }}>
          Estoque disponível: {produto.quantidade ?? produto.estoqueDisponivel ?? 0} unidades
        </p>

        <div className="quantidade-selector" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '15px',
          marginTop: '20px',
          marginBottom: '20px'
        }}>
          <button
            onClick={diminuirQuantidade}
            className="btn-quantidade"
            style={{
              width: '40px',
              height: '40px',
              fontSize: '24px',
              borderRadius: '50%',
              border: '2px solid #007bff',
              background: 'white',
              color: '#007bff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              transition: 'all 0.3s ease'
            }}
            disabled={quantidade <= 1}
            onMouseEnter={(e) => {
              if (quantidade > 1) {
                e.target.style.background = '#007bff';
                e.target.style.color = 'white';
              }
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'white';
              e.target.style.color = '#007bff';
            }}
          >
            −
          </button>

          <input
            type="number"
            value={quantidade}
            onChange={handleQuantidadeChange}
            min="1"
            max={produto.quantidade ?? produto.estoqueDisponivel ?? 1}
            style={{
              width: '80px',
              height: '40px',
              textAlign: 'center',
              fontSize: '18px',
              fontWeight: 'bold',
              border: '2px solid #ddd',
              borderRadius: '8px',
              padding: '5px'
            }}
          />

          <button
            onClick={aumentarQuantidade}
            className="btn-quantidade"
            style={{
              width: '40px',
              height: '40px',
              fontSize: '24px',
              borderRadius: '50%',
              border: '2px solid #007bff',
              background: 'white',
              color: '#007bff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              transition: 'all 0.3s ease'
            }}
            disabled={quantidade >= (produto.quantidade ?? produto.estoqueDisponivel ?? 1)}
            onMouseEnter={(e) => {
              if (quantidade < (produto.quantidade ?? produto.estoqueDisponivel ?? 1)) {
                e.target.style.background = '#007bff';
                e.target.style.color = 'white';
              }
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'white';
              e.target.style.color = '#007bff';
            }}
          >
            +
          </button>
        </div>

        {erroQuantidade && (
          <p style={{ color: 'red', marginBottom: '15px', fontWeight: 'bold' }}>
            {erroQuantidade}
          </p>
        )}

        <div className="produto-actions">
          <button
            className="btn-comprar-produto"
            onClick={handleAdicionar}
            disabled={carrinhoLoading || (produto.quantidade ?? produto.estoqueDisponivel ?? 0) < 1}
          >
            {carrinhoLoading
              ? "Adicionando..."
              : (produto.quantidade ?? produto.estoqueDisponivel ?? 0) < 1
                ? "Produto Indisponível"
                : `Adicionar ${quantidade === 1 ? 'item' : 'itens'} ao carrinho`
            }
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