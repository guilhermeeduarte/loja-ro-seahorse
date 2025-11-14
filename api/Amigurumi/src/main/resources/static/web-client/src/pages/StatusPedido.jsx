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

  // ✅ Função para carregar o pedido
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

      // Se ainda está pendente, continua verificando
      if (data.status === 'PENDENTE') {
        console.log('⏳ Pedido ainda pendente, verificando novamente em 10s...');
      } else {
        console.log('✅ Status atualizado:', data.status);
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao carregar pedido");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Carrega o pedido ao montar o componente
  useEffect(() => {
    carregarPedido();
  }, [pedidoId]);

  // ✅ AUTO-REFRESH: Verifica o status a cada 10 segundos se ainda está PENDENTE
  useEffect(() => {
    if (!pedido) return;

    if (pedido.status === 'PENDENTE') {
      const interval = setInterval(() => {
        console.log('🔄 Verificando status do pagamento...');
        carregarPedido();
      }, 10000); // 10 segundos

      return () => clearInterval(interval);
    }
  }, [pedido]);

  const formatarData = (dataString) => {
    if (!dataString) return '—';
    const data = new Date(dataString);
    return data.toLocaleString('pt-BR');
  };

  if (loading) {
    return (
      <div className="pagina">
        <Navbar />
        <div style={{ textAlign: 'center', padding: '50px' }}>
          Carregando...
        </div>
        <Footer />
      </div>
    );
  }

  if (!pedido) {
    return (
      <div className="pagina">
        <Navbar />
        <div style={{ textAlign: 'center', padding: '50px' }}>
          Pedido não encontrado
        </div>
        <Footer />
      </div>
    );
  }

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
        {/* ✅ Alerta se ainda está pendente */}
        {pedido.status === 'PENDENTE' && (
          <div style={{
            background: '#fff3cd',
            border: '1px solid #ffc107',
            borderRadius: '8px',
            padding: '15px',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            <p style={{ margin: 0, fontWeight: 'bold' }}>
              ⏳ Aguardando confirmação do pagamento...
            </p>
            <p style={{ margin: '10px 0 0 0', fontSize: '14px', color: '#666' }}>
              Esta página será atualizada automaticamente quando o pagamento for confirmado.
            </p>
          </div>
        )}

        {/* ✅ Confirmação de pagamento */}
        {pedido.status === 'PAGO' && (
          <div style={{
            background: '#d4edda',
            border: '1px solid #28a745',
            borderRadius: '8px',
            padding: '15px',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            <p style={{ margin: 0, fontWeight: 'bold', color: '#155724' }}>
              ✅ Pagamento confirmado!
            </p>
            <p style={{ margin: '10px 0 0 0', fontSize: '14px', color: '#155724' }}>
              Seu pedido já está sendo preparado.
            </p>
          </div>
        )}

        <h3>Itens do Pedido:</h3>
        {pedido.itens.map((item, index) => (
          <div key={index} style={{
            marginBottom: '15px',
            borderBottom: '1px solid #ccc',
            paddingBottom: '10px'
          }}>
            <p><strong>{item.produtoNome}</strong></p>
            <p>
              Quantidade: {item.quantidade} |
              Preço: R$ {item.precoUnitario.toFixed(2).replace(".", ",")}
            </p>
          </div>
        ))}

        <p><strong>Total: R$ {(pedido.valorTotal + 24.2).toFixed(2).replace(".", ",")}</strong></p>
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