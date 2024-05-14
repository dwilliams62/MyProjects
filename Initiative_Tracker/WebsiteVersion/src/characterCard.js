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

    cardContainer.appendChild(card);
}
/*
function generateRandomCards() {
    for (let i = 0; i < 10; i++) {
        const characterInfo = {
            name: `Character ${i}`,
            currentHp: Math.floor(Math.random() * 100),
            maxHp: Math.floor(Math.random() * 100),
            ac: Math.floor(Math.random() * 20),
            speed: `${Math.floor(Math.random() * 30)} ft.`,
            initiativeModifier: Math.floor(Math.random() * 5),
            spellCastingModifier: Math.floor(Math.random() * 5),
            spellSaveDc: Math.floor(Math.random() * 15)
        };

        createCard(characterInfo);
    }
}

generateRandomCards();*/