import { getCurrentData } from './s3.js';

export function createCard(characterInfo) {
    const cardContainer = document.getElementById('cards');
    const card = document.createElement('div');
    card.className = 'character-card';

    // Create image
    const image = document.createElement('img');
    image.src = 'placeholder.png'; // Replace with the URL of your placeholder image
    image.style.border = '1px solid red'; // Add red border
    image.style.float = 'left'; // Move image to the left
    image.style.marginRight = '10px'; // Add some space between image and text
    image.style.width = '50px'; // Set width to 50px
    image.style.height = '50px'; // Set height to 50px
    image.style.objectFit = 'cover'; // Scale down the image while maintaining aspect ratio
    card.appendChild(image);

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
      createAttackPopup(characterInfo);
    };
    info.appendChild(viewAttacksButton);

    cardContainer.appendChild(card);
}

async function createAttackPopup(characterInfo) {
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
        </div>
    `;
    document.body.appendChild(popup);

    const closeButton = popup.querySelector('.close-button');
    closeButton.addEventListener('click', () => {
        popup.remove();
    });

    const data = await getCurrentData();
    const character = data.find(char => char.name === characterInfo.name);
    const attacksContainer = popup.querySelector('.attacks-container');

    if (character && character.attacks && character.attacks.length > 0) {
        character.attacks.forEach(attack => {
            const attackCard = document.createElement('div');
            attackCard.className = 'attack-card';
            attackCard.innerHTML = `
                <div class="attack-header">
                    <h3>${attack.name}</h3>
                </div>
                <p>${attack.description}</p>
                <hr>
                <div class="attack-info">
                    <p><b>To Hit Bonus:</b> +${attack.toHitBonus} | <b>Attack Damage:</b> ${attack.damage} <span>${attack.damageType}</span></p>
                </div>
            `;
            attacksContainer.appendChild(attackCard);
        });
    } else {
        const noAttacksMessage = document.createElement('p');
        noAttacksMessage.textContent = 'No attacks listed!';
        attacksContainer.appendChild(noAttacksMessage);
    }
}