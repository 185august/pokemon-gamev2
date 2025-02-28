function startGame() {
    model.input.inventory.availablePokemons = deepCopyArray(model.data.allPokemons)

    //Starts the game with a pikachu
    if (model.input.inventory.pokemonsTheUserHasCaught.length === 0) {
        const pikachu = model.data.allPokemons.find(pokemon => pokemon.name === 'Pikachu');
        model.input.inventory.pokemonsTheUserHasCaught.push({ ...pikachu })
    }
}

function resetBattle() {
    model.input.battle.isActive = false;
    model.input.battle.isFightingTrainer = false;
    model.input.battle.haveUserSelectedPokemon = false;
    model.input.battle.isUserTurn = true;
    model.input.battle.hasTheBattleBeenWon = false;
    model.input.battle.battleText = '';
    model.input.battle.wildPokemon = null;
    model.input.battle.selectedPokemon = null;
    model.input.inventory.wantToShowPokemons = false;
    model.input.elements.userCanAttack = true;
    updateView();
}

function initializeGame() {
    startGame();
    updateView();
}

function startWildBattle() {
    resetBattle();
    checkBattleState();
    const randomIndex = randomNumber(0, model.input.inventory.availablePokemons.length - 1);
    console.log(randomIndex)
    model.input.battle.wildPokemon = { ...model.input.inventory.availablePokemons[randomIndex] };

    model.input.battle.isActive = true;
    model.input.battle.isFightingTrainer = false;
    updateView();
}

function startTrainerBattle() {
    resetBattle();
    checkBattleState();

    model.input.battle.isFightingTrainer = true;
    model.input.battle.isActive = true;
    model.input.inventory.enemyTrainersPokemons = deepCopyArray(model.data.enemyTrainersPokemons)
    model.input.battle.wildPokemon = model.input.inventory.enemyTrainersPokemons[0]
    updateView();
}

function catchWildPokemon() {
    model.input.inventory.pokemonsTheUserHasCaught.push({ ...model.input.battle.wildPokemon })
    resetBattle();
    updateView();
}

function runAwayFromBattle() {
    resetBattle();
}

function healThePokemon(index) {
    const findPokemon = model.data.allPokemons.find(({ name }) => name === model.input.inventory.pokemonsTheUserHasCaught[index].name)
    model.input.inventory.pokemonsTheUserHasCaught[index].hp = findPokemon.hp;
    updateView();
}


function showPokemonInventory() {
    model.input.inventory.wantToShowPokemons = !model.input.inventory.wantToShowPokemons;
    updateView();
}

function selectPokemonForBattle(index) {
    model.input.battle.selectedPokemon = model.input.inventory.pokemonsTheUserHasCaught[index];
    model.input.battle.haveUserSelectedPokemon = true;
    model.input.battle.battleText = '';
    showPokemonInventory();
    updateView();
}

function userAttack() {
    model.input.elements.userCanAttack = false;
    const damage = calculateDamage(model.input.battle.selectedPokemon.level)
    model.input.battle.wildPokemon.hp = model.input.battle.wildPokemon.hp - damage;
    model.input.battle.battleText = model.input.battle.selectedPokemon.name + ' hit for ' + damage;
    checkBattleState();
    if (!model.input.battle.hasTheBattleBeenWon) {
        enemyAttack();
    }
    updateView();
}

function enemyAttack() {
    setTimeout(() => {
        if (model.input.battle.hasTheBattleBeenWon) return

        const damage = calculateDamage(model.input.battle.wildPokemon.level)
        model.input.battle.selectedPokemon.hp = model.input.battle.selectedPokemon.hp - damage;
        model.input.battle.battleText = 'Wild ' + model.input.battle.wildPokemon.name + ' hit for ' + damage;
        model.input.elements.userCanAttack = true;
        checkBattleState();
        updateView();
    }, 1000);
}

function checkBattleState() {
    if (model.input.battle.hasTheBattleBeenWon) return

    if (model.input.battle.haveUserSelectedPokemon == false) {
        model.input.battle.battleText = 'Ash has to select a pokemon!'
        updateView();
        return
    }

    if (model.input.battle.isFightingTrainer) {
        checkBattleStateFightingTrainer();
        return
    }

    if (model.input.battle.selectedPokemon.hp <= 0) {
        model.input.battle.battleText = model.input.battle.wildPokemon.name + ` has won`;
        model.input.battle.hasTheBattleBeenWon = true;
        setTimeout(() => resetBattle(), 3000);
    }

    if (model.input.battle.wildPokemon.hp <= 0) {
        model.input.battle.battleText = model.data.allTrainers[0].name + ' and ' + model.input.battle.selectedPokemon.name + ' has won';
        model.input.battle.hasTheBattleBeenWon = true;
        setTimeout(() => resetBattle(), 3000);
    }

    function checkBattleStateFightingTrainer() {
        for (let i = 0; i < model.input.inventory.enemyTrainersPokemons.length; i++) {
            if (model.input.inventory.enemyTrainersPokemons[model.input.inventory.enemyTrainersPokemons.length - 1].hp <= 0) {
                console.log('does this run')
                model.input.battle.battleText = model.data.allTrainers[0].name + ' and ' + model.input.battle.selectedPokemon.name + ' has won';
                model.input.battle.hasTheBattleBeenWon = true;
                updateView();
                setTimeout(() => resetBattle(), 3000);
            }
            if (model.input.battle.wildPokemon.hp <= 0) {
                model.input.battle.wildPokemon = model.input.inventory.enemyTrainersPokemons[i + 1];
            }
        }
    }

}