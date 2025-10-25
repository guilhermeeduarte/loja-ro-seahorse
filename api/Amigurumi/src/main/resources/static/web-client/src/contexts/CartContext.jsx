import React, { createContext, useState, useContext } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const adicionarAoCarrinho = (produto) => {
    setCartItems((prev) => [...prev, produto]);
    alert("Produto adicionado ao carrinho!");
  };

  const removerDoCarrinho = (nome) => {
    setCartItems((prev) => prev.filter((item) => item.nome !== nome));
  };

  return (
    <CartContext.Provider value={{ cartItems, adicionarAoCarrinho, removerDoCarrinho }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCarrinho = () => useContext(CartContext);
