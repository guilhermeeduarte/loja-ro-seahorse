import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import '../styles.css'
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.bundle.min.js"

const AddEndereco = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    cep: '',
    pais: 'Brasil',
    estado: '',
    cidade: '',
    rua: '',
    numero: '',
    complemento: '',
    observacoes: '',
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Verifica se há um carrinho ativo
    const valorTotal = sessionStorage.getItem("valorTotal")
    if (!valorTotal) {
      alert("Nenhum pedido em andamento!")
      navigate("/carrinho")
    }
  }, [navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCepBlur = async () => {
    const cepLimpo = formData.cep.replace(/\D/g, '')

    if (cepLimpo.length !== 8) {
      alert('CEP inválido. Digite 8 números.')
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`)
      const data = await response.json()

      if (data.erro) {
        alert('CEP não encontrado.')
      } else {
        setFormData((prev) => ({
          ...prev,
          pais: 'Brasil',
          estado: data.uf,
          cidade: data.localidade,
          rua: data.logradouro,
        }))
      }
    } catch (error) {
      alert('Erro ao buscar o CEP.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Valida campos obrigatórios
    if (!formData.cep || !formData.estado || !formData.cidade || !formData.rua || !formData.numero) {
      alert("Preencha todos os campos obrigatórios!")
      return
    }

    // Monta o endereço completo concatenado
    const enderecoCompleto = `${formData.rua}, ${formData.numero}${formData.complemento ? ' - ' + formData.complemento : ''} - ${formData.cidade}/${formData.estado}, CEP: ${formData.cep}${formData.observacoes ? ' | Obs: ' + formData.observacoes : ''}`

    // Salva no sessionStorage
    sessionStorage.setItem("enderecoEntrega", enderecoCompleto)

    // Redireciona para página de pagamento
    navigate("/processar-pagamento")
  }

  const handleReset = () => {
    setFormData({
      cep: '',
      pais: 'Brasil',
      estado: '',
      cidade: '',
      rua: '',
      numero: '',
      complemento: '',
      observacoes: '',
    })
  }

  return (
    <div className="pagina">
      <nav className="navbar carrinho">
        <div className="container-fluid">
          <a className="navbar-brand" href="/finalcompra">
            <span className="voltar">&lt;&lt;</span>
          </a>
          <h2>Endereço de Entrega</h2>
        </div>
      </nav>

      <form className="endereco" onSubmit={handleSubmit} onReset={handleReset}>
        <input
          type="text"
          name="cep"
          placeholder="CEP *"
          value={formData.cep}
          onChange={handleChange}
          onBlur={handleCepBlur}
          maxLength="9"
          required
        />
        <input
          type="text"
          name="pais"
          placeholder="País"
          value={formData.pais}
          readOnly
        />
        <input
          type="text"
          name="estado"
          placeholder="Estado *"
          value={formData.estado}
          onChange={handleChange}
          required
          disabled={loading}
        />
        <input
          type="text"
          name="cidade"
          placeholder="Cidade *"
          value={formData.cidade}
          onChange={handleChange}
          required
          disabled={loading}
        />
        <input
          type="text"
          name="rua"
          placeholder="Rua *"
          value={formData.rua}
          onChange={handleChange}
          required
          disabled={loading}
        />
        <input
          type="text"
          name="numero"
          placeholder="Número da casa *"
          value={formData.numero}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="complemento"
          placeholder="Complemento"
          value={formData.complemento}
          onChange={handleChange}
        />
        <textarea
          name="observacoes"
          placeholder="Observações"
          value={formData.observacoes}
          onChange={handleChange}
        />
        <div className="botao-endereco">
          <button className="botao" type="submit" disabled={loading}>
            {loading ? "Carregando..." : "Prosseguir para Pagamento"}
          </button>
          <button className="botao-limpar" type="reset">
            Limpar
          </button>
        </div>
      </form>

      <Footer />
    </div>
  )
}

export default AddEndereco