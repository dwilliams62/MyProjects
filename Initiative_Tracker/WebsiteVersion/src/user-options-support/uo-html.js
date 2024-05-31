import { createCard } from './characterCard.js';
import { getCurrentData } from '../aws-services/s3.js';

export function collectData() {
  const name = document.getElementById('name').value;
  const initiativeModifier = parseInt(document.getElementById('initiative-modifier').value);
  const ac = parseInt(document.getElementById('ac').value);
  const maxHp = parseInt(document.getElementById('max-hp').value);
  const spellCastingModifier = parseInt(document.getElementById('spell-casting-modifier').value);
  const spellSaveDc = parseInt(document.getElementById('spell-save-dc').value);
  const speed = parseInt(document.getElementById('speed').value);

  return {
    name,
    initiativeModifier,
    ac,
    maxHp,
    spellCastingModifier,
    spellSaveDc,
    speed,
  };
}

export function collectAttackData() {
  const characterName = document.getElementById('character-name').value;
  const attackName = document.getElementById('attack-name').value;
  const attackDescription = document.getElementById('attack-description').value;
  const attackToHitBonus = parseInt(document.getElementById('attack-to-hit-bonus').value);
  const attackDamage = document.getElementById('attack-damage').value;
  const attackDamageType = document.getElementById('attack-damage-type').value;

  return {
    characterName,
    attackName,
    attackDescription,
    attackToHitBonus,
    attackDamage,
    attackDamageType,
  };
}

export async function displayCharactersInDropdown() {
    try {
      const jsonData = await getCurrentData();
      const characterSelect = document.getElementById('character-name');
      characterSelect.innerHTML = '';
      jsonData.sort((a, b) => a.name.localeCompare(b.name)).forEach((character) => {
        const option = document.createElement('option');
        option.value = character.name;
        option.textContent = character.name;
        characterSelect.appendChild(option);
      });
    } catch (error) {
      console.error(error);
    }
}

export async function displayCharactersFromJSON() {
  try {
    let jsonData = await getCurrentData();

    // Get the card container element
    const cardContainer = document.getElementById('cards');

    // Clear out all the existing cards
    cardContainer.innerHTML = '';

    // Create a card for each character in the JSON data
    jsonData.forEach(characterData => {
      const characterInfo = {
        name: characterData.name,
        currentHp: characterData.currentHp || characterData.maxHp,
        maxHp: characterData.maxHp,
        ac: characterData.ac,
        speed: characterData.speed,
        initiativeModifier: characterData.initiativeModifier,
        spellCastingModifier: characterData.spellCastingModifier,
        spellSaveDc: characterData.spellSaveDc,
      };

      // Create a card for the character
      createCard(characterInfo);
    });
  } catch (error) {
    console.error(error);
  }
}

export function displayPopup(message) {
    const popup = document.createElement('div');
    popup.className = 'popup';
    popup.innerHTML = `
      <div class="popup-header">
        <button class="close-button">Close</button>
      </div>
      <h2>${message}</h2>
    `;
    document.body.appendChild(popup);
    const closeButton = popup.querySelector('.close-button');
    closeButton.addEventListener('click', () => {
      popup.remove();
    });
}

export function clearForm(form) {
    const inputs = form.querySelectorAll('input');
    inputs.forEach(input => {
      input.value = '';
    });
}

export function toggleVisibility(elementIds, visibleId) {
    elementIds.forEach(id => {
      document.getElementById(id).style.display = 'none';
    });
    document.getElementById(visibleId).style.display = 'block';
}

export function setEditMode(enabled) {
    const editButton = document.getElementById('edit-button');
    const saveButton = document.getElementById('save-button');
    const cancelButton = document.getElementById('cancel-button');
  
    if (enabled) {
      editButton.style.display = 'none';
      saveButton.style.display = 'inline-block';
      cancelButton.style.display = 'inline-block';
    } else {
      editButton.style.display = 'inline-block';
      saveButton.style.display = 'none';
      cancelButton.style.display = 'none';
    }
}