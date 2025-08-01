async function carregarPokemons() {
    const resposta = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1000');
    const dados = await resposta.json();
    const pokemons = dados.results.sort((a, b) => a.name.localeCompare(b.name));
  
    const grupos = {};
    pokemons.forEach(p => {
      const letra = p.name[0].toUpperCase();
      if (!grupos[letra]) grupos[letra] = [];
      grupos[letra].push(p);
    });
  
    const tabs = document.getElementById('poke-tabs');
    const content = document.getElementById('poke-content');
    const searchInput = document.getElementById('poke-search');
  
    Object.keys(grupos).sort().forEach(letra => {
      const botao = document.createElement('button');
      botao.textContent = letra;
      botao.className = 'poke-tab-btn';
      botao.onclick = () => {
        content.innerHTML = `<h2 class="poke-letra-titulo">Categoria ${letra}</h2>`;
        const grid = document.createElement('div');
        grid.className = 'poke-grid';
  
        grupos[letra].forEach(async (pokemon) => {
          const detalhes = await fetch(pokemon.url).then(res => res.json());
          const imagem = detalhes.sprites.front_default;
  
          const item = document.createElement('div');
          item.className = 'poke-item';
          item.setAttribute('data-name', pokemon.name.toLowerCase());
          item.innerHTML = `
            <img src="${imagem}" alt="${pokemon.name}" class="imagem-baixo">
            <span class="poke-nome">${pokemon.name}</span>
          `;
          grid.appendChild(item);
        });
  
        content.appendChild(grid);
  
        // Filtro de busca por nome
        searchInput.oninput = () => {
          const termo = searchInput.value.toLowerCase();
          const itens = grid.querySelectorAll('.poke-item');
          itens.forEach(item => {
            const nome = item.getAttribute('data-name');
            item.style.display = nome.includes(termo) ? 'block' : 'none';
          });
        };
      };
      tabs.appendChild(botao);
    });
  }
  
  carregarPokemons();
  