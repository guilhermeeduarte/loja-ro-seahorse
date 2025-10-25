import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Footer from '../components/Footer'
import '../styles.css'

const API_URL = const API_URL = 'https://loja-ro-seahorse.onrender.com/api';

const ItemResumo = ({ nome, preco, quantidade, subtotal }) => (
  <li>
    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', padding: '10px 20px' }}>
      <div>
        <span className="produto" style={{ fontSize: '20px', fontWeight: 'bold' }}>
          {nome}
        </span>
        <p style={{ fontSize: '14px', color: '#666', margin: '5px 0' }}>
          Quantidade: {quantidade} x R$ {Number(preco).toFixed(2)}
        </p>
      </div>
      <span className="preco" style={{ fontSize: '18px', fontWeight: 'bold', color: '#007bff' }}>
        R$ {Number(subtotal).toFixed(2)}
      </span>
    </div>
  </li>
)

const FinalizacaoCompra = () => {
  const [itens, setItens] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [enderecoEntrega, setEnderecoEntrega] = useState('')
  const [formaPagamento, setFormaPagamento] = useState('PIX')
  const [processando, setProcessando] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    carregarCarrinho()
    carregarDadosUsuario()
  }, [])

  const carregarCarrinho = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_URL}/carrinho`, {
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        setItens(data.itens)
        setTotal(data.valorTotal)
      } else if (response.status === 401) {
        alert('Você precisa estar logado')
        navigate('/login')
      }
    } catch (error) {
      console.error('Erro ao carregar carrinho:', error)
      alert('Erro ao carregar carrinho')
    } finally {
      setLoading(false)
    }
  }

  const carregarDadosUsuario = async () => {
    try {
      const response = await fetch(`${API_URL}/usuario/perfil`, {
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        setEnderecoEntrega(data.endereco || '')
      }
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error)
    }
  }

  const finalizarCompra = async () => {
    if (!enderecoEntrega.trim()) {
      alert('Por favor, informe o endereço de entrega')
      return
    }

    if (!formaPagamento) {
      alert('Por favor, selecione uma forma de pagamento')
      return
    }

    if (itens.length === 0) {
      alert('Seu carrinho está vazio')
      return
    }

    setProcessando(true)

    try {
      const response = await fetch(`${API_URL}/pedido/finalizar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          enderecoEntrega,
          formaPagamento
        })
      })

      if (response.ok) {
        const data = await response.json()
        alert(`Pedido #${data.pedidoId} realizado com sucesso! Total: R$ ${Number(data.valorTotal).toFixed(2)}`)
        navigate('/statuspedido')
      } else {
        const erro = await response.text()
        alert('Erro ao finalizar pedido: ' + erro)
      }
    } catch (error) {
      console.error('Erro ao finalizar compra:', error)
      alert('Erro ao processar pedido. Tente novamente.')
    } finally {
      setProcessando(false)
    }
  }

  if (loading) {
    return (
      <div className="pagina">
        <nav className="navbar carrinho">
          <div className="container-fluid">
            <Link to="/carrinho" className="navbar-brand">
              <span className="voltar">&lt;&lt;</span>
            </Link>
            <h2>Finalizar Compra</h2>
            <Link to="/pagamentos" className="navbar-brand" id="pagamentos">
              <img
                id="carrinho"
                src="../assets/Imagens/Vector.svg"
                width="50px"
                height="60px"
                alt="carrinho"
              />
            </Link>
          </div>
        </nav>
        <p style={{ textAlign: 'center', marginTop: '50px' }}>Carregando...</p>
        <Footer />
      </div>
    )
  }

  return (
    <div className="pagina">
      <nav className="navbar carrinho">
        <div className="container-fluid">
          <Link to="/carrinho" className="navbar-brand">
            <span className="voltar">&lt;&lt;</span>
          </Link>
          <h2>Finalizar Compra</h2>
          <Link to="/pagamentos" className="navbar-brand" id="pagamentos">
            <img
              id="carrinho"
              src="../assets/Imagens/Vector.svg"
              width="50px"
              height="60px"
              alt="carrinho"
            />
          </Link>
        </div>
      </nav>

      <section id="titulo-cadastro" className="titulo-cadastro">
        <h1>Resumo da Compra</h1>
      </section>

      {itens.length === 0 ? (
        <div style={{ textAlign: 'center', margin: '50px' }}>
          <p>Seu carrinho está vazio</p>
          <Link to="/" className="botao">Voltar para Home</Link>
        </div>
      ) : (
        <>
          <ul className="carrinhos">
            {itens.map((item) => (
              <ItemResumo
                key={item.id}
                nome={item.produtoNome}
                preco={item.precoUnitario}
                quantidade={item.quantidade}
                subtotal={item.subtotal}
              />
            ))}
          </ul>

          <div className="total">
            <span style={{ marginLeft: '20px', fontSize: '20px' }}>Total:</span>
            <span className="valor-total">R$ {Number(total).toFixed(2)}</span>
          </div>

          <div style={{
            maxWidth: '600px',
            margin: '30px auto',
            padding: '20px',
            background: 'white',
            borderRadius: '10px'
          }}>
            <h3 style={{ marginBottom: '20px' }}>Dados de Entrega</h3>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Endereço de Entrega:
              </label>
              <textarea
                value={enderecoEntrega}
                onChange={(e) => setEnderecoEntrega(e.target.value)}
                placeholder="Digite o endereço completo"
                style={{
                  width: '100%',
                  minHeight: '80px',
                  padding: '10px',
                  borderRadius: '5px',
                  border: '1px solid #ccc',
                  fontSize: '16px'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Forma de Pagamento:
              </label>
              <select
                value={formaPagamento}
                onChange={(e) => setFormaPagamento(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '5px',
                  border: '1px solid #ccc',
                  fontSize: '16px'
                }}
              >
                <option value="PIX">PIX</option>
                <option value="CREDITO">Cartão de Crédito</option>
                <option value="DEBITO">Cartão de Débito</option>
                <option value="BOLETO">Boleto</option>
              </select>
            </div>
          </div>

          <button
            className="botao"
            style={{
              display: 'block',
              margin: '0 auto',
              marginTop: '20px',
              marginBottom: '40px',
              opacity: processando ? 0.6 : 1,
              cursor: processando ? 'not-allowed' : 'pointer'
            }}
            onClick={finalizarCompra}
            disabled={processando}
          >
            {processando ? 'Processando...' : 'Confirmar Pedido'}
          </button>
        </>
      )}

      <Footer />
    </div>
  )
}

export default FinalizacaoCompra