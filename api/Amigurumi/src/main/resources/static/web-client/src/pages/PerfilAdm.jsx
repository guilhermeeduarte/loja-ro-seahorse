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
        </div>
 <div className="testediv2">
    <h3 className="titulo-area">Cadastro de produtos:</h3>
    <h3 className="titulo-area">Edição/Exclusão de produtos:</h3>
   <h3 className="titulo-area">Gerenciar Funcionários:</h3>
   </div>

      <section className="HENRIQUE">

        <div className="cadastro-produto">
          <Link to="/cadastroproduto">
            <img
              src="/assets/imagens/soma.png"
              alt="Cadastro de produtos"
              className="soma"
            />
          </Link>
        </div>


        <div className="edicao-produto">
             <div className="botoes-adm">
          <Link to="/edicaoproduto">
            <img
              src="/assets/imagens/edicao.png"
              alt="Edição de produtos"
              className="edicao"
            />
          </Link>
             </div>
        </div>


        <div className="ger-fun">
          <Link to="/gerenciar_funcionarios">
            <img
              src="/assets/imagens/ger-fun.png"
              alt="Gerenciar Funcionários"
              className="excluir"
            />
          </Link>
        </div>
   </section>

    <div className="testediv">
   <h3 className="titulo-area">Gerenciar Pedidos:</h3>   <h3 className="subtitulo">Editar meu perfil:</h3>  
    </div>
 <section className="HENRIQUE2">
        {/* ✅ NOVO: Gerenciamento de Pedidos */}

        <div className="corinthians">
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

        {/* Editar perfil */}

        <div className="corinthians2">
          <Link to="/perfil_edicao">
            <img
              src="/assets/imagens/man.png"
              alt="Editar perfil"
              className="edicao"
            />
          </Link>
        </div>

      </section>

      <Footer />
    </div>
  );
};

export default PerfilAdm;
