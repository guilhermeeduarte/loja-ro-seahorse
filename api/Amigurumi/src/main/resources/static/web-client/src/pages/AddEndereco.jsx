import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import '../styles.css'
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";


const EnderecoForm = () => {
  const [formData, setFormData] = useState({
    cep: '',
    pais: '',
    estado: '',
    cidade: '',
    rua: '',
    numero: '',
    complemento: '',
    observacoes: '',
  })

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
    }
  }

  const handleObservacoesResize = (e) => {
    e.target.style.height = 'auto'
    e.target.style.height = `${e.target.scrollHeight}px`
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Dados enviados:', formData)
    alert('Endereço salvo com sucesso!')
  }

  const handleReset = () => {
    setFormData({
      cep: '',
      pais: '',
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


      <nav className="navbar carrinho" height="150px">
        <div className="container-fluid">
          <a className="navbar-brand" href="/carrinho">
            <span className="voltar">&lt;&lt;</span>
          </a>
          <h2>Seu Carrinho</h2>
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

      <form className="endereco" onSubmit={handleSubmit} onReset={handleReset}>
        <input
          type="text"
          name="cep"
          placeholder="CEP"
          value={formData.cep}
          onChange={handleChange}
          onBlur={handleCepBlur}
          required
        />
        <input
          type="text"
          name="pais"
          placeholder="País"
          value={formData.pais}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="estado"
          placeholder="Estado"
          value={formData.estado}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="cidade"
          placeholder="Cidade"
          value={formData.cidade}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="rua"
          placeholder="Rua"
          value={formData.rua}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="numero"
          placeholder="Número da casa"
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
          onInput={handleObservacoesResize}
        />
        <div class="botao-endereco">
        <button className="botao" type="submit">
          Salvar
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

export default EnderecoForm
