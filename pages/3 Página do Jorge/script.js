let allPokemon = [];
let pokemonTypes = [];

// Função principal para carregar todos os Pokémon
async function loadAllPokemon() {
    const loadingElement = document.getElementById('loading');
    const gridElement = document.getElementById('pokemonGrid');
    
    loadingElement.style.display = 'block';
    gridElement.innerHTML = '';
    
    try {
        // Primeiro obtemos a lista de todos os Pokémon
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1000');
        const data = await response.json();
        
        // Carregamos os detalhes de cada Pokémon
        const pokemonDetails = await Promise.all(
            data.results.map(async (pokemon, index) => {
                const detailsResponse = await fetch(pokemon.url);
                const details = await detailsResponse.json();
                
                // Obtemos espécie para pegar o número da Pokédex
                const speciesResponse = await fetch(details.species.url);
                const species = await speciesResponse.json();
                
                return {
                    id: species.id,
                    name: details.name,
                    image: details.sprites.other['official-artwork'].front_default || 
                          details.sprites.front_default,
                    types: details.types.map(t => t.type.name),
                    generation: getGeneration(species.id)
                };
            })
        );
        
        allPokemon = pokemonDetails.sort((a, b) => a.id - b.id);
        pokemonTypes = getAllTypes(allPokemon);
        
        // Preenche o filtro de tipos
        fillTypeFilter();
        
        // Exibe todos os Pokémon
        displayPokemon(allPokemon);
        
    } catch (error) {
        console.error('Erro ao carregar Pokémon:', error);
        document.getElementById('errorMessage').textContent = 
            'Erro ao carregar a Pokédex. Por favor, recarregue a página.';
    } finally {
        loadingElement.style.display = 'none';
    }
}

// Função para exibir Pokémon na grade
function displayPokemon(pokemonList) {
    const gridElement = document.getElementById('pokemonGrid');
    gridElement.innerHTML = '';
    
    if (pokemonList.length === 0) {
        document.getElementById('errorMessage').textContent = 
            'Nenhum Pokémon encontrado com esses filtros.';
        return;
    }
    
    pokemonList.forEach(pokemon => {
        const card = document.createElement('div');
        card.className = 'pokemon-card';
        card.innerHTML = `
            <div class="pokemon-id">#${pokemon.id.toString().padStart(3, '0')}</div>
            <img class="pokemon-image" src="${pokemon.image}" alt="${pokemon.name}" 
                 onerror="this.src='https://via.placeholder.com/120?text=?'">
            <div class="pokemon-name">${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</div>
            <div class="pokemon-types">
                ${pokemon.types.map(type => `
                    <span class="pokemon-type" style="background-color: ${getTypeColor(type)}">
                        ${type}
                    </span>
                `).join('')}
            </div>
        `;
        gridElement.appendChild(card);
    });
}

// Função para filtrar Pokémon
function filterPokemon() {
    const searchTerm = document.getElementById('pokemonInput').value.trim().toLowerCase();
    const typeFilter = document.getElementById('typeFilter').value;
    const generationFilter = document.getElementById('generationFilter').value;
    
    document.getElementById('errorMessage').textContent = '';
    
    let filtered = allPokemon;
    
    // Aplica filtro de busca
    if (searchTerm) {
        filtered = filtered.filter(p => 
            p.name.includes(searchTerm) || 
            p.id.toString().includes(searchTerm)
        );
    }
    
    // Aplica filtro de tipo
    if (typeFilter) {
        filtered = filtered.filter(p => p.types.includes(typeFilter));
    }
    
    // Aplica filtro de geração
    if (generationFilter) {
        filtered = filtered.filter(p => p.generation === generationFilter);
    }
    
    displayPokemon(filtered);
}

// Função para preencher o filtro de tipos
function fillTypeFilter() {
    const typeFilter = document.getElementById('typeFilter');
    
    pokemonTypes.forEach(type => {
        const option = document.createElement('option');
        option.value = type;
        option.textContent = type.charAt(0).toUpperCase() + type.slice(1);
        typeFilter.appendChild(option);
    });
}

// Função para obter todos os tipos únicos
function getAllTypes(pokemonList) {
    const types = new Set();
    pokemonList.forEach(p => {
        p.types.forEach(t => types.add(t));
    });
    return Array.from(types).sort();
}

// Função para determinar a geração pelo ID
function getGeneration(id) {
    if (id <= 151) return '1';
    if (id <= 251) return '2';
    if (id <= 386) return '3';
    if (id <= 493) return '4';
    if (id <= 649) return '5';
    if (id <= 721) return '6';
    if (id <= 809) return '7';
    if (id <= 905) return '8';
    return '9';
}

// Função para obter cores baseadas no tipo do Pokémon
function getTypeColor(type) {
    const typeColors = {
        normal: '#A8A878',
        fire: '#F08030',
        water: '#6890F0',
        electric: '#F8D030',
        grass: '#78C850',
        ice: '#98D8D8',
        fighting: '#C03028',
        poison: '#A040A0',
        ground: '#E0C068',
        flying: '#A890F0',
        psychic: '#F85888',
        bug: '#A8B820',
        rock: '#B8A038',
        ghost: '#705898',
        dragon: '#7038F8',
        dark: '#705848',
        steel: '#B8B8D0',
        fairy: '#EE99AC'
    };
    
    return typeColors[type] || '#777';
}

// Carrega todos os Pokémon quando a página é carregada
window.onload = loadAllPokemon;

// Permitir busca ao pressionar Enter
document.getElementById('pokemonInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        filterPokemon();
    }
});