import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import '../styles.css'
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const CadastroProduto = () => {
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    preco: '',
    quantidade: '',
    area: 'animal',
    imagens: [],
  })

  const [preview, setPreview] = useState([])
  const [mensagem, setMensagem] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    setFormData((prev) => ({ ...prev, imagens: files }))

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

    if (!formData.nome || !formData.preco || !formData.quantidade) {
      setMensagem('Preencha todos os campos obrigatórios.')
      return
    }

    const data = new FormData()
    data.append('nome', formData.nome)
    data.append('descricao', formData.descricao)
    data.append('preco', formData.preco)
    data.append('quantidade', formData.quantidade)
    data.append('area', formData.area)
    formData.imagens.forEach((img) => data.append('imagens', img))

    try {
      const response = await fetch('http://localhost:8080/api/produtos', {
        method: 'POST',
        body: data,
      })

      if (response.ok) {
        setMensagem('Produto cadastrado com sucesso!')
        setFormData({
          nome: '',
          descricao: '',
          preco: '',
          quantidade: '',
          area: 'animal',
          imagens: [],
        })
        setPreview([])
      } else {
        setMensagem('Erro ao cadastrar produto.')
      }
    } catch (error) {
      console.error(error)
      setMensagem('Erro de conexão com o servidor.')
    }
  }

  return (
    <div className="pagina">
      <Navbar />

      <form id="cadastroProduto-form" onSubmit={handleSubmit}>
        <section id="titulo-cadastro" className="titulo-cadastro">
          <h1>Cadastro de Produtos</h1>
        </section>

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
            placeholder="Nome do produto"
            required
          />
        </div>

        <div className="campos-formulario">
          <input
            type="text"
            name="descricao"
            value={formData.descricao}
            onChange={handleChange}
            className="form-control"
            placeholder="Descrição"
          />
        </div>

        <div className="campos-formulario">
          <input
            type="number"
            name="preco"
            value={formData.preco}
            onChange={handleChange}
            step="0.01"
            min="0"
            className="form-control"
            placeholder="Preço"
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
            placeholder="Quantidade"
            required
          />
        </div>

        <div className="campos-formulario">
          <select
            name="area"
            value={formData.area}
            onChange={handleChange}
            className="form-control"
          >
            <option value="animal">Animais</option>
            <option value="comidas">Comidas</option>
            <option value="destaque">Destaque</option>
            <option value="mais-vendidos">Mais Vendidos</option>
            <option value="personagens">Personagens</option>
            <option value="personalizados">Personalizados</option>
            <option value="promocao">Promoções</option>
          </select>
        </div>

        <button type="submit" className="botao">
          Cadastrar
        </button>

        {mensagem && <p style={{ marginTop: '1rem' }}>{mensagem}</p>}
      </form>

      <Footer />
    </div>
  )
}

export default CadastroProduto
