import { addCharacterFromJSON } from './it-functions';
import { getCurrentData } from '../aws-services/s3';

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
    <div class="itc-popup-character-list-header">
      <button id="viewYourCharactersButton">View Your Characters</button>
      <button id="viewGlobalCharactersButton">View Global Characters</button>
    </div>
    <button class="itc-popup-add-character-button">Add to Initiative</button>
    <div class="itc-popup-search-container">
      <input type="search" id="search-bar" placeholder="Search...">
      <button id="search-button">Search</button>
    </div>
    <div class="itc-popup-character-list"></div>
  `;

  const characterList = popupContent.querySelector('.itc-popup-character-list');
  setupCharacterList(characters, characterList);

  popupClose.onclick = () => {
    popup.style.display = 'none';
  };

  const addCharacterButton = popupContent.querySelector('.itc-popup-add-character-button');
  addCharacterButton.addEventListener('click', () => {
    addCharactersToInitiative(characters, initiativeTracker);
  });

  const searchButton = popupContent.querySelector('.itc-popup-search-container button');
  searchButton.addEventListener('click', () => {
    searchCharacters();
  });

  addCharacterListButtonEventListeners(initiativeTracker, characterList);
}

function setupCharacterList(characters, characterList) {
  characters.forEach(character => {
    const characterCard = createCharacterCard(character);
    characterList.appendChild(characterCard);
  });
}

function addCharacterListButtonEventListeners(initiativeTracker, characterList) {
  const viewYourCharactersButton = document.getElementById('viewYourCharactersButton');
  const viewGlobalCharactersButton = document.getElementById('viewGlobalCharactersButton');

  viewYourCharactersButton.addEventListener('click', async () => {
    const characters = await getCurrentData();
    characterList.innerHTML = '';
    setupCharacterList(characters, characterList);
  });

  viewGlobalCharactersButton.addEventListener('click', async () => {
    const characters = await getCurrentData('admin/character.json');
    characterList.innerHTML = '';
    setupCharacterList(characters, characterList);
  });
}

function createCharacterCard(character) {
  const characterCard = document.createElement('div');
  characterCard.className = 'itc-popup-character-card';
  characterCard.innerHTML = `
    <div class="character-header">
      <h3 class="itc-popup-character-name">${character.name}</h3>
      <p class="itc-popup-character-hp">HP: ${character.maxHp}</p>
      <p class="itc-popup-character-ac">AC: ${character.ac}</p>
      <button class="itc-popup-view-attacks-button">View Attacks</button>
    </div>
    <div class="character-footer">
      <p class="itc-popup-character-initiative-modifier">Initiative Modifier: ${character.initiativeModifier}</p>
      <input type="checkbox" class="itc-popup-character-checkbox">
      <label>Add Character</label>
      <div class="roll-initiative" style="display: none;">
        <input type="checkbox" class="roll-initiative-checkbox">
        <label>Roll Initiative</label>
        <input type="number" class="roll-initiative-value" style="display: none;">
      </div>
    </div>
  `;

  const characterCheckbox = characterCard.querySelector('.itc-popup-character-checkbox');
  characterCheckbox.addEventListener('change', () => {
    toggleRollInitiative(characterCard);
  });

  const rollInitiativeCheckbox = characterCard.querySelector('.roll-initiative-checkbox');
  rollInitiativeCheckbox.addEventListener('change', () => {
    toggleRollInitiativeValue(characterCard);
  });

  const viewAttacksButton = characterCard.querySelector('.itc-popup-view-attacks-button');
  viewAttacksButton.addEventListener('click', () => {
    createAttackPopup(character);
  });

  return characterCard;
}

function toggleRollInitiative(characterCard) {
  const rollInitiativeDiv = characterCard.querySelector('.roll-initiative');
  const characterCheckbox = characterCard.querySelector('.itc-popup-character-checkbox');
  if (characterCheckbox.checked) {
    rollInitiativeDiv.style.display = 'inline-block';
  } else {
    rollInitiativeDiv.style.display = 'none';
  }
}

function toggleRollInitiativeValue(characterCard) {
  const rollInitiativeValue = characterCard.querySelector('.roll-initiative-value');
  const rollInitiativeCheckbox = characterCard.querySelector('.roll-initiative-checkbox');
  if (rollInitiativeCheckbox.checked) {
    rollInitiativeValue.style.display = 'inline-block';
  } else {
    rollInitiativeValue.style.display = 'none';
  }
}

function addCharactersToInitiative(characters, initiativeTracker) {
  const characterCards = document.querySelectorAll('.itc-popup-character-card');
  characterCards.forEach(card => {
    const characterCheckbox = card.querySelector('.itc-popup-character-checkbox');
    if (characterCheckbox.checked) {
      const characterName = card.querySelector('h3').textContent;
      const character = characters.find(char => char.name === characterName);
      const rollInitiativeCheckbox = card.querySelector('.roll-initiative-checkbox');
      const rollInitiativeValue = card.querySelector('.roll-initiative-value');
      let initiativeValue;
      if (rollInitiativeCheckbox && rollInitiativeCheckbox.checked) {
        initiativeValue = parseInt(rollInitiativeValue.value);
      }
      addCharacterFromJSON(character, initiativeTracker, initiativeValue);
    }
  });
}

function searchCharacters() {
  const searchBar = document.querySelector('#search-bar');
  const searchTerm = searchBar.value.toLowerCase();
  const characterCards = document.querySelectorAll('.itc-popup-character-card');

  for (const characterCard of characterCards) {
    const characterName = characterCard.querySelector('h3').textContent.toLowerCase();
    if (characterName.includes(searchTerm)) {
      characterCard.style.display = 'block';
    } else {
      characterCard.style.display = 'none';
    }
  }
}
