const API_URL = 'https://pokeapi.co/api/v2/pokemon';

const pokemonGrid = document.getElementById('pokemonGrid');
const loading = document.getElementById('loading');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');


// ==========================================
// BUSCAR DADOS DA API
// ==========================================

async function fetchPokemonData(urlOrName) {

    let url;

    if (urlOrName.toString().startsWith('http')) {
        url = urlOrName;
    } else {
        url = `${API_URL}/${urlOrName}`;
    }

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error('Pokémon não encontrado');
    }

    return await response.json();
}


// ==========================================
// CARREGAR POKÉMON INICIAL
// ==========================================

async function loadInitialPokemon(limit = 20) {

    showLoading(true);

    try {

        const response = await fetch(`${API_URL}?limit=${limit}`);

        if (!response.ok) {
            throw new Error('Erro ao carregar Pokémon');
        }

        const data = await response.json();

        const pokemonPromises = data.results.map(item =>
            fetchPokemonData(item.url)
        );

        const pokemonList = await Promise.all(pokemonPromises);

        pokemonGrid.innerHTML = '';

        pokemonList.forEach(pokemon => {
            renderPokemonCard(pokemon);
        });

    } catch (error) {

        console.error(error);
        showError('Falha ao carregar os Pokémon.');

    } finally {

        showLoading(false);

    }
}


// ==========================================
// CRIAR CARD DO POKÉMON
// ==========================================

function renderPokemonCard(pokemon) {

    const image =
        pokemon.sprites.other?.['official-artwork']?.front_default ||
        pokemon.sprites.front_default;

    const types = pokemon.types
        .map(type => `
            <span class="badge bg-primary me-1 text-capitalize">
                ${type.type.name}
            </span>
        `)
        .join('');

    const height = pokemon.height / 10;
    const weight = pokemon.weight / 10;

    const cardHTML = `
        <div class="col">
            <div
                class="card h-100 shadow-sm pokemon-card border-0"
                style="cursor: pointer;"
                onclick="openPokemonModal(${pokemon.id})"
            >

                <img
                    src="${image}"
                    class="card-img-top p-3"
                    alt="${pokemon.name}"
                >

                <div class="card-body text-center">

                    <h5 class="card-title text-capitalize">
                        #${pokemon.id} ${pokemon.name}
                    </h5>

                    <div class="mb-2">
                        ${types}
                    </div>

                    <p class="card-text">
                        <strong>Altura:</strong> ${height} m
                        <br>
                        <strong>Peso:</strong> ${weight} kg
                    </p>

                </div>

            </div>
        </div>
    `;

    pokemonGrid.insertAdjacentHTML('beforeend', cardHTML);
}


// ==========================================
// ABRIR MODAL DO POKÉMON
// ==========================================

