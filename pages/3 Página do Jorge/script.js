document.getElementById('buscar').addEventListener('click', async () => {
    const nome = document.getElementById('pokemon').value.toLowerCase();
    const info = document.getElementById('info');
  
    try {
      const resposta = await fetch(`https://pokeapi.co/api/v2/pokemon/${nome}`);
      if (!resposta.ok) throw new Error();
  
      const dados = await resposta.json();
      const habilidades = dados.abilities.map(a => a.ability.name).join(', ');
      const stats = dados.stats.map(s => `<li>${s.stat.name.toUpperCase()}: ${s.base_stat}</li>`).join('');
  
      info.innerHTML = `
        <h2>${dados.name.toUpperCase()}</h2>
        <img src="${dados.sprites.front_default}" alt="${dados.name}" />
        <p><strong>Altura:</strong> ${dados.height}</p>
        <p><strong>Peso:</strong> ${dados.weight}</p>
        <p><strong>Tipo(s):</strong> ${dados.types.map(t => t.type.name).join(', ')}</p>
        <p><strong>Habilidades:</strong> ${habilidades}</p>
        <h3>Estatísticas</h3>
        <ul>${stats}</ul>
      `;
    } catch (error) {
      info.innerHTML = '<p>Pokémon não encontrado. Tente outro nome!</p>';
    }
  });