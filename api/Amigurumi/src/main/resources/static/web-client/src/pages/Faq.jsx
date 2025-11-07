import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Footer from "../components/Footer.jsx";

export default function Faq() {
  useEffect(() => {
    document.title = "RO SeaHorse - FAQ";
  }, []);

  return (
    <div className="pagina">
      <nav className="navbar principal">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/" id="logo-minimalista">
            <img
              id="logo-minimalista"
              src="Assets/Imagens/logo_minimalista.png"
              width="101"
              height="101"
              alt="logo-minimalista"
            />
          </Link>
          <Link className="navbar-brand" to="/login" id="perfil">
            <img
              id="perfil"
              src="Assets/Imagens/perfil.png"
              width="60"
              height="60"
              alt="perfil"
            />
          </Link>
          <Link className="navbar-brand" to="/carrinho" id="carrinho">
            <img
              id="carrinho"
              src="Assets/Imagens/carrinho.png"
              width="50"
              height="60"
              alt="carrinho"
            />
          </Link>
        </div>
      </nav>

      <section id="titulo-cadastro" className="titulo-cadastro">
        <h1>
          FAQ
          <br />
          Dúvidas Frequentes
        </h1>
      </section>

      <div className="accordion" id="accordionExample">
        {/* Pergunta 1 */}
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button
              className="accordion-button"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseOne"
              aria-expanded="true"
              aria-controls="collapseOne"
            >
              <strong>Vocês fazem amigurumi's personalizados?</strong>
            </button>
          </h2>

          <div
            id="collapseOne"
            className="accordion-collapse collapse show"
            data-bs-parent="#accordionExample"
          >
            <div className="accordion-body">
              Sim, fazemos amigurumis personalizados! 🧵 Para solicitar o seu ou
              conversar sobre detalhes do pedido, entre em contato conosco pelo
              WhatsApp.
            </div>
          </div>
        </div>

        {/* Pergunta 2 */}
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button
              className="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseTwo"
              aria-expanded="false"
              aria-controls="collapseTwo"
            >
              <strong>Quais são os métodos de pagamento?</strong>
            </button>
          </h2>

          <div
            id="collapseTwo"
            className="accordion-collapse collapse"
            data-bs-parent="#accordionExample"
          >
            <div className="accordion-body">
              Aceitamos PIX, boleto e cartões de crédito/débito.
            </div>
          </div>
        </div>

        {/* Pergunta 3 */}
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button
              className="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseThree"
              aria-expanded="false"
              aria-controls="collapseThree"
            >
              <strong>Como posso me contatar com vocês?</strong>
            </button>
          </h2>

          <div
            id="collapseThree"
            className="accordion-collapse collapse"
            data-bs-parent="#accordionExample"
          >
            <div className="accordion-body">
              Você pode falar com a gente pelo nosso e-mail ou pelo nosso
              WhatsApp.
            </div>
          </div>
        </div>

        {/* Pergunta 4 */}
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button
              className="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseFour"
              aria-expanded="false"
              aria-controls="collapseFour"
            >
              <strong>Posso pedir pela devolução da minha compra?</strong>
            </button>
          </h2>

          <div
            id="collapseFour"
            className="accordion-collapse collapse"
            data-bs-parent="#accordionExample"
          >
            <div className="accordion-body">
              O cliente pode solicitar a devolução do produto em até 7 dias
              úteis contados a partir da data de entrega. As despesas de frete
              para devolução são de responsabilidade do cliente. Para o pedido,
              fale com a gente pelos nossos meios de comunicação (WhatsApp ou
              e-mail).
            </div>
          </div>
        </div>
      </div>

     <Footer />
    </div>
  );
}
