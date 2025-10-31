import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import '../styles.css'
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

// Componente para cada etapa do pedido
const StatusEtapa = ({ titulo, horario, ativo }) => (
  <div className={`status ${ativo ? 'active' : ''}`}>
    <div className="status-text">
      <h4>{titulo}</h4>
      <p>{horario || '—'}</p>
    </div>
  </div>
)

// Componente para o produto exibido
const ProdutoResumo = () => (
  <div className="produto">
    <img src="../assets/Imagens/Coelho.jpeg" alt="Produto" />
    <div className="produto-info">
      <h3 style={{ fontSize: '40px' }}>Coelho</h3>
      <p style={{ fontSize: '20px' }}>Seção: Animais | Quantidade: 1</p>
    </div>
  </div>
)

const StatusPedido = () => {
  return (
    <div className="pagina">
      <Navbar tipo="carrinho" />

      <nav className="navbar carrinho">
        <div className="container-fluid">
          <a className="navbar-brand" href="/home">
            <span className="voltar">&lt;&lt;</span>
          </a>

          <h2>Status do pedido</h2>

          <a className="navbar-brand" href="/perfilcliente" id="perfil-cliente">
            <span className="material-icons" style={{ fontSize: '50px' }}>person</span>
          </a>
        </div>
      </nav>

      <ProdutoResumo />

      <div className="timeline-wrapper">
        <div className="timeline">
          <StatusEtapa titulo="Pedido feito" horario="23/10/2025 - 13:45" ativo />
          <StatusEtapa titulo="Pedido pago" horario="23/10/2025 - 14:00" ativo />
          <StatusEtapa titulo="Pedido em preparo" horario="23/10/2025 - 14:15" ativo />
          <StatusEtapa titulo="Pedido enviado" horario="" ativo={false} />
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default StatusPedido
