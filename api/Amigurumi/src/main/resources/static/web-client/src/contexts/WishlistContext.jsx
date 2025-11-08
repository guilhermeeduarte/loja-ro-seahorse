import React, { createContext, useState, useContext, useEffect } from "react";

const API_URL = "http://localhost:3000/api";
const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    carregarListaDesejo();
  }, []);

  const carregarListaDesejo = async () => {
    try {
      const response = await fetch(`${API_URL}/lista-desejo`, {
        credentials: "include"
      });

      if (response.ok) {
        const data = await response.json();
        setWishlistItems(data);
      }
    } catch (error) {
      console.error("Erro ao carregar lista de desejos:", error);
    }
  };

  const adicionarAoDesejo = async (produtoId) => {
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/lista-desejo/adicionar/${produtoId}`, {
        method: "POST",
        credentials: "include"
      });

      if (!response.ok) {
        const erro = await response.text();
        throw new Error(erro || "Você não está logado.");
      }

      await carregarListaDesejo();
    } catch (error) {
      console.error("Erro ao adicionar aos favoritos:", error);
      throw error; // Propaga o erro para o componente capturar
    } finally {
      setLoading(false);
    }
  };

  const removerDoDesejo = async (produtoId) => {
    try {
      const response = await fetch(`${API_URL}/lista-desejo/${produtoId}`, {
        method: "DELETE",
        credentials: "include"
      });

      if (response.ok) {
        await carregarListaDesejo();
      } else {
        const erro = await response.text();
        throw new Error(erro || "Erro ao remover dos favoritos.");
      }
    } catch (error) {
      console.error("Erro ao remover dos favoritos:", error);
      throw error;
    }
  };

  const verificarSeEstaNoDesejo = async (produtoId) => {
    try {
      const response = await fetch(`${API_URL}/lista-desejo/verificar/${produtoId}`, {
        credentials: "include"
      });

      if (response.ok) {
        const data = await response.json();
        return data.estaNoDesejo;
      }
      return false;
    } catch (error) {
      console.error("Erro ao verificar lista de desejos:", error);
      return false;
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        adicionarAoDesejo,
        removerDoDesejo,
        verificarSeEstaNoDesejo,
        recarregarDesejo: carregarListaDesejo,
        loading
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
