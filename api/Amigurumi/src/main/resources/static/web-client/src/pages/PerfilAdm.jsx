import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import '../styles.css' // se quiser manter os estilos separados

const AdminDashboard = () => {
  return (
    <div className="pagina">
      <Navbar />

      <div className="titulo-adm">
        <h2>Bem vindo, administrador(a)!</h2>
      </div>

      <section>
        <h3 className="titulo-area">Cadastro de produtos:</h3>
        <div className="cadastro-produto">
          <a href="/cadastroproduto">
            <img
              src="/Assets/Imagens/soma.png"
              alt="Cadastro de produtos"
              className="soma"
            />
          </a>
        </div>

        <h3 className="titulo-area">Edição de produtos:</h3>
        <div className="edicao-produto">
          <a href="/edicaoproduto">
            <img
              src="/Assets/Imagens/edicao.png"
              alt="Edição de produtos"
              className="edicao"
            />
          </a>
        </div>

        <h3 className="titulo-area">Exclusão de produtos:</h3>
        <div className="exclusao-produto">
          <a href="/exclusaoproduto">
            <img
              src="/Assets/Imagens/excluir.png"
              alt="Exclusão de produtos"
              className="excluir"
            />
          </a>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default AdminDashboard
