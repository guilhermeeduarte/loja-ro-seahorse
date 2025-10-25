import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles.css";

const API_URL = 'https://loja-ro-seahorse.onrender.com/api';

const ProdutoPage = () => {
  const { produtoNome } = useParams();
  const navigate = useNavigate();
  const [produto, setProduto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantidade, setQuantidade] = useState(1);

  useEffect(() => {
    buscarProduto();
  }, [produtoNome]);

  const buscarProduto = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/produto/buscar?termo=${encodeURIComponent(produtoNome)}`,
        {
          credentials: 'include'
        }
      );

      if (response.ok) {
        const produtos = await response.json();
        if (produtos.length > 0) {
          setProduto(produtos[0]);
        } else {
          alert('Produto não encontrado');
          navigate('/');
        }
      }
    } catch (error) {
      console.error('Erro ao buscar produto:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdicionarCarrinho = async () => {
    if (!produto) return;

    try {
      const response = await fetch(`${API_URL}/carrinho/adicionar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          produtoId: produto.id,
          quantidade: quantidade
        })
      });

      if (response.ok) {
        alert('Produto adicionado ao carrinho!');
        navigate('/carrinho');
      } else {
        const erro = await response.text();
        if (erro.includes('Não autenticado') || erro.includes('Token inválido')) {
          alert('Você precisa estar logado para adicionar produtos ao carrinho');
          navigate('/login');
        } else {
          alert(erro);
        }
      }
    } catch (error) {
      console.error('Erro ao adicionar ao carrinho:', error);
      alert('Erro ao adicionar produto ao carrinho');
    }
  };

  if (loading) {
    return (
      <div className="pagina">
        <Navbar />
        <p style={{ textAlign: 'center', padding: '50px' }}>Carregando produto...</p>
        <Footer />
      </div>
    );
  }

  if (!produto) {
    return (
      <div className="pagina">
        <Navbar />
        <p style={{ textAlign: 'center', padding: '50px' }}>Produto não encontrado</p>
        <Footer />
      </div>
    );
  }

  return (
    <div className="pagina">
      <Navbar />

      <div className="produto">
        <img
          className="Pinguim"
          src="/Assets/Imagens/boneco.jpg"
          alt={produto.nome}
        />
        <h2>{produto.nome}</h2>
        <h3>R$ {Number(produto.valor).toFixed(2)}</h3>

        <div style={{ margin: '20px 0' }}>
          <p>Estoque disponível: {produto.quantidade} unidades</p>
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '15px',
          margin: '20px 0'
        }}>
          <button
            onClick={() => setQuantidade(Math.max(1, quantidade - 1))}
            style={{
              width: '40px',
              height: '40px',
              fontSize: '20px',
              background: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            -
          </button>
          <span style={{ fontSize: '20px', fontWeight: 'bold', minWidth: '40px', textAlign: 'center' }}>
            {quantidade}
          </span>
          <button
            onClick={() => setQuantidade(Math.min(produto.quantidade, quantidade + 1))}
            style={{
              width: '40px',
              height: '40px',
              fontSize: '20px',
              background: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            +
          </button>
        </div>

        <button
          className="btn-comprar-produto"
          onClick={handleAdicionarCarrinho}
          disabled={produto.quantidade === 0}
          style={{
            opacity: produto.quantidade === 0 ? 0.5 : 1,
            cursor: produto.quantidade === 0 ? 'not-allowed' : 'pointer'
          }}
        >
          {produto.quantidade === 0 ? 'Fora de Estoque' : 'Adicionar ao Carrinho'}
        </button>
      </div>

      <div className="descricao">
        <h2 style={{ fontWeight: "bold" }}>Descrição</h2>
        <p>{produto.descricao || 'Amigurumi feito à mão com muito carinho!'}</p>

        <h2 style={{ fontWeight: "bold" }}>Detalhes do Produto</h2>
        <p><strong>Categoria:</strong> {produto.categoria}</p>
        <p><strong>Código:</strong> #{produto.id}</p>
        <p><strong>Material:</strong> Linha 100% algodão</p>
        <p><strong>Cuidados:</strong> Lavar à mão com água fria</p>
      </div>

      <Footer />
    </div>
  );
};

export default ProdutoPage;