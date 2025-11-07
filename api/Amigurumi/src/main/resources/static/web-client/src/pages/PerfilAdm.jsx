import React from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import '../styles.css'

const PerfilAdm = () => {
  return (
    <div className="pagina">
      <Navbar />

      <div className="titulo-adm">
        <h2>Bem vindo, administrador(a)!</h2>
      </div>

      <section>
        <h3 className="titulo-area">Cadastro de produtos:</h3>
        <div className="cadastro-produto">
          <Link to="/cadastroproduto">
            <img
              src="/Assets/Imagens/soma.png"
              alt="Cadastro de produtos"
              className="soma"
            />
          </Link>
        </div>

        <h3 className="titulo-area">Edição de produtos:</h3>
        <div className="edicao-produto">
          <Link to="/edicaoproduto">
            <img
              src="/Assets/Imagens/edicao.png"
              alt="Edição de produtos"
              className="edicao"
            />
          </Link>
        </div>

        <h3 className="titulo-area">Exclusão de produtos:</h3>
        <div className="exclusao-produto">
          <Link to="/exclusaoprodutos">
            <img
              src="/Assets/Imagens/excluir.png"
              alt="Exclusão de produtos"
              className="excluir"
            />
          </Link>
        </div>

        {/* ✅ NOVO: Gerenciamento de Pedidos */}
        <h3 className="titulo-area">Gerenciar Pedidos:</h3>
        <div className="gerenciar-pedidos">
          <Link to="/gerenciar-pedidos">
            <img
              src="/Assets/Imagens/pedidos.png"
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
      </section>

      <Footer />
    </div>
  )
}

export default PerfilAdm