// web-client/src/pages/StatusPedido.jsx
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles.css';

const API_URL = "http://localhost:3000/api";

const StatusEtapa = ({ titulo, horario, ativo }) => (
  <div className={`status ${ativo ? 'active' : ''}`}>
    <div className="status-text">
      <h4>{titulo}</h4>
      <p>{horario || '—'}</p>
    </div>
  </div>
);

const StatusPedido = () => {
  const [searchParams] = useSearchParams();
  const pedidoId = searchParams.get('pedidoId');
  const [pedido, setPedido] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarPedido = async () => {
      if (!pedidoId) {
        alert("ID do pedido não encontrado!");
        return;
      }

      try {
        const response = await fetch(`${API_URL}/pedido/${pedidoId}`, {
          credentials: "include"
        });

        if (!response.ok) {
          throw new Error("Erro ao carregar pedido");
        }

        const data = await response.json();
        setPedido(data);
      } catch (error) {
        console.error("Erro:", error);
        alert("Erro ao carregar pedido");
      } finally {
        setLoading(false);
      }
    };

    carregarPedido();
  }, [pedidoId]);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Carregando...</div>;
  }

  if (!pedido) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Pedido não encontrado</div>;
  }

  const formatarData = (dataString) => {
    if (!dataString) return '—';
    const data = new Date(dataString);
    return data.toLocaleString('pt-BR');
  };

  return (
    <div className="pagina">

      <nav className="navbar carrinho">
        <div className="container-fluid">
          <a className="navbar-brand" href="/perfil">
            <span className="voltar">&#x276E;&#x276E;</span>
          </a>
          <h2>Status do Pedido #{pedido.id}</h2>
        </div>
      </nav>

      <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
        <h3>Itens do Pedido:</h3>
        {pedido.itens.map((item, index) => (
          <div key={index} style={{ marginBottom: '15px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
            <p><strong>{item.produtoNome}</strong></p>
            <p>Quantidade: {item.quantidade} | Preço: R$ {item.precoUnitario.toFixed(2).replace(".", ",")}</p>
          </div>
        ))}
        <p><strong>Total: R$ {pedido.valorTotal.toFixed(2).replace(".", ",")}</strong></p>
        <p><strong>Forma de Pagamento:</strong> {pedido.formaPagamento}</p>
        <p><strong>Endereço:</strong> {pedido.enderecoEntrega}</p>
      </div>

      <div className="timeline-wrapper">
        <div className="timeline">
          <StatusEtapa 
            titulo="Pedido feito" 
            horario={formatarData(pedido.dataPedido)} 
            ativo 
          />
          <StatusEtapa 
            titulo="Pedido pago" 
            horario={formatarData(pedido.dataPagamento)} 
            ativo={pedido.status !== 'PENDENTE'} 
          />
          <StatusEtapa 
            titulo="Em preparo" 
            horario="" 
            ativo={pedido.status === 'EM_PREPARO' || pedido.status === 'ENVIADO' || pedido.status === 'ENTREGUE'} 
          />
          <StatusEtapa 
            titulo="Enviado" 
            horario={formatarData(pedido.dataEnvio)} 
            ativo={pedido.status === 'ENVIADO' || pedido.status === 'ENTREGUE'} 
          />
          <StatusEtapa 
            titulo="Entregue" 
            horario={formatarData(pedido.dataEntrega)} 
            ativo={pedido.status === 'ENTREGUE'} 
          />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default StatusPedido;