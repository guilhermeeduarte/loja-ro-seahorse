import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SmartImage from "../components/SmartImage";
import { useWishlist } from "../contexts/WishlistContext";
import "../styles.css";

const API_URL = "http://localhost:3000/api";

const PerfilCliente = () => {
  const [usuario, setUsuario] = useState(null);
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const { wishlistItems, removerDoDesejo, recarregarDesejo } = useWishlist();

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const resUsuario = await fetch(`${API_URL}/usuario/perfil`, {
          credentials: "include"
        });
        if (resUsuario.ok) {
          const dadosUsuario = await resUsuario.json();
          setUsuario(dadosUsuario);
        }

        const resPedidos = await fetch(`${API_URL}/pedido/meus-pedidos`, {
          credentials: "include"
        });
        if (resPedidos.ok) {
          const dadosPedidos = await resPedidos.json();
          setPedidos(dadosPedidos);
        }

        await recarregarDesejo();
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, []);

  if (loading) {
    return (
      <div className="pagina">
        <Navbar />
        <p className="carregando">Carregando perfil...</p>
        <Footer />
      </div>
    );
  }

  return (
    <div className="pagina">
      <Navbar />

      {/* Boas-vindas */}
      <div className="secao">
        <h2 className="titulo">Bem-vindo, {usuario?.nome}!</h2>
      </div>

      {/* Lista de Desejos */}
      <div className="secao">
        <h3 className="subtitulo">Lista de Desejos:</h3>
        {wishlistItems.length === 0 ? (
          <p className="mensagem">Sua lista de desejos está vazia.</p>
        ) : (
          <div className="grid-fav">
            {wishlistItems.map((item) => (
              <div className="desejo" key={item.produtoId}>
                <Link to={`/produto/${item.produtoNome.toLowerCase().replace(/\s+/g, "-")}`}>
                  <SmartImage src={item.imagemUrl} alt={item.produtoNome} />
                  <p>{item.produtoNome}</p>
                  <h6>R$ {item.produtoValor.toFixed(2).replace(".", ",")}</h6>
                </Link>
                <button className="btn-danger" onClick={() => removerDoDesejo(item.produtoId)}>
                  Remover
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pedidos Anteriores */}
      <div className="secao">
        <h3 className="subtitulo">Pedidos anteriores:</h3>
        {pedidos.length === 0 ? (
          <p className="mensagem">Você ainda não fez nenhum pedido.</p>
        ) : (
          <div className="lista-pedidos">
            {pedidos.slice(0, 3).map((pedido) => (
              <div className="pedido" key={pedido.id}>
                <h4>Pedido #{pedido.id}</h4>
                <p>Total: R$ {pedido.valorTotal.toFixed(2).replace(".", ",")}</p>
                <p>Status: {pedido.status} | Data: {new Date(pedido.dataPedido).toLocaleDateString("pt-BR")}</p>
                <Link to={`/statuspedido?pedidoId=${pedido.id}`}>Acompanhar status →</Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Botões lado a lado */}
      <div className="secao">
        <section className="botoes-container">
          {/* Edição de Perfil */}
          <div className="botao-bloco">
            <h3 className="titulo-area">Editar Perfil:</h3>
            <Link to="/perfil_edicao">
              <img
                src="/Assets/Imagens/edicao.png"
                alt="Edição de perfil"
                className="edicao"
              />
            </Link>
          </div>

          {/* Devolução */}
          <div className="botao-bloco">
            <h3 className="titulo-area">Devolução:</h3>
            <Link to="/devolucao">
              <img
                src="/Assets/Imagens/devolucao.png"
                width="150px"
                alt="devolução"
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

export default PerfilCliente;
