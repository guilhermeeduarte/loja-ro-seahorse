import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import '../styles.css'
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.bundle.min.js"

const API_URL = `http://localhost:3000/api`;

const CadastroProduto = () => {
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    valor: '',
    quantidade: '',
    categoria: 'Animais',
  })

  const [preview, setPreview] = useState([])
  const [mensagem, setMensagem] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)

    const readers = files.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result)
        reader.readAsDataURL(file)
      })
    })

    Promise.all(readers).then((results) => setPreview(results))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMensagem(null)

    if (!formData.nome || !formData.valor || !formData.quantidade) {
      setMensagem('Preencha todos os campos obrigatórios.')
      setLoading(false)
      return
    }

    // Validação: quantidade deve ser >= 0
    if (parseInt(formData.quantidade) < 0) {
      setMensagem('Quantidade não pode ser negativa.')
      setLoading(false)
      return
    }

    try {
      const produto = {
        nome: formData.nome,
        descricao: formData.descricao,
        valor: parseFloat(formData.valor),
        quantidade: parseInt(formData.quantidade),
        categoria: formData.categoria
      }

      console.log('Enviando produto:', produto)

      const response = await fetch(`${API_URL}/produto`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(produto)
      })

      if (response.ok) {
        const produtoCadastrado = await response.json()
        console.log('Produto cadastrado:', produtoCadastrado)

        setMensagem('✅ Produto cadastrado com sucesso!')

        // Limpa o formulário
        setFormData({
          nome: '',
          descricao: '',
          valor: '',
          quantidade: '',
          categoria: 'Animais',
        })
        setPreview([])

        // Redireciona para home após 2 segundos
        setTimeout(() => {
          window.location.href = '/'
        }, 2000)
      } else {
        const erro = await response.text()
        setMensagem(`Erro ao cadastrar produto: ${erro}`)
      }
    } catch (error) {
      console.error('Erro:', error)
      setMensagem('Erro de conexão com o servidor.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="pagina">
      <Navbar />

      <form id="cadastroProduto-form" onSubmit={handleSubmit}>
        <section id="titulo-cadastro" className="titulo-cadastro">
          <h1>Cadastro de Produtos</h1>
        </section>

        {/* Preview de imagens (decorativo por enquanto) */}
        <div className="campos-formulario">
          <input
            type="file"
            name="imagem"
            id="imagem"
            className="form-control"
            accept="image/*"
            multiple
            onChange={handleImageChange}
          />
          <div className="preview-container">
            {preview.map((src, index) => (
              <img key={index} src={src} alt={`preview-${index}`} />
            ))}
          </div>
        </div>

        <div className="campos-formulario">
          <input
            type="text"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            className="form-control"
            placeholder="Nome do produto *"
            required
          />
        </div>

        <div className="campos-formulario">
          <textarea
            name="descricao"
            value={formData.descricao}
            onChange={handleChange}
            className="form-control"
            placeholder="Descrição"
            rows="3"
          />
        </div>

        <div className="campos-formulario">
          <input
            type="number"
            name="valor"
            value={formData.valor}
            onChange={handleChange}
            step="0.01"
            min="0"
            className="form-control"
            placeholder="Preço (R$) *"
            required
          />
        </div>

        <div className="campos-formulario">
          <input
            type="number"
            name="quantidade"
            value={formData.quantidade}
            onChange={handleChange}
            step="1"
            min="0"
            className="form-control"
            placeholder="Quantidade em estoque *"
            required
          />
        </div>

        <div className="campos-formulario">
          <select
            name="categoria"
            value={formData.categoria}
            onChange={handleChange}
            className="form-control"
          >
            <option value="Animais">Animais</option>
            <option value="Comidas">Comidas</option>
            <option value="Destaque">Destaque</option>
            <option value="Mais vendidos">Mais Vendidos</option>
            <option value="Personagens">Personagens</option>
          </select>
        </div>

        <button type="submit" className="botao" disabled={loading}>
          {loading ? 'Cadastrando...' : 'Cadastrar Produto'}
        </button>

        {mensagem && (
          <p style={{
            marginTop: '1rem',
            textAlign: 'center',
            color: mensagem.includes('✅') ? 'green' : 'red',
            fontWeight: 'bold'
          }}>
            {mensagem}
          </p>
        )}
      </form>

      <Footer />
    </div>
  )
}

export default CadastroProduto