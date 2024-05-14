export function createCard(characterInfo) {
    const cardContainer = document.getElementById('character-card-container');
    const card = document.createElement('div');
    card.className = 'character-card';

    const header = document.createElement('div');
    header.className = 'character-header';

    const nameElement = document.createElement('h3');
    nameElement.innerHTML = `<b>Name:</b> <i>${characterInfo.name}</i>`;
    header.appendChild(nameElement);

    const hpElement = document.createElement('p');
    hpElement.innerHTML = `<b>HP:</b> <i>${characterInfo.currentHp}</i>/<i>${characterInfo.maxHp}</i>`;
    header.appendChild(hpElement);

    card.appendChild(header);

    const hr = document.createElement('hr');
    card.appendChild(hr);

    const info = document.createElement('div');
    info.className = 'character-info';

    const acElement = document.createElement('p');
    acElement.innerHTML = `<b>AC:</b> <i>${characterInfo.ac}</i>`;
    info.appendChild(acElement);

    const speedElement = document.createElement('p');
    speedElement.innerHTML = `<b>Speed:</b> <i>${characterInfo.speed}</i>`;
    info.appendChild(speedElement);

    const initiativeModifierElement = document.createElement('p');
    let initiativeModifierText = characterInfo.initiativeModifier;
    if (initiativeModifierText >= 0) {
        initiativeModifierText = `+${initiativeModifierText}`;
    }
    initiativeModifierElement.innerHTML = `<b>Initiative Modifier:</b> <i>${initiativeModifierText}</i>`;
    info.appendChild(initiativeModifierElement);

    const spellCastingModifierElement = document.createElement('p');
    let spellCastingModifierText = characterInfo.spellCastingModifier;
    if (spellCastingModifierText >= 0) {
        spellCastingModifierText = `+${spellCastingModifierText}`;
    }
    spellCastingModifierElement.innerHTML = `<b>Spell Casting Modifier:</b> <i>${spellCastingModifierText}</i>`;
    info.appendChild(spellCastingModifierElement);

    const spellSaveDcElement = document.createElement('p');
    spellSaveDcElement.innerHTML = `<b>Spell Save DC:</b> <i>${characterInfo.spellSaveDc}</i>`;
    info.appendChild(spellSaveDcElement);

    card.appendChild(info);

    const viewAttacksButton = document.createElement('button');
    viewAttacksButton.innerHTML = 'View Attacks';
    viewAttacksButton.onclick = () => {
        const popup = document.createElement('div');
        popup.className = 'popup';
        popup.innerHTML = `
            <div class="popup-header">
                <button class="close-button">×</button>
            </div>
            <h2>${characterInfo.name}'s attacks</h2>
            <div class="search-container">
                <input type="search" id="search-bar" placeholder="Search...">
                <button id="search-button">Search</button>
            </div>
            <div class="attacks-container">
                <div class="attack-card">
                    <div class="attack-header">
                        <h3>Attack Name</h3>
                    </div>
                    <hr>
                    <div class="attack-info">
                        <p><b>To Hit Bonus:</b> +5</p>
                        <p><b>Attack Damage:</b> 1d6+2 <span>Fire</span></p>
                        <p><b>Description:</b> This is a description of the attack. It can be really long and detailed.</p>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(popup);

        const closeButton = popup.querySelector('.close-button');
        closeButton.addEventListener('click', () => {
            popup.remove();
        });
    };
    card.appendChild(viewAttacksButton);

    cardContainer.appendChild(card);
}