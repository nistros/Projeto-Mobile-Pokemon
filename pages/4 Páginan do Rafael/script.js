document.addEventListener('DOMContentLoaded', function() {

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


    let allPokemon = [];
    let currentPokemonId = 1;
    const totalPokemon = 1025;


    const elements = {
        img: document.getElementById('pokemon-img'),
        name: document.getElementById('pokemon-name'),
        number: document.getElementById('pokemon-number'),
        types: document.getElementById('pokemon-types'),
        height: document.getElementById('height'),
        weight: document.getElementById('weight'),
        description: document.getElementById('description'),
        search: document.getElementById('pokemon-search'),
        suggestions: document.getElementById('suggestions'),
        prevBtn: document.getElementById('prev-btn'),
        nextBtn: document.getElementById('next-btn'),
        randomBtn: document.getElementById('random-btn')
    };


    async function loadAllPokemon() {
        try {
            const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1025');
            const data = await response.json();
            allPokemon = data.results;
            console.log('Lista de Pokémon carregada:', allPokemon.length);
        } catch (error) {
            console.error('Erro ao carregar lista:', error);
            alert('Erro ao carregar lista de Pokémon');
        }
    }


    async function loadPokemon(id) {
        try {
            // Mostra loading
            elements.img.src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png';
            elements.name.textContent = 'Carregando...';
            elements.types.innerHTML = '<span class="type type-normal">Carregando</span>';
            
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
            const data = await response.json();
            
            updatePokemonData(data);
            await loadPokemonDescription(data.id);
            
            currentPokemonId = data.id;
        } catch (error) {
            console.error('Erro ao carregar Pokémon:', error);
            showError();
        }
    }


    function updatePokemonData(data) {
        elements.img.src = data.sprites.other['official-artwork'].front_default || 
                          data.sprites.front_default;
        elements.img.alt = data.name;
        elements.name.textContent = capitalizeFirstLetter(data.name);
        elements.number.textContent = `#${data.id.toString().padStart(3, '0')}`;
        

        elements.types.innerHTML = '';
        data.types.forEach(typeInfo => {
            const type = typeInfo.type.name;
            const typeElement = document.createElement('span');
            typeElement.className = `type type-${type}`;
            typeElement.textContent = capitalizeFirstLetter(type);
            elements.types.appendChild(typeElement);
        });
        
        elements.height.textContent = (data.height / 10).toFixed(1);
        elements.weight.textContent = (data.weight / 10).toFixed(1);
    }


    async function loadPokemonDescription(id) {
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}/`);
            const data = await response.json();
            
            const ptDescription = data.flavor_text_entries.find(e => e.language.name === 'pt');
            const enDescription = data.flavor_text_entries.find(e => e.language.name === 'en');
            
            elements.description.textContent = 
                (ptDescription || enDescription || {flavor_text: 'Descrição não disponível'})
                .flavor_text.replace(/[\n\f]/g, ' ');
        } catch (error) {
            console.error('Erro ao carregar descrição:', error);
            elements.description.textContent = 'Erro ao carregar descrição';
        }
    }

   
    function showError() {
        elements.name.textContent = 'Pokémon não encontrado';
        elements.number.textContent = '#???';
        elements.types.innerHTML = '<span class="type type-normal">Erro</span>';
        elements.description.textContent = 'Não foi possível carregar os dados deste Pokémon.';
    }

    
    function setupNavigation() {
        elements.prevBtn.addEventListener('click', () => {
            if (currentPokemonId > 1) {
                loadPokemon(--currentPokemonId);
            }
        });

        elements.nextBtn.addEventListener('click', () => {
            if (currentPokemonId < totalPokemon) {
                loadPokemon(++currentPokemonId);
            }
        });

        elements.randomBtn.addEventListener('click', () => {
            loadPokemon(Math.floor(Math.random() * totalPokemon) + 1);
        });
    }

   
    function setupSearch() {
        elements.search.addEventListener('input', () => {
            const term = elements.search.value.toLowerCase();
            if (term.length > 0) {
                const matches = allPokemon.filter(p => 
                    p.name.includes(term) || 
                    p.url.split('/')[6].includes(term)
                ).slice(0, 10);
                
                showSuggestions(matches);
            } else {
                elements.suggestions.style.display = 'none';
            }
        });

   
        document.addEventListener('click', (e) => {
            if (e.target !== elements.search) {
                elements.suggestions.style.display = 'none';
            }
        });
    }

   
    function showSuggestions(pokemonList) {
        elements.suggestions.innerHTML = '';
        
        if (pokemonList.length > 0) {
            pokemonList.forEach(pokemon => {
                const id = pokemon.url.split('/')[6];
                const item = document.createElement('div');
                item.className = 'suggestion-item';
                item.textContent = `#${id.padStart(3, '0')} ${capitalizeFirstLetter(pokemon.name)}`;
                item.addEventListener('click', () => {
                    loadPokemon(id);
                    elements.search.value = '';
                    elements.suggestions.style.display = 'none';
                });
                elements.suggestions.appendChild(item);
            });
            elements.suggestions.style.display = 'block';
        } else {
            elements.suggestions.style.display = 'none';
        }
    }

    
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    // Inicialização
    async function init() {
        await loadAllPokemon();
        await loadPokemon(currentPokemonId);
        setupNavigation();
        setupSearch();
        
      
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') elements.prevBtn.click();
            if (e.key === 'ArrowRight') elements.nextBtn.click();
            if (e.key === ' ') elements.randomBtn.click();
        });
    }

    init();
});