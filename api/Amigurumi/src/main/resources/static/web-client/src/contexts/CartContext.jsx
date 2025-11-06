// web-client/src/contexts/CartContext.jsx
import React, { createContext, useState, useContext, useEffect } from "react";

const API_URL = "http://localhost:3000/api";
const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Carregar carrinho do backend ao montar
  useEffect(() => {
    carregarCarrinhoDoBackend();
  }, []);

  const carregarCarrinhoDoBackend = async () => {
    try {
      const response = await fetch(`${API_URL}/carrinho`, {
        credentials: "include"
      });

      if (response.ok) {
        const data = await response.json();
        // Mapeia itens do backend para o formato do Context
        const itensFormatados = data.itens.map(item => ({
          id: item.produtoId,
          nome: item.produtoNome,
          preco: item.precoUnitario.toFixed(2).replace(".", ","),
          img: `/assets/imagens/boneco.jpg`, // ou buscar do produto
          quantidade: item.quantidade
        }));
        setCartItems(itensFormatados);
      }
    } catch (error) {
      console.error("Erro ao carregar carrinho:", error);
    }
  };

  // ✅ ATUALIZADO: Adicionar ao carrinho E enviar para backend
  const adicionarAoCarrinho = async (produto) => {
    setLoading(true);
    try {
      // 1️⃣ Envia para o backend
      const response = await fetch(`${API_URL}/carrinho/adicionar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          produtoId: produto.id,
          quantidade: 1,
          precoUnitario: typeof produto.preco === 'string' 
            ? parseFloat(produto.preco.replace(",", "."))
            : parseFloat(produto.preco)
        })
      });

      if (!response.ok) {
        const erro = await response.text();
        throw new Error(erro);
      }

      // 2️⃣ Adiciona no Context local
      setCartItems((prev) => [...prev, produto]);
      alert("✅ Produto adicionado ao carrinho!");

    } catch (error) {
      console.error("Erro ao adicionar ao carrinho:", error);
      alert(`Erro: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // ✅ ATUALIZADO: Remover do carrinho E do backend
  const removerDoCarrinho = async (itemId) => {
    try {
      const response = await fetch(`${API_URL}/carrinho/${itemId}`, {
        method: "DELETE",
        credentials: "include"
      });

      if (response.ok) {
        setCartItems((prev) => prev.filter(item => item.id !== itemId));
        alert("Produto removido do carrinho!");
      }
    } catch (error) {
      console.error("Erro ao remover do carrinho:", error);
      alert("Erro ao remover produto");
    }
  };

  // ✅ Limpar carrinho (local e backend)
  const limparCarrinho = async () => {
    try {
      await fetch(`${API_URL}/carrinho/limpar`, {
        method: "DELETE",
        credentials: "include"
      });
      setCartItems([]);
    } catch (error) {
      console.error("Erro ao limpar carrinho:", error);
    }
  };

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      adicionarAoCarrinho, 
      removerDoCarrinho,
      limparCarrinho,
      loading,
      recarregarCarrinho: carregarCarrinhoDoBackend
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCarrinho = () => useContext(CartContext);