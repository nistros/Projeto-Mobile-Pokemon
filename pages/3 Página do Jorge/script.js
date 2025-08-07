document.addEventListener('DOMContentLoaded', () => {
  const botao = document.getElementById('buscarBtn');
  botao.addEventListener('click', buscarPokemon);
});

async function buscarPokemon() {
  const nome = document.getElementById('pokemonInput').value.toLowerCase();
  const url = `https://pokeapi.co/api/v2/pokemon/${nome}`;

  try {
    const resposta = await fetch(url);
    const dados = await resposta.json();

    document.getElementById('result').innerHTML = `
      <h2>${dados.name.toUpperCase()}</h2>
      <img src="${dados.sprites.front_default}" alt="${dados.name}" class="pokemon-img">
      <p><strong>Tipo:</strong> ${dados.types.map(t => t.type.name).join(', ')}</p>
      <p><strong>Altura:</strong> ${dados.height / 10} m</p>
      <p><strong>Peso:</strong> ${dados.weight / 10} kg</p>
    `;
  } catch (erro) {
    document.getElementById('result').innerHTML = `<p>Pokémon não encontrado 😢</p>`;
  }
}
