import React, { useState, useEffect } from 'react'
import { API_URL } from '../config/api'
import { useNavigate, Link } from 'react-router-dom'
import Footer from '../components/Footer'
import '../styles.css'

const AddEndereco = () => {
  const navigate = useNavigate()
  const [enderecosExistentes, setEnderecosExistentes] = useState([])
  const [mostrarForm, setMostrarForm] = useState(false)
  const [enderecoSelecionado, setEnderecoSelecionado] = useState(null)
  const [formData, setFormData] = useState({
    apelido: '',
    cep: '',
    pais: 'Brasil',
    estado: '',
    cidade: '',
    bairro: '',
    rua: '',
    numero: '',
    complemento: '',
    observacoes: '',
    principal: false
  })
  const [loading, setLoading] = useState(false)

  // ✅ Carrega endereços existentes
  useEffect(() => {
    const verificarPedido = async () => {
      const valorTotal = sessionStorage.getItem("valorTotal")
      if (!valorTotal) {
        alert("Nenhum pedido em andamento!")
        navigate("/carrinho")
        return
      }

      // Carrega endereços do usuário
      await carregarEnderecos()
    }

    verificarPedido()
  }, [navigate])

  const carregarEnderecos = async () => {
    try {
      const response = await fetch(`${API_URL}/endereco`, {
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        setEnderecosExistentes(data)

        // Se tiver endereço principal, seleciona automaticamente
        const principal = data.find(e => e.principal)
        if (principal) {
          setEnderecoSelecionado(principal.id)
        }
      }
    } catch (error) {
      console.error('Erro ao carregar endereços:', error)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const buscarCep = async () => {
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
          estado: data.uf,
          cidade: data.localidade,
          bairro: data.bairro || '',
          rua: data.logradouro || ''
        }))
      }
    } catch (error) {
      alert('Erro ao buscar o CEP.')
    } finally {
      setLoading(false)
    }
  }

  // ✅ Prosseguir com endereço selecionado
  const prosseguirComEnderecoExistente = () => {
    if (!enderecoSelecionado) {
      alert("Selecione um endereço!")
      return
    }

    const endereco = enderecosExistentes.find(e => e.id === enderecoSelecionado)
    if (endereco) {
      sessionStorage.setItem("enderecoEntrega", endereco.enderecoCompleto)
      navigate("/processar-pagamento")
    }
  }

  // ✅ Cadastrar novo endereço
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.cep || !formData.estado || !formData.cidade || !formData.rua || !formData.numero) {
      alert("Preencha todos os campos obrigatórios!")
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/endereco`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        const erro = await response.text()
        throw new Error(erro)
      }

      const novoEndereco = await response.json()
      alert('✅ Endereço cadastrado com sucesso!')

      // Salva o endereço recém-criado
      const enderecoCompleto = `${formData.rua}, ${formData.numero}${formData.complemento ? ' - ' + formData.complemento : ''} - ${formData.cidade}/${formData.estado}, CEP: ${formData.cep}${formData.observacoes ? ' | Obs: ' + formData.observacoes : ''}`

      sessionStorage.setItem("enderecoEntrega", enderecoCompleto)
      navigate("/processar-pagamento")

    } catch (error) {
      console.error('Erro:', error)
      alert(`Erro: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setFormData({
      apelido: '',
      cep: '',
      pais: 'Brasil',
      estado: '',
      cidade: '',
      bairro: '',
      rua: '',
      numero: '',
      complemento: '',
      observacoes: '',
      principal: false
    })
  }

  return (
    <div className="pagina">
      <nav className="navbar carrinho">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/finalcompra">
            <span className="voltar">&lt;&lt;</span>
          </Link>
          <h2>Endereço de Entrega</h2>
        </div>
      </nav>

      <div className="endereco-container">
        {/* ✅ Lista de endereços existentes */}
        {enderecosExistentes.length > 0 && (
          <div className="enderecos-existentes">
            <h3>Selecione um endereço existente:</h3>
            {enderecosExistentes.map((endereco) => (
              <div
                key={endereco.id}
                className={`endereco-card ${enderecoSelecionado === endereco.id ? 'selecionado' : ''}`}
                onClick={() => setEnderecoSelecionado(endereco.id)}
              >
                <input
                  type="radio"
                  name="endereco"
                  value={endereco.id}
                  checked={enderecoSelecionado === endereco.id}
                  onChange={() => setEnderecoSelecionado(endereco.id)}
                />
                <div className="endereco-info">
                  <strong>{endereco.apelido}</strong>
                  {endereco.principal && <span className="badge-principal">Principal</span>}
                  <p>{endereco.enderecoCompleto}</p>
                </div>
              </div>
            ))}

            <button className="botao" onClick={prosseguirComEnderecoExistente}>
              Usar este endereço
            </button>

            <div className="divider">
              <span>OU</span>
            </div>

            <button className="botao-secundario" onClick={() => setMostrarForm(true)}>
              + Cadastrar novo endereço
            </button>
          </div>
        )}

        {/* ✅ Formulário de novo endereço */}
        {(enderecosExistentes.length === 0 || mostrarForm) && (
          <form className="endereco" onSubmit={handleSubmit} onReset={handleReset}>
            <h3>Novo Endereço</h3>

            <input
              type="text"
              name="apelido"
              placeholder="Apelido (ex: Casa, Trabalho) *"
              value={formData.apelido}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="cep"
              placeholder="CEP *"
              value={formData.cep}
              onChange={handleChange}
              onBlur={buscarCep}
              maxLength="9"
              required
            />
            <input
              type="text"
              name="estado"
              placeholder="Estado (UF) *"
              value={formData.estado}
              onChange={handleChange}
              maxLength="2"
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
              name="bairro"
              placeholder="Bairro"
              value={formData.bairro}
              onChange={handleChange}
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
              placeholder="Número *"
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
              placeholder="Observações (ponto de referência...)"
              value={formData.observacoes}
              onChange={handleChange}
            />

            <label className="checkbox-label">
              <input
                type="checkbox"
                name="principal"
                checked={formData.principal}
                onChange={handleChange}
              />
              Definir como endereço principal
            </label>

            <div className="botao-endereco">
              <button className="botao" type="submit" disabled={loading}>
                {loading ? "Salvando..." : "Salvar e Continuar"}
              </button>
              {mostrarForm && (
                <button
                  className="botao-limpar"
                  type="button"
                  onClick={() => setMostrarForm(false)}
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        )}

        {/* Link para gerenciar endereços */}
        <div className="gerenciar-link">
          <Link to="/gerenciar-enderecos">Gerenciar meus endereços</Link>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default AddEndereco