import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import '../styles.css'

const Pagamentos = () => {
  return (
    <div className="pagina">

      <nav className="navbar carrinho">
        <div className="container-fluid">
          <a className="navbar-brand" href="/carrinho">
            <span className="voltar">&lt;&lt;</span>
          </a>

          <h2>Métodos de Pagamento</h2>

          <a className="navbar-brand" href="/pagamentos" id="pagamentos">
            <img
              id="carrinho"
              src="../assets/Imagens/Vector.svg"
              width="50px"
              height="60px"
              alt="carrinho"
            />
          </a>
        </div>
      </nav>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <ul className="metodos">
        <li>
          <img src="../assets/Imagens/pix.png" alt="Pix" />
          <span>Pix</span>
        </li>
        <li>
          <img src="../assets/Imagens/boleto.png" alt="Boleto" />
          <span>Boleto</span>
        </li>
        <li>
          <img src="../assets/Imagens/cartao.png" alt="Cartão de Crédito" />
          <span>Cartão de Crédito</span>
        </li>
        <li>
          <img src="../assets/Imagens/cartao.png" alt="Cartão de Débito" />
          <span>Cartão de Débito</span>
        </li>
      </ul>

  

      <Footer />
    </div>
  )
}

export default Pagamentos