async function openPokemonModal(id) {

    try {

        showLoading(true);

        const pokemon = await fetchPokemonData(id);

        // -----------------------------
        // TÍTULO
        // -----------------------------

        const modalTitle = document.getElementById('pokemonModalTitle');

        modalTitle.textContent =
            `#${pokemon.id} ${pokemon.name}`;


        // -----------------------------
        // DADOS DOS STATUS
        // -----------------------------

        const hp = pokemon.stats.find(
            stat => stat.stat.name === 'hp'
        ).base_stat;

        const attack = pokemon.stats.find(
            stat => stat.stat.name === 'attack'
        ).base_stat;

        const defense = pokemon.stats.find(
            stat => stat.stat.name === 'defense'
        ).base_stat;

        const speed = pokemon.stats.find(
            stat => stat.stat.name === 'speed'
        ).base_stat;


        // -----------------------------
        // HABILIDADES
        // -----------------------------

        const abilities = pokemon.abilities
            .map(ability => `
                <li class="list-group-item text-capitalize">
                    ${ability.ability.name}
                </li>
            `)
            .join('');


        // -----------------------------
        // CRY DO POKÉMON
        // -----------------------------

        const cry =
            pokemon.cries?.latest ||
            pokemon.cries?.legacy;


        // -----------------------------
        // SPRITES
        // -----------------------------

        const frontDefault =
            pokemon.sprites.front_default;

        const backDefault =
            pokemon.sprites.back_default;

        const frontShiny =
            pokemon.sprites.front_shiny;

        const backShiny =
            pokemon.sprites.back_shiny;


        // -----------------------------
        // HTML DO MODAL
        // -----------------------------

        const modalBody =
            document.getElementById('pokemonModalBody');

        modalBody.innerHTML = `

            <!-- IMAGEM PRINCIPAL -->

            <div class="text-center mb-4">

                <img
                    src="${pokemon.sprites.other?.['official-artwork']?.front_default || frontDefault}"
                    alt="${pokemon.name}"
                    class="img-fluid"
                    style="max-width: 200px;"
                >

            </div>


            <!-- STATUS -->

            <h5 class="mb-3">
                Status
            </h5>


            <div class="mb-3">

                <div class="d-flex justify-content-between">
                    <span>HP</span>
                    <strong>${hp}</strong>
                </div>

                <div class="progress">
                    <div
                        class="progress-bar"
                        role="progressbar"
                        style="width: ${Math.min(hp, 100)}%;"
                    >
                        ${hp}
                    </div>
                </div>

            </div>


            <div class="mb-3">

                <div class="d-flex justify-content-between">
                    <span>Ataque</span>
                    <strong>${attack}</strong>
                </div>

                <div class="progress">
                    <div
                        class="progress-bar"
                        role="progressbar"
                        style="width: ${Math.min(attack, 100)}%;"
                    >
                        ${attack}
                    </div>
                </div>

            </div>


            <div class="mb-3">

                <div class="d-flex justify-content-between">
                    <span>Defesa</span>
                    <strong>${defense}</strong>
                </div>

                <div class="progress">
                    <div
                        class="progress-bar"
                        role="progressbar"
                        style="width: ${Math.min(defense, 100)}%;"
                    >
                        ${defense}
                    </div>
                </div>

            </div>


            <div class="mb-4">

                <div class="d-flex justify-content-between">
                    <span>Velocidade</span>
                    <strong>${speed}</strong>
                </div>

                <div class="progress">
                    <div
                        class="progress-bar"
                        role="progressbar"
                        style="width: ${Math.min(speed, 100)}%;"
                    >
                        ${speed}
                    </div>
                </div>

            </div>


            <!-- HABILIDADES -->

            <h5 class="mb-3">
                Habilidades
            </h5>

            <ul class="list-group mb-4">
                ${abilities}
            </ul>


            <!-- CRY -->

            <h5 class="mb-3">
                Cry
            </h5>

            ${
                cry
                    ? `
                        <audio
                            controls
                            class="w-100 mb-4"
                        >
                            <source
                                src="${cry}"
                                type="audio/ogg"
                            >

                            Seu navegador não suporta áudio.
                        </audio>
                    `
                    : `
                        <p>
                            Cry não disponível.
                        </p>
                    `
            }


            <!-- SPRITES -->

            <h5 class="mb-3">
                Sprites
            </h5>

            <div class="row text-center">

                <div class="col-6 col-md-3 mb-3">

                    <p>
                        Normal - Frente
                    </p>

                    <img
                        src="${frontDefault}"
                        alt="${pokemon.name} normal frente"
                        class="img-fluid"
                    >

                </div>


                <div class="col-6 col-md-3 mb-3">

                    <p>
                        Normal - Costas
                    </p>

                    <img
                        src="${backDefault}"
                        alt="${pokemon.name} normal costas"
                        class="img-fluid"
                    >

                </div>


                <div class="col-6 col-md-3 mb-3">

                    <p>
                        Shiny - Frente
                    </p>

                    <img
                        src="${frontShiny}"
                        alt="${pokemon.name} shiny frente"
                        class="img-fluid"
                    >

                </div>


                <div class="col-6 col-md-3 mb-3">

                    <p>
                        Shiny - Costas
                    </p>

                    <img
                        src="${backShiny}"
                        alt="${pokemon.name} shiny costas"
                        class="img-fluid"
                    >

                </div>

            </div>

        `;


        // -----------------------------
        // ABRIR MODAL
        // -----------------------------

        const modalElement =
            document.getElementById('pokemonModal');

        const modal =
            new bootstrap.Modal(modalElement);

        modal.show();


    } catch (error) {

        console.error(error);

        showError(
            'Não foi possível carregar os detalhes do Pokémon.'
        );

    } finally {

        showLoading(false);

    }
}


// ==========================================
// PESQUISA
// ==========================================

async function handleSearch() {

    const searchTerm =
        searchInput.value.trim().toLowerCase();

    if (!searchTerm) {

        loadInitialPokemon();

        return;
    }

    showLoading(true);

    try {

        const pokemon =
            await fetchPokemonData(searchTerm);

        pokemonGrid.innerHTML = '';

        renderPokemonCard(pokemon);

    } catch (error) {

        console.error(error);

        showError(
            'Pokémon não encontrado.'
        );

    } finally {

        showLoading(false);

    }
}


// ==========================================
// LOADING
// ==========================================

function showLoading(state) {

    if (state) {

        loading.classList.remove('d-none');

    } else {

        loading.classList.add('d-none');

    }
}


// ==========================================
// ERRO
// ==========================================

function showError(message) {

    pokemonGrid.innerHTML = `
        <div class="col-12">
            <div class="alert alert-danger text-center">
                ${message}
            </div>
        </div>
    `;
}


// ==========================================
// EVENTOS
// ==========================================

searchBtn.addEventListener(
    'click',
    handleSearch
);


searchInput.addEventListener(
    'keypress',
    event => {

        if (event.key === 'Enter') {

            handleSearch();

        }

    }
);


// ==========================================
// INICIALIZAÇÃO
// ==========================================

loadInitialPokemon();