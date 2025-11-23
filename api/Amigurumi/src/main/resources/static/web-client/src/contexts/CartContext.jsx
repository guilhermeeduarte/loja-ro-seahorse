import React, { createContext, useState, useContext, useEffect } from "react";
import { API_URL } from '../config/api';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

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
        const itensFormatados = data.itens.map(item => ({
          id: item.id,
          produtoId: item.produtoId,
          nome: item.produtoNome,
          preco: item.precoUnitario.toFixed(2).replace(".", ","),
          img: item.imagemUrl || `/assets/imagens/boneco.jpg`,
          quantidade: item.quantidade
        }));
        setCartItems(itensFormatados);
      }
    } catch (error) {
      console.error("Erro ao carregar carrinho:", error);
    }
  };

  const adicionarAoCarrinho = async (produto) => {
    setLoading(true);
    try {
      const quantidadeParaAdicionar = produto.quantidade || 1;

      const response = await fetch(`${API_URL}/carrinho/adicionar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          produtoId: produto.id,
          quantidade: quantidadeParaAdicionar,
          precoUnitario: typeof produto.preco === 'string'
            ? parseFloat(produto.preco.replace(",", "."))
            : parseFloat(produto.preco)
        })
      });

      if (!response.ok) {
        const erro = await response.text();
        throw new Error(erro);
      }

      // Recarrega o carrinho do backend para obter dados atualizados
      await carregarCarrinhoDoBackend();

      alert(`✅ ${quantidadeParaAdicionar} ${quantidadeParaAdicionar === 1 ? 'unidade adicionada' : 'unidades adicionadas'} ao carrinho!`);

    } catch (error) {
      console.error("Erro ao adicionar ao carrinho:", error);
      alert(`Erro: ${error.message}`);
      throw error; // Propaga erro para o componente tratar
    } finally {
      setLoading(false);
    }
  };

  const atualizarQuantidade = async (itemId, novaQuantidade) => {
    try {
      const response = await fetch(`${API_URL}/carrinho/${itemId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ quantidade: novaQuantidade })
      });

      if (!response.ok) {
        const erro = await response.text();
        throw new Error(erro);
      }

      // Atualiza localmente
      setCartItems(prev =>
        prev.map(item =>
          item.id === itemId
            ? { ...item, quantidade: novaQuantidade }
            : item
        )
      );

      return true;
    } catch (error) {
      console.error("Erro ao atualizar quantidade:", error);
      alert(`Erro: ${error.message}`);
      return false;
    }
  };

  const removerDoCarrinho = async (itemId) => {
    try {
      const response = await fetch(`${API_URL}/carrinho/${itemId}`, {
        method: "DELETE",
        credentials: "include"
      });

      if (response.ok) {
        setCartItems((prev) => prev.filter(item => item.id !== itemId));
        alert("Produto removido do carrinho!");
      } else {
        const erro = await response.text();
        throw new Error(erro);
      }
    } catch (error) {
      console.error("Erro ao remover do carrinho:", error);
      alert("Erro ao remover produto");
    }
  };

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
      atualizarQuantidade,
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