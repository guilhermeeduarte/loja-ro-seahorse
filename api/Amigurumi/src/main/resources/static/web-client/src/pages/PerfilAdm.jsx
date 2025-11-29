import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { API_URL } from '../config/api'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import '../styles.css'

const PerfilAdm = () => {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const carregarUsuario = async () => {
      try {
        const res = await fetch(`${API_URL}/usuario/perfil`, {
          credentials: "include"
        });
        if (res.ok) {
          const dados = await res.json();
          setUsuario(dados);
        } else {
          console.error("Erro ao buscar usuário:", res.status);
        }
      } catch (error) {
        console.error("Erro ao carregar usuário:", error);
      }
    };

    carregarUsuario();
  }, []);

  return (
    <div className="pagina">
      <Navbar />
          <div className="secao">
            <h2 className="titulo">Bem-vindo, {usuario?.nome}!</h2>

            {/* Grid de ações administrativas: cada card tem imagem + legenda */}
            <section className="admin-grid">
              <div className="admin-card">
                <Link to="/cadastroproduto">
                  <img src="/assets/imagens/soma.png" alt="Cadastro de produtos" className="admin-icon" />
                </Link>
                <h3 className="titulo-area">Cadastro de produtos</h3>
              </div>

              <div className="admin-card">
                <Link to="/edicaoproduto">
                  <img src="/assets/imagens/edicao.png" alt="Edição de produtos" className="admin-icon" />
                </Link>
                <h3 className="titulo-area">Edição / Exclusão de produtos</h3>
              </div>

              <div className="admin-card">
                <Link to="/gerenciar_funcionarios">
                  <img src="/assets/imagens/ger-fun.png" alt="Gerenciar Funcionários" className="admin-icon" />
                </Link>
                <h3 className="titulo-area">Gerenciar Funcionários</h3>
              </div>
            </section>

        {/* removed duplicate headings - captions are inside each card now */}

        <section className="admin-grid admin-grid--two"> 
        {/* ✅ NOVO: Gerenciamento de Pedidos */}

          <div className="admin-card">
            <Link to="/gerenciar-pedidos">
              <img src="/assets/imagens/pedidos.png" alt="Gerenciar pedidos" className="admin-icon admin-icon--bordered" />
            </Link>
            <h3 className="titulo-area">Gerenciar Pedidos</h3>
          </div>

          {/* Editar perfil */}

          <div className="admin-card">
            <Link to="/perfil_edicao">
              <img src="/assets/imagens/man.png" alt="Editar perfil" className="admin-icon" />
            </Link>
            <h3 className="titulo-area">Editar meu perfil</h3>
          </div>

        </section>
    </div>
        <Footer />
      </div>
 
  );
};

export default PerfilAdm;
