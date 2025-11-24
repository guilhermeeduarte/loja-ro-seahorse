import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_URL } from '../config/api';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles.css";

const PerfilFuncionario = () => {
  const [usuario, setUsuario] = useState(null);
  const [pedidosPendentes, setPedidosPendentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const carregarDados = async () => {
      setLoading(true);
      try {
        // Perfil do usuário (mesmo endpoint usado em outras páginas)
        const resUsuario = await fetch(`${API_URL}/usuario/perfil`, {
          credentials: "include",
        });
        if (resUsuario.ok) {
          const dados = await resUsuario.json();
          setUsuario(dados);
        }

        // Pedidos pendentes para processamento (endpoint genérico)
        // Ajuste o endpoint conforme a API real do backend.
        const resPedidos = await fetch(`${API_URL}/pedido/pendentes`, {
          credentials: "include",
        });
        if (resPedidos.ok) {
          const dadosPedidos = await resPedidos.json();
          setPedidosPendentes(dadosPedidos);
        } else {
          // se endpoint não existir, tenta um fallback conhecido
          const fallback = await fetch(`${API_URL}/pedido/meus-pedidos`, {
            credentials: "include",
          });
          if (fallback.ok) setPedidosPendentes(await fallback.json());
        }
      } catch (err) {
        console.error("Erro ao carregar dados do funcionário:", err);
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, []);

  const marcarComoProcessando = async (pedidoId) => {
    if (!window.confirm("Marcar pedido como em processamento?")) return;
    setActionLoading(true);
    try {
      const res = await fetch(`${API_URL}/pedido/${pedidoId}/processando`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Falha ao marcar pedido");

      setPedidosPendentes((prev) => prev.filter((p) => p.id !== pedidoId));
      alert("Pedido marcado como em processamento.");
    } catch (err) {
      console.error(err);
      alert("Erro ao atualizar pedido.");
    } finally {
      setActionLoading(false);
    }
  };

  const atualizarStatus = async (pedidoId, status) => {
    setActionLoading(true);
    try {
      const res = await fetch(`${API_URL}/pedido/${pedidoId}/status`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) throw new Error("Falha ao atualizar status");

      // atualizar localmente quando possível
      setPedidosPendentes((prev) =>
        prev.map((p) => (p.id === pedidoId ? { ...p, status } : p))
      );
      alert("Status atualizado.");
    } catch (err) {
      console.error(err);
      alert("Erro ao atualizar status do pedido.");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="pagina">
        <Navbar />
        <p className="carregando">Carregando perfil do funcionário...</p>
        <Footer />
      </div>
    );
  }

  return (
    <div className="pagina">
      <Navbar />

      <div className="secao">
        <h2 className="titulo">Bem-vindo, {usuario?.nome}!</h2>
        <p className="subtitulo"></p>
      </div>


      <div className="secao">
        <h3 className="subtitulo"></h3>
        <section className="botoes-container">
          <div className="botao-bloco">
            <h4>Gerenciar pedidos</h4>
          <Link to="/gerenciar-pedidos">
            <img
              src="/assets/imagens/pedidos.png"
              alt="Gerenciar pedidos"
              className="pedidos-icon"
              style={{
                width: '150px',
                padding: '20px',
                border: '5px solid #0057b7',
                borderRadius: '40px',
                marginLeft: '20px',
                marginTop: '10px',
                marginBottom: '20px'
              }}
              onMouseOver={(e) => e.target.style.border = '5px solid #f68650'}
              onMouseOut={(e) => e.target.style.border = '5px solid #0057b7'}
            />
        </Link>
        </div>

        <div className="botao-bloco">
          <h4>Editar meu perfil</h4>
          <Link to="/perfil_edicao">
            <img
              src="/assets/imagens/man.png"
              alt="Editar perfil"
              className="edicao"
            />
        </Link>
        </div>
        <div className="botao-bloco">
          <h4>Edição/Exclusão Produtos</h4>
          <Link to="/edicaoproduto">
            <img
              src="/assets/imagens/edicao.png"
              alt="Edição de produtos"
              className="edicao"
            />
          </Link>
        </div>

       <div className="botao-bloco">
        <h4>Cadastrar Produtos</h4>
          <Link to="/cadastroproduto">
            <img
              src="/assets/imagens/soma.png"
              alt="Cadastro de produtos"
              className="edicao"
            />
          </Link>
        </div>

        </section>
      </div>

      <Footer />
    </div>
  );
};

export default PerfilFuncionario;
