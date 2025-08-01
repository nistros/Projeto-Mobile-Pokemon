// Espera o DOM estar completamente carregado
document.addEventListener('DOMContentLoaded', function() {
    // Configurações iniciais
    const typeColors = {
        normal: '#A8A77A',
        fire: '#EE8130',
        water: '#6390F0',
        electric: '#F7D02C',
        grass: '#7AC74C',
        ice: '#96D9D6',
        fighting: '#C22E28',
        poison: '#A33EA1',
        ground: '#E2BF65',
        flying: '#A98FF3',
        psychic: '#F95587',
        bug: '#A6B91A',
        rock: '#B6A136',
        ghost: '#735797',
        dragon: '#6F35FC',
        dark: '#705746',
        steel: '#B7B7CE',
        fairy: '#D685AD'
    };

    // Variáveis globais
    let allPokemon = [];
    let currentPokemonId = 1;
    const totalPokemon = 1025;

    // Elementos DOM
    const pokemonImg = document.getElementById('pokemon-img');
    const pokemonName = document.getElementById('pokemon-name');
    const pokemonNumber = document.getElementById('pokemon-number');
    const pokemonTypes = document.getElementById('pokemon-types');
    const heightElement = document.getElementById('height');
    const weightElement = document.getElementById('weight');
    const descriptionElement = document.getElementById('description');
    const searchInput = document.getElementById('pokemon-search');
    const suggestionsElement = document.getElementById('suggestions');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const randomBtn = document.getElementById('random-btn');

    // Função para carregar todos os Pokémon
    async function loadAllPokemon() {
        try {
            const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1025');
            const data = await response.json();
            allPokemon = data.results;
            console.log('Lista de Pokémon carregada com sucesso!');
        } catch (error) {
            console.error('Erro ao carregar lista de Pokémon:', error);
        }
    }

    // Função para carregar dados de um Pokémon específico
    async function loadPokemon(id) {
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
            const data = await response.json();
            
            // Atualiza a interface
            pokemonImg.src = data.sprites.other['official-artwork'].front_default || 
                            data.sprites.front_default;
            pokemonName.textContent = data.name.charAt(0).toUpperCase() + data.name.slice(1);
            pokemonNumber.textContent = `#${data.id.toString().padStart(3, '0')}`;
            
            // Limpa e adiciona os tipos
            pokemonTypes.innerHTML = '';
            data.types.forEach(typeInfo => {
                const type = typeInfo.type.name;
                const typeElement = document.createElement('span');
                typeElement.className = 'type';
                typeElement.textContent = type.charAt(0).toUpperCase() + type.slice(1);
                typeElement.style.backgroundColor = typeColors[type] || '#777';
                pokemonTypes.appendChild(typeElement);
            });
            
            heightElement.textContent = (data.height / 10).toFixed(1);
            weightElement.textContent = (data.weight / 10).toFixed(1);
            
            // Carrega a descrição
            await loadPokemonDescription(data.id);
            
            currentPokemonId = data.id;
            console.log(`Pokémon #${data.id} carregado: ${data.name}`);
            
        } catch (error) {
            console.error('Erro ao carregar Pokémon:', error);
            alert('Erro ao carregar Pokémon. Tente novamente.');
        }
    }

    // Função para carregar descrição do Pokémon
    async function loadPokemonDescription(id) {
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}/`);
            const data = await response.json();
            
            // Encontra a primeira descrição em português
            const descriptionObj = data.flavor_text_entries.find(
                entry => entry.language.name === 'pt'
            );
            
            if (descriptionObj) {
                descriptionElement.textContent = descriptionObj.flavor_text
                    .replace(/\n/g, ' ')
                    .replace(/\f/g, ' ');
            } else {
                descriptionElement.textContent = 'Descrição não disponível.';
            }
        } catch (error) {
            console.error('Erro ao carregar descrição:', error);
            descriptionElement.textContent = 'Erro ao carregar descrição.';
        }
    }

    // Evento para os botões de navegação
    function setupNavigation() {
        // Botão Anterior
        prevBtn.addEventListener('click', () => {
            if (currentPokemonId > 1) {
                currentPokemonId--;
                loadPokemon(currentPokemonId);
            } else {
                console.log('Você já está no primeiro Pokémon');
            }
        });

        // Botão Próximo
        nextBtn.addEventListener('click', () => {
            if (currentPokemonId < totalPokemon) {
                currentPokemonId++;
                loadPokemon(currentPokemonId);
            } else {
                console.log('Você já está no último Pokémon');
            }
        });

        // Botão Aleatório
        randomBtn.addEventListener('click', () => {
            currentPokemonId = Math.floor(Math.random() * totalPokemon) + 1;
            loadPokemon(currentPokemonId);
        });

        console.log('Eventos de navegação configurados com sucesso!');
    }

    // Função para mostrar sugestões de pesquisa
    function showSuggestions(pokemonList) {
        suggestionsElement.innerHTML = '';
        
        if (pokemonList.length > 0) {
            pokemonList.forEach(pokemon => {
                const item = document.createElement('div');
                item.className = 'suggestion-item';
                const id = pokemon.url.split('/')[6];
                item.textContent = `#${id.padStart(3, '0')} ${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}`;
                item.addEventListener('click', () => {
                    loadPokemon(id);
                    searchInput.value = '';
                    suggestionsElement.style.display = 'none';
                });
                suggestionsElement.appendChild(item);
            });
            suggestionsElement.style.display = 'block';
        } else {
            suggestionsElement.style.display = 'none';
        }
    }

    // Configuração da pesquisa
    function setupSearch() {
        searchInput.addEventListener('input', () => {
            const searchTerm = searchInput.value.toLowerCase();
            if (searchTerm.length > 0) {
                const filtered = allPokemon.filter(pokemon => 
                    pokemon.name.includes(searchTerm) || 
                    pokemon.url.split('/')[6].toString().includes(searchTerm)
                ).slice(0, 10);
                showSuggestions(filtered);
            } else {
                suggestionsElement.style.display = 'none';
            }
        });

        document.addEventListener('click', (e) => {
            if (e.target !== searchInput) {
                suggestionsElement.style.display = 'none';
            }
        });

        console.log('Sistema de pesquisa configurado!');
    }

    // Inicialização
    async function init() {
        console.log('Iniciando Pokédex...');
        await loadAllPokemon();
        await loadPokemon(currentPokemonId);
        setupNavigation();
        setupSearch();
        console.log('Pokédex pronta para uso!');
    }

    // Inicia a aplicação
    init();
});