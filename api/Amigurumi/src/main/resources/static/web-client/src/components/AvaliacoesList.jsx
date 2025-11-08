import React, { useState, useEffect } from 'react';
import { StarDisplay } from './StarRating';

const API_URL = 'http://localhost:3000/api';

const AvaliacoesList = ({ produtoId, refresh }) => {
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [totalAvaliacoes, setTotalAvaliacoes] = useState(0);
  const [mediaNotas, setMediaNotas] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarAvaliacoes();
  }, [produtoId, refresh]);

  const carregarAvaliacoes = async () => {
    try {
      const response = await fetch(`${API_URL}/avaliacao/produto/${produtoId}`);

      if (!response.ok) {
        throw new Error('Erro ao carregar avaliações');
      }

      const data = await response.json();
      setAvaliacoes(data.avaliacoes);
      setTotalAvaliacoes(data.totalAvaliacoes);
      setMediaNotas(data.mediaNotas);
    } catch (error) {
      console.error('Erro ao carregar avaliações:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatarData = (dataString) => {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (loading) {
    return <p style={{ textAlign: 'center' }}>Carregando avaliações...</p>;
  }

  return (
    <div style={{ marginTop: '30px' }}>
      {/* Resumo de Avaliações */}
      <div style={{
        background: '#f8f9fa',
        padding: '20px',
        borderRadius: '10px',
        marginBottom: '20px',
        textAlign: 'center'
      }}>
        <h3>Avaliações dos Clientes</h3>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginTop: '10px' }}>
          <StarDisplay rating={Math.round(mediaNotas)} size={30} />
          <span style={{ fontSize: '24px', fontWeight: 'bold' }}>
            {mediaNotas.toFixed(1)}
          </span>
          <span style={{ color: '#666' }}>
            ({totalAvaliacoes} {totalAvaliacoes === 1 ? 'avaliação' : 'avaliações'})
          </span>
        </div>
      </div>

      {/* Lista de Avaliações */}
      {avaliacoes.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
          Seja o primeiro a avaliar este produto!
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {avaliacoes.map((avaliacao) => (
            <div
              key={avaliacao.id}
              style={{
                background: '#fff',
                padding: '15px',
                borderRadius: '8px',
                boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
                border: '1px solid #eee'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <div>
                  <strong style={{ fontSize: '16px' }}>{avaliacao.usuarioNome}</strong>
                  <div style={{ marginTop: '5px' }}>
                    <StarDisplay rating={avaliacao.nota} size={18} />
                  </div>
                </div>
                <span style={{ color: '#999', fontSize: '14px' }}>
                  {formatarData(avaliacao.dataAvaliacao)}
                </span>
              </div>

              {avaliacao.comentario && (
                <p style={{
                  margin: '10px 0 0 0',
                  color: '#333',
                  lineHeight: '1.5',
                  fontSize: '15px'
                }}>
                  {avaliacao.comentario}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AvaliacoesList;