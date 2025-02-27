function updateView() {
    const html = `
    ${renderButtons()}
    
    ${renderBattleArea()}
    
    ${renderInventory()}
    
    ${renderTrainers()}
    `
    document.getElementById('app').innerHTML = html
}


function renderPokemon(pokemon, cssClass, options = {}) {
    const {
        onClick = '',
        index = null,
    } = options

    return `
    <div ${onClick ? `onclick="${onClick}"` : ''}" class="${cssClass}">
    <div>${pokemon.name}</div>
    <img src="${pokemon.img}">
    <div>Level: ${pokemon.level}</div>
    <div>Hp: ${pokemon.hp}</div>
    ${!model.input.battle.isActive ? `<button onclick="healThePokemon(${index})"> Heal</button>` : ''} 
    </div>
    `
}

function renderButtons() {
    return `
    <div class="control-buttons">
            ${model.input.battle.isActive ?
            `${model.input.battle.isFightingTrainer ? `
                <button  onclick="runAwayFromBattle()"> Run Away</button>`
                : `
                <button onclick="catchWildPokemon()"> Catch the pokemon</button>`}
                <button onclick="showPokemonInventory()"> Select Pokemon</button>`
            : `
            <button onclick="startWildBattle()">Go into the grass</button>
            <button onclick="showPokemonInventory()">View my pokemon</button>
            <button onclick="startTrainerBattle()"> Fight another trainer</button>`
        }
    </div>
    `
}


function renderBattleArea() {
    if (!model.input.battle.isActive) return ''

    return `
    <div class="battle-area">
    ${model.input.battle.haveUserSelectedPokemon ? `
        <div class="selected-pokemon">
        ${renderPokemon(model.input.battle.selectedPokemon)}
        ${model.input.elements.userCanAttack ? `<button onclick="userAttack()">Attack</button>`
                : ''}
        </div>`: ''}  
        <div class="battle-text">
        ${model.input.battle.battleText ?? ''}
        </div>      
        ${model.input.battle.wildPokemon ?
            `
            ${renderPokemon(model.input.battle.wildPokemon, 'wild-pokemon')}\
            `:
            `<div></div>`

        }
    </div>`;
}

function renderInventory() {
    if (!model.input.inventory.wantToShowPokemons) return ''

    return model.input.inventory.pokemonsTheUserHasCaught.map((pokemon, index) =>
        renderPokemon(pokemon, 'selected-pokemon', {
            onClick: model.input.battle.isActive ?
                `selectPokemonForBattle(${index})` : '',
            index
        })).join('');
}

function renderTrainers() {
    return `
        <div class="trainers-area">
            <div class="user-trainer">
                <div> name: ${model.data.allTrainers[0].name}</div>
                <img src="${model.data.allTrainers[0].img}">
            </div>
            ${model.input.battle.isFightingTrainer ?
            `
            <div class="enemy-trainer">
                <div> name: ${model.data.allTrainers[1].name}</div>
                <img src="${model.data.allTrainers[1].img}">
            </div>
            `
            : ''
        }
        </div>`;
}