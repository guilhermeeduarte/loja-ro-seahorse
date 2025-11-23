import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Whatsapp from '../components/Whatsapp'
import { API_URL } from '../config/api'
import '../styles.css'
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.bundle.min.js"

export default function Devolucao() {
  const [pedidoId, setPedidoId] = useState("")
  const [motivo, setMotivo] = useState("")
  const [mensagem, setMensagem] = useState("")
  const [imagens, setImagens] = useState([])
  const [previews, setPreviews] = useState([])
  const [enviado, setEnviado] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleImagensChange = (e) => {
    const files = Array.from(e.target.files)

    // Limita a 5 imagens
    if (files.length > 5) {
      alert("Você pode enviar no máximo 5 imagens")
      return
    }

    setImagens(files)
    const previewUrls = files.map(file => URL.createObjectURL(file))
    setPreviews(previewUrls)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    if (!pedidoId || !motivo) {
      alert("Preencha o número do pedido e o motivo da devolução")
      setLoading(false)
      return
    }

    try {
      const formData = new FormData()
      formData.append('pedidoId', pedidoId)
      formData.append('motivo', motivo)
      if (mensagem) formData.append('descricao', mensagem)

      // Adiciona as imagens
      imagens.forEach((imagem) => {
        formData.append('imagens', imagem)
      })

      const response = await fetch(`${API_URL}/devolucao`, {
        method: 'POST',
        credentials: 'include',
        body: formData
      })

      if (!response.ok) {
        const erro = await response.text()
        throw new Error(erro)
      }

      setEnviado(true)
      alert("✅ Solicitação de devolução enviada com sucesso!")

      // Limpa o formulário
      setPedidoId("")
      setMotivo("")
      setMensagem("")
      setImagens([])
      setPreviews([])

    } catch (error) {
      console.error("Erro ao enviar devolução:", error)
      alert(`Erro: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="pagina">
      <Navbar />

      <section className="container mt-5 mb-5">
        <h2 className="text-center mb-4">Solicitação de Devolução</h2>

        {enviado ? (
          <div className="alert alert-success text-center">
            ✅ Sua solicitação foi enviada com sucesso!
            <br />
            Entraremos em contato em breve através do e-mail cadastrado.
            <br />
            <button
              className="botao mt-3"
              onClick={() => setEnviado(false)}
            >
              Fazer nova solicitação
            </button>
          </div>
        ) : (
          <form className="form-devolucao" onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="pedido" className="form-label">
                Número do Pedido *
              </label>
              <input
                type="number"
                className="form-control"
                id="pedido"
                value={pedidoId}
                onChange={(e) => setPedidoId(e.target.value)}
                placeholder="Ex: 123"
                required
              />
              <small className="text-muted">
                Você pode encontrar o número do pedido na página "Meus Pedidos"
              </small>
            </div>

            <div className="mb-3">
              <label htmlFor="motivo" className="form-label">
                Motivo da Devolução *
              </label>
              <select
                className="form-select campo-estilizado"
                id="motivo"
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                required
              >
                <option value="">Selecione...</option>
                <option value="Produto com defeito">Produto com defeito</option>
                <option value="Produto diferente do pedido">Produto diferente do pedido</option>
                <option value="Desistência da compra">Desistência da compra</option>
                <option value="Produto danificado no transporte">Produto danificado no transporte</option>
                <option value="Outro">Outro</option>
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="mensagem" className="form-label">
                Mensagem adicional (opcional)
              </label>
              <textarea
                className="form-control"
                id="mensagem"
                rows="4"
                value={mensagem}
                onChange={(e) => setMensagem(e.target.value)}
                placeholder="Descreva o problema ou forneça mais detalhes..."
              />
            </div>

            <div className="mb-3">
              <label htmlFor="imagens" className="form-label">
                Adicionar imagens do produto (opcional - máximo 5)
              </label>
              <input
                type="file"
                className="form-control"
                id="imagens"
                accept="image/*"
                multiple
                onChange={handleImagensChange}
              />
              {previews.length > 0 && (
                <div className="mt-3 text-center">
                  <p>Pré-visualizações:</p>
                  <div className="d-flex flex-wrap justify-content-center gap-3">
                    {previews.map((src, index) => (
                      <img
                        key={index}
                        src={src}
                        alt={`Pré-visualização ${index + 1}`}
                        className="img-thumbnail"
                        style={{ maxHeight: '150px' }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100"
              style={{ borderRadius: "20px", height: "50px", marginTop: "30px" }}
              disabled={loading}
            >
              {loading ? "Enviando..." : "Enviar Solicitação"}
            </button>
          </form>
        )}

        <div className="mt-4 p-3" style={{ background: '#f8f9fa', borderRadius: '10px' }}>
          <h5>📋 Política de Devolução</h5>
          <ul>
            <li>O prazo para solicitar devolução é de até 7 dias após o recebimento</li>
            <li>O produto deve estar em perfeito estado, sem sinais de uso</li>
            <li>Produtos personalizados não podem ser devolvidos</li>
            <li>As despesas de frete para devolução são de responsabilidade do cliente</li>
            <li>O reembolso será processado em até 7 dias úteis após a aprovação</li>
          </ul>
        </div>
      </section>

      <Whatsapp />
      <Footer />
    </div>
  )
}