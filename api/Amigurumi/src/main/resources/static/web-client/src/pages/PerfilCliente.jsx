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
    carregarDados();
  }, []);

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

  if (loading) {
    return (
      <div className="pagina">
        <Navbar />
        <p style={{ textAlign: "center", marginTop: "50px" }}>Carregando perfil...</p>
        <Footer />
      </div>
    );
  }

  return (
    <div className="pagina">
      <Navbar />

      <div className="titulo-adm">
        <h2>Bem-vindo, {usuario?.nome || "Usuário"}!</h2>
      </div>

      {/* ✅ LISTA DE DESEJOS */}
      <h3 className="titulo-area">Lista de Desejos:</h3>
      <div className="cadastro-produto">
        {wishlistItems.length === 0 ? (
          <p style={{ textAlign: "center", padding: "20px" }}>Sua lista de desejos está vazia.</p>
        ) : (
          <div className="grid-fav">
            {wishlistItems.map((item) => (
              <div className="item" key={item.produtoId}>
                <Link to={`/produto/${item.produtoNome.toLowerCase().replace(/\s+/g, "-")}`}>
                  <SmartImage src="/assets/imagens/boneco.jpg" alt={item.produtoNome} />
                  <p>{item.produtoNome}</p>
                  <h6>R$ {item.produtoValor.toFixed(2).replace(".", ",")}</h6>
                </Link>
                <button 
                  className="btn-danger" 
                  style={{ marginTop: "10px" }}
                  onClick={() => removerDoDesejo(item.produtoId)}
                >
                  Remover
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <br />

      {/* ✅ PEDIDOS ANTERIORES */}
      <h3 className="titulo-area">Pedidos anteriores:</h3>
      {pedidos.length === 0 ? (
        <p style={{ textAlign: "center", padding: "20px" }}>Você ainda não fez nenhum pedido.</p>
      ) : (
        pedidos.slice(0, 3).map((pedido) => (
          <div
            key={pedido.id}
            style={{
              display: "flex",
              alignItems: "center",
              margin: "20px 0",
              borderBottom: "1px solid #ccc",
              paddingBottom: "15px"
            }}
          >
            <div style={{ marginLeft: "40px" }}>
              <h3 style={{ margin: 0, fontSize: "18px", color: "#333" }}>
                Pedido #{pedido.id}
              </h3>
              <p style={{ margin: "5px 0 0", fontSize: "16px", color: "#666" }}>
                Total: R$ {pedido.valorTotal.toFixed(2).replace(".", ",")}
              </p>
              <p style={{ fontSize: "14px", color: "#999" }}>
                Status: {pedido.status} | Data: {new Date(pedido.dataPedido).toLocaleDateString("pt-BR")}
              </p>
              <Link to={`/statuspedido?pedidoId=${pedido.id}`} style={{ textDecoration: "none" }}>
                Acompanhar status do pedido →
              </Link>
            </div>
          </div>
        ))
      )}

      <br />

      {/* EDIÇÃO DO PERFIL */}
      <h3 className="titulo-area">Edição do perfil:</h3>
      <div className="edicao-produto" style={{ marginBottom: "30px" }}>
        <Link to="/perfil_edicao">
          <img
            src="/Assets/Imagens/edicao.png"
            alt="Edição de perfil"
            className="edicao"
          />
        </Link>
      </div>

      <Footer />
    </div>
  );
};

export default PerfilCliente;