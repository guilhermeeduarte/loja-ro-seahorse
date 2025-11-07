import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Whatsapp from '../components/Whatsapp'
import '../styles.css'
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.bundle.min.js"

export default function Devolucao() {
  const [pedido, setPedido] = useState("")
  const [motivo, setMotivo] = useState("")
  const [mensagem, setMensagem] = useState("")
  const [imagens, setImagens] = useState([])
  const [previews, setPreviews] = useState([])
  const [enviado, setEnviado] = useState(false)

  const handleImagensChange = (e) => {
    const files = Array.from(e.target.files)
    setImagens(files)
    const previewUrls = files.map(file => URL.createObjectURL(file))
    setPreviews(previewUrls)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Solicitação de devolução:", { pedido, motivo, mensagem, imagens })
    setEnviado(true)
  }

  return (
    <div className="pagina">
      <Navbar />

      <section className="container mt-5 mb-5">
        <h2 className="text-center mb-4">Solicitação de Devolução</h2>

        {enviado ? (
          <div className="alert alert-success text-center">
            Sua solicitação foi enviada com sucesso! Entraremos em contato em breve.
          </div>
        ) : (
          <form className="form-devolucao" onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="pedido" className="form-label">Número do Pedido</label>
              <input
                type="text"
                className="form-control"
                id="pedido"
                value={pedido}
                onChange={(e) => setPedido(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="motivo" className="form-label">Motivo da Devolução</label>
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
                <option value="Outro">Outro</option>
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="mensagem" className="form-label">Mensagem adicional (opcional)</label>
              <input
                className="form-control"
                id="mensagem"
                rows="4"
                value={mensagem}
                onChange={(e) => setMensagem(e.target.value)}
              ></input>
            </div>

            <div className="mb-3">
              <label htmlFor="imagens" className="form-label">Adicionar imagens do produto (opcional)</label>
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
            >
              Enviar Solicitação
            </button>

          </form>
        )}
      </section>

      <Whatsapp />
      <Footer />
    </div>
  )
}
