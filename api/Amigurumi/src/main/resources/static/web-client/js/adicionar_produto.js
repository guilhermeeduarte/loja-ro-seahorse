
  document.getElementById('addProductBtn').addEventListener('click', function() {
    // Seleciona a última grid
    const grids = document.querySelectorAll('.grid');
    const grid = grids[grids.length - 1];

    // Cria um produto(vaitomando)
    const div = document.createElement('div');
    div.className = 'item';
    div.innerHTML = `
      <img src="Assets/Imagens/boneco.jpg" alt="Novo Produto">
      <p>Novo Produto</p>
      <h6>R$ 99,90</h6>
      <button type="button" class="btn btn-success">Comprar</button>
    `;
    grid.appendChild(div);
  });
