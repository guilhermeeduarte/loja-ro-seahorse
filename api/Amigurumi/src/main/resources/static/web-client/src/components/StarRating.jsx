import React from 'react';

// Componente para exibir estrelas (somente leitura)
export const StarDisplay = ({ rating, size = 20 }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span
        key={i}
        style={{
          color: i <= rating ? '#FFD700' : '#DDD',
          fontSize: `${size}px`,
          marginRight: '2px'
        }}
      >
        ★
      </span>
    );
  }
  return <span>{stars}</span>;
};

// Componente interativo para selecionar nota
export const StarRating = ({ rating, onRatingChange, size = 30 }) => {
  const [hover, setHover] = React.useState(0);

  return (
    <div style={{ display: 'flex', gap: '5px' }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onRatingChange(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: `${size}px`,
            color: (hover || rating) >= star ? '#FFD700' : '#DDD',
            padding: 0,
            transition: 'color 0.2s'
          }}
        >
          ★
        </button>
      ))}
    </div>
  );
};

export default { StarDisplay, StarRating };