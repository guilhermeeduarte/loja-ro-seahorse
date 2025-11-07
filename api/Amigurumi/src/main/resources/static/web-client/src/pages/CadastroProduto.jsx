import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import '../styles.css'

const API_URL = `http://localhost:3000/api`

const CadastroProduto = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    valor: '',
    quantidade: '',
    categoria: 'Animais',
  })

  const [imagemFile, setImagemFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [mensagem, setMensagem] = useState(null)
  const [loading, setLoading] = useState(false)


  useEffect(() => {
    const verificarPermissao = async () => {
      try {
        const response = await fetch(`${API_URL}/usuario/perfil`, {
          credentials: 'include'
        })

        if (!response.ok) {
          alert('Você precisa estar logado!')
          navigate('/login')
          return
        }

        const usuario = await response.json()


        if (usuario.tipoUsuario === 'CLIENTE') {
          alert('Você não tem permissão para acessar esta página!')
          navigate('/')
        }
      } catch (error) {
        console.error('Erro ao verificar permissão:', error)
        navigate('/login')
      }
    }

    verificarPermissao()
  }, [navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImagemFile(file)
      const reader = new FileReader()
      reader.onload = () => setPreview(reader.result)
      reader.readAsDataURL(file)
    }
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

    if (parseInt(formData.quantidade) < 0) {
      setMensagem('Quantidade não pode ser negativa.')
      setLoading(false)
      return
    }

    try {
      let imagemUrl = null


      if (imagemFile) {
        const formDataImagem = new FormData()
        formDataImagem.append('file', imagemFile)

        const uploadResponse = await fetch(`${API_URL}/imagem/upload`, {
          method: 'POST',
          credentials: 'include',
          body: formDataImagem
        })

        if (!uploadResponse.ok) {
          throw new Error('Erro ao fazer upload da imagem')
        }

        const uploadData = await uploadResponse.json()
        imagemUrl = uploadData.url
      }


      const produto = {
        nome: formData.nome,
        descricao: formData.descricao,
        valor: parseFloat(formData.valor),
        quantidade: parseInt(formData.quantidade),
        categoria: formData.categoria,
        imagemUrl: imagemUrl
      }

      const response = await fetch(`${API_URL}/produto`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(produto)
      })

      if (response.ok) {
        setMensagem('Produto cadastrado com sucesso!')

        // Limpa o formulário
        setFormData({
          nome: '',
          descricao: '',
          valor: '',
          quantidade: '',
          categoria: 'Animais',
        })
        setImagemFile(null)
        setPreview(null)

        setTimeout(() => {
          navigate('/')
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

        {/* ✅ Upload de imagem */}
        <div className="campos-formulario">
          <label htmlFor="imagem" style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
            Imagem do Produto *
          </label>
          <input
            type="file"
            name="imagem"
            id="imagem"
            className="form-control"
            accept="image/*"
            onChange={handleImageChange}
            required
          />
          {preview && (
            <div className="preview-container" style={{ marginTop: '15px' }}>
              <img src={preview} alt="Preview" style={{ maxWidth: '200px', borderRadius: '10px' }} />
            </div>
          )}
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