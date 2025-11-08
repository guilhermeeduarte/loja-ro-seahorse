import React, { useState } from 'react';
import { StarRating } from './StarRating';

const API_URL = 'http://localhost:3000/api';

const AvaliacaoForm = ({ produtoId, onAvaliacaoEnviada }) => {
  const [nota, setNota] = useState(0);
  const [comentario, setComentario] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');

    if (nota === 0) {
      setErro('Por favor, selecione uma nota');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/avaliacao`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          produtoId,
          nota,
          comentario: comentario.trim()
        })
      });

      if (!response.ok) {
        const erro = await response.text();
        throw new Error(erro);
      }

      alert('✅ Avaliação enviada com sucesso!');
      setNota(0);
      setComentario('');

      if (onAvaliacaoEnviada) {
        onAvaliacaoEnviada();
      }
    } catch (error) {
      console.error('Erro ao enviar avaliação:', error);
      setErro(error.message || 'Erro ao enviar avaliação');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{
      background: '#fff',
      width: '100%',
      padding: '20px',
      borderRadius: '10px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      marginTop: '20px'
    }}>
      <h3 style={{ marginBottom: '15px' }}>Avaliar Produto</h3>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
          Sua nota:
        </label>
        <StarRating rating={nota} onRatingChange={setNota} />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
          Comentário (opcional):
        </label>
        <textarea
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          maxLength={1000}
          rows={4}
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '8px',
            border: '1px solid #ddd',
            fontFamily: 'Poppins, sans-serif',
            resize: 'vertical'
          }}
          placeholder="Compartilhe sua experiência com o produto..."
        />
        <small style={{ color: '#666' }}>
          {comentario.length}/1000 caracteres
        </small>
      </div>

      {erro && (
        <p style={{ color: 'red', marginBottom: '10px' }}>
          {erro}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="botao"
        style={{
          width: '90%',
          padding: '12px',
          opacity: loading ? 0.6 : 1,
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? 'Enviando...' : 'Enviar Avaliação'}
      </button>
    </form>
  );
};

export default AvaliacaoForm;