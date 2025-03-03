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
    model.input.battle.userSelectedPokemon = null;
    model.input.battle.enemySelectedPokemon = null;
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
    model.input.battle.enemySelectedPokemon = model.input.inventory.enemyTrainersPokemons[0]
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
    model.input.battle.userSelectedPokemon = model.input.inventory.pokemonsTheUserHasCaught[index];
    model.input.battle.haveUserSelectedPokemon = true;
    model.input.battle.battleText = '';
    showPokemonInventory();
    updateView();
}

function userAttack() {
    if (model.input.battle.hasTheBattleBeenWon) return
    model.input.elements.userCanAttack = false;
    const damage = calculateDamage(model.input.battle.userSelectedPokemon.level)

    if (!model.input.battle.isFightingTrainer) {
        model.input.battle.wildPokemon.hp = model.input.battle.wildPokemon.hp - damage;
        model.input.battle.battleText = model.input.battle.userSelectedPokemon.name + ' hit for ' + damage;
        enemyAttack(model.input.battle.wildPokemon)
    } else {
        enemyAttack(model.input.battle.enemySelectedPokemon)
        model.input.battle.enemySelectedPokemon.hp = model.input.battle.enemySelectedPokemon.hp - damage;
        model.input.battle.battleText = model.input.battle.userSelectedPokemon.name + ' hit for ' + damage;
    }
    updateView();
    checkBattleState();
}

function enemyAttack(wildOrEnemyPokemon) {
    setTimeout(() => {
        if (model.input.battle.hasTheBattleBeenWon) return

        const damage = calculateDamage(wildOrEnemyPokemon.level)
        model.input.battle.userSelectedPokemon.hp = model.input.battle.userSelectedPokemon.hp - damage;
        model.input.battle.battleText = wildOrEnemyPokemon.name + ' hit for ' + damage;
        model.input.elements.userCanAttack = true;
        updateView();
        checkBattleState();
    }, 2000);
}

function checkBattleState() {
    if (model.input.battle.hasTheBattleBeenWon) return

    if (model.input.battle.haveUserSelectedPokemon == false) {
        model.input.battle.battleText = 'Ash has to select a pokemon!'
        updateView();
        return
    }
    whatTypeOFBattle()

}

function whatTypeOFBattle() {
    // Check in trainer Battle
    if (model.input.battle.isFightingTrainer) {
        checkIfAnyoneWon(model.input.inventory.pokemonsTheUserHasCaught, model.data.allTrainers[1]);
        checkIfAnyoneWon(model.input.inventory.enemyTrainersPokemons, model.data.allTrainers[0]);
        console.log('trainer battle')
    }
    // Check in wild pokemon battle
    if (!model.input.battle.isFightingTrainer) {
        console.log('wild battle')
        checkIfAnyoneWon(model.input.inventory.pokemonsTheUserHasCaught, model.input.battle.wildPokemon)
        checkIfAnyoneWon(model.input.battle.wildPokemon, model.data.allTrainers[0])
    }

}

function checkIfAnyoneWon(whatOpponent, whichEntity) {
    if (!Array.isArray(whatOpponent)) {
        if (whatOpponent.hp <= 0) {
            model.input.battle.battleText = whichEntity.name + ' has won';
            model.input.battle.hasTheBattleBeenWon = true;
            updateView();
            setTimeout(() => resetBattle(), 3000);
            return;
        }
        return;
    }

    for (let i = 0; i < whatOpponent.length; i++) {
        if (whatOpponent[whatOpponent.length - 1].hp <= 0) {
            model.input.battle.battleText = whichEntity.name + ' has won';
            model.input.battle.hasTheBattleBeenWon = true;
            updateView();
            setTimeout(() => resetBattle(), 3000);
            return
        }
        if (model.input.battle.isFightingTrainer && model.input.battle.enemySelectedPokemon.hp <= 0) {
            model.input.battle.enemySelectedPokemon = model.input.inventory.enemyTrainersPokemons[i + 1];
        }
        if (model.input.battle.isFightingTrainer && model.input.battle.userSelectedPokemon.hp <= 0) {
            model.input.battle.userSelectedPokemon = model.input.inventory.pokemonsTheUserHasCaught[i + 1];
        }
    }
}