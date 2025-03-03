const model = {
    app: {
        app: document.getElementById('app'),
    },
    input: {
        battle: {
            isActive: false,
            isFightingTrainer: false,
            hasTheBattleBeenWon: false,
            battleText: '',
            wildPokemon: [null],
            userSelectedPokemon: null,
            enemySelectedPokemon: null,
            haveUserSelectedPokemon: false,
            userTurnInBattle: true,
            isPokemonAbleTofight: true,
        },
        inventory: {
            availablePokemons: [],
            pokemonsTheUserHasCaught: [],
            enemyTrainersPokemons: [],
            wantToShowPokemons: false,

        },
        elements: {
            userCanAttack: true,
            showHealBtn: false,
        }
    },
    data: {
        allPokemons: [
            { name: 'Pikachu', level: 25, img: 'img/pokemon1.png', hp: 100 },
            { name: 'Squirtle', level: 15, img: 'img/pokemon2.png', hp: 50 },
            { name: 'Charmander', level: 20, img: 'img/pokemon3.png', hp: 75 },
            { name: 'Evee', level: 13, img: 'img/pokemon4.png', hp: 40 },
            { name: 'Bulbasour', level: 15, img: 'img/pokemon5.png', hp: 50 },
            { name: 'Jigglypuff', level: 30, img: 'img/pokemon6.png', hp: 120 },
            { name: 'Meowth', level: 20, img: 'img/pokemon7.png', hp: 75 },
            { name: 'Psyduck', level: 20, img: 'img/pokemon8.png', hp: 78 },
            { name: 'Dragonair', level: 42, img: 'img/pokemon9.png', hp: 150 },
            { name: 'Snorlax', level: 50, img: 'img/pokemon10.png', hp: 250 },
        ],
        allTrainers: [
            { name: 'Ash', img: 'img/pokemonTrainerIdle.png' },
            { name: 'Markus', img: 'img/pokemonEnemyTrainerIdle.png' }
        ],
        enemyTrainersPokemons: [
            { name: 'Bulbasour', level: 20, img: 'img/pokemon5.png', hp: 50 },
            { name: 'Jigglypuff', level: 25, img: 'img/pokemon6.png', hp: 105 },
            { name: 'Dragonair', level: 45, img: 'img/pokemon9.png', hp: 240 },
        ]
    },
}

function deepCopyArray(arrayId) {
    return arrayId.map(pokemon => ({ ...pokemon }));
}

function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function calculateDamage(level) {
    return randomNumber(1, 4) * level;
}