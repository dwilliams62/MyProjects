import { addCharacterFromJSON } from './it-functions';

export function createNewRoundSeparator(borderColor) {
    let newRoundSeparator = document.createElement('div');
    newRoundSeparator.textContent = 'NEW ROUND';
    newRoundSeparator.style.textAlign = 'center';
    newRoundSeparator.style.fontWeight = 'bold';
    newRoundSeparator.style.border = `1px solid ${borderColor}`;
    return newRoundSeparator;
}

export function createAcDisplay(ac) {
    const acDisplay = document.createElement('div');
    acDisplay.classList.add('it-status-effect');
    acDisplay.innerHTML = `<span>AC:</span> <span>${ac}</span>`;
    return acDisplay;
}

export function createHealthDisplay(currentHP, maxHP) {
    const healthDisplay = document.createElement('div');
    healthDisplay.classList.add('it-status-effect');
    healthDisplay.innerHTML = `<span>Health:</span> <span>${currentHP}/${maxHP}</span>`;
    return healthDisplay;
}

export function createStatusDisplay(status) {
    const statusDisplay = document.createElement('div');
    statusDisplay.classList.add('it-status-effect');
    statusDisplay.innerHTML = `<span>${status[0]}:</span> <span>${status[1]}</span>`;
    return statusDisplay;
}

export function createBeginningOfTurnDisplay() {
    const beginningOfTurnDisplay = document.createElement('div');
    beginningOfTurnDisplay.classList.add('it-status-effect');
    beginningOfTurnDisplay.innerHTML = '<span>Beginning of Turn:</span>';
    const beginningOfTurnList = document.createElement('ul');
    beginningOfTurnDisplay.appendChild(beginningOfTurnList);
    return { beginningOfTurnDisplay, beginningOfTurnList };
}

export function createEndOfTurnDisplay() {
    const endOfTurnDisplay = document.createElement('div');
    endOfTurnDisplay.classList.add('it-status-effect');
    endOfTurnDisplay.innerHTML = '<span>End of Turn:</span>';
    const endOfTurnList = document.createElement('ul');
    endOfTurnDisplay.appendChild(endOfTurnList);
    return { endOfTurnDisplay, endOfTurnList };
}

export function populateCharacterPopup(characters, initiativeTracker) {
  const popup = document.getElementById('popup');
  const popupContent = document.getElementById('popupContent');
  const popupClose = document.getElementById('popupClose');

  popup.style.display = 'block';
  popupContent.innerHTML = `
    <h2>Load Character</h2>
    <div class="itc-popup-search-container">
      <input type="search" id="search-bar" placeholder="Search...">
      <button id="search-button">Search</button>
    </div>
    <div class="itc-popup-character-list"></div>
  `;

  const characterList = popupContent.querySelector('.itc-popup-character-list');
  characters.forEach(character => {
    const characterCard = document.createElement('div');
    characterCard.className = 'itc-popup-character-card';
    characterCard.innerHTML = `
      <h3 class="itc-popup-character-name">${character.name}</h3>
      <p class="itc-popup-character-hp">HP: ${character.maxHp}</p>
      <p class="itc-popup-character-ac">AC: ${character.ac}</p>
      <button class="itc-popup-add-character-button">Add to Initiative</button>
      <button class="itc-popup-view-attacks-button">View Attacks</button>
    `;
    characterList.appendChild(characterCard);

    const viewAttacksButton = characterCard.querySelector('.itc-popup-view-attacks-button');
    viewAttacksButton.addEventListener('click', () => {
      createAttackPopup(character);
    });
  });

  popupClose.onclick = () => {
    popup.style.display = 'none';
  };

  const searchButton = popupContent.querySelector('.itc-popup-search-container button');
  searchButton.addEventListener('click', () => {
    const searchBar = popup.querySelector('#search-bar');
    const searchTerm = searchBar.value.toLowerCase();
    const characterCards = popup.querySelectorAll('.itc-popup-character-card');

    for (const characterCard of characterCards) {
      const characterName = characterCard.querySelector('h3').textContent.toLowerCase();
      if (characterName.includes(searchTerm)) {
        characterCard.style.display = 'block';
      } else {
        characterCard.style.display = 'none';
      }
    }
  });

  const characterCards = popup.querySelectorAll('.itc-popup-character-card');
  characterCards.forEach(card => {
    const addCharacterButton = card.querySelector('.itc-popup-add-character-button');
    addCharacterButton.addEventListener('click', () => {
      const characterName = card.querySelector('h3').textContent;
      const character = characters.find(char => char.name === characterName);
      addCharacterFromJSON(character, initiativeTracker);
    });
  });
}