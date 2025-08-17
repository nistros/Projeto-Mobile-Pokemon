function buscarPokemon() {
    const nomeOuNumero = document.getElementById('searchInput').value.toLowerCase().trim();
    const resultado = document.getElementById('resultado');
    resultado.innerHTML = '';

    if (!nomeOuNumero) {
        resultado.innerHTML = '<p style="color:white;">Digite algo para buscar.</p>';
        return;
    }

    fetch(`https://pokeapi.co/api/v2/pokemon/${nomeOuNumero}`)
        .then(res => {
            if (!res.ok) throw new Error('Pokémon não encontrado');
            return res.json();
        })
        .then(data => {
            const nome = data.name;
            const imagem = data.sprites.front_default;
            const tipo = data.types.map(t => t.type.name).join(', ');
            const descricao = gerarDescricao(tipo);

            resultado.innerHTML = `
                <div class="card-pokemon">
                    <h2>${nome.charAt(0).toUpperCase() + nome.slice(1)}</h2>
                    <img src="${imagem}" alt="${nome}">
                    <p>${descricao}</p>
                </div>
            `;
        })
        .catch(err => {
            resultado.innerHTML = `<p style="color:white;">Pokémon não encontrado.</p>`;
        });
}

function gerarDescricao(tipo) {
    const descricoes = {
        electric: 'Elétrico e divertido ⚡',
        fire: 'Quente e poderoso 🔥',
        water: 'Refrescante e fluido 💧',
        grass: 'Natural e calmo 🍃',
        psychic: 'Misterioso e inteligente 🧠',
        rock: 'Forte e resistente 🪨',
        ghost: 'Sombrio e intrigante 👻',
        dragon: 'Lendário e feroz 🐉',
        ice: 'Gelado e elegante ❄️',
        normal: 'Simples e confiável 🤍'
    };

    const tipos = tipo.split(', ');
    return descricoes[tipos[0]] || 'Único e especial ✨';
}
