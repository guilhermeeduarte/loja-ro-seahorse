import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import "../styles.css";

        const API_URL = 'https://loja-ro-seahorse.onrender.com/api';

const Carrinho = () => {
  const [cartItems, setCartItems] = useState([]);
  const [valorTotal, setValorTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    carregarCarrinho();
  }, []);

  const carregarCarrinho = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/carrinho`, {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setCartItems(data.itens);
        setValorTotal(data.valorTotal);
      } else if (response.status === 401) {
        alert('Você precisa estar logado para ver o carrinho');
        navigate('/login');
      }
    } catch (error) {
      console.error('Erro ao carregar carrinho:', error);
    } finally {
      setLoading(false);
    }
  };

  const removerDoCarrinho = async (itemId) => {
    try {
      const response = await fetch(`${API_URL}/carrinho/${itemId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        alert('Item removido do carrinho');
        carregarCarrinho(); // Recarrega o carrinho
      }
    } catch (error) {
      console.error('Erro ao remover item:', error);
    }
  };

  const atualizarQuantidade = async (itemId, novaQuantidade) => {
    if (