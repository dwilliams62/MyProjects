import { getCurrentData, writeDataToS3 } from "./s3";
import { createCard } from './characterCard.js';

// Define the bucket and object key.
const bucketName = "custom-character-info";
const objectKey = "test-character/character.json";

// Function to collect data from user
function collectData() {
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

// Function to collect attack data from user
function collectAttackData() {
  const characterName = document.getElementById('character-name').value;
  const attackName = document.getElementById('attack-name').value;
  const attackToHitBonus = parseInt(document.getElementById('attack-to-hit-bonus').value);
  const attackDamage = document.getElementById('attack-damage').value;
  const attackDamageType = document.getElementById('attack-damage-type').value;

  return {
    characterName,
    attackName,
    attackToHitBonus,
    attackDamage,
    attackDamageType,
  };
}


// Function to add character to S3
async function addCharacterToS3() {
  try {
    // Collect new data from user
    const newData = collectData();

    // Get the current data from S3
    let jsonData = await getCurrentData();

    // Append the new data to the existing data
    jsonData.push(newData);

    // Write the new data to S3
    await writeDataToS3(jsonData);
  } catch (error) {
    console.error(error);
  }
}

// Function to add attack to character
async function addAttackToCharacter() {
  try {
    // Collect new attack data from user
    const newAttackData = collectAttackData();

    // Get the current data from S3
    let jsonData = await getCurrentData();

    // Find the character with the matching name
    const characterIndex = jsonData.findIndex((character) => character.name === newAttackData.characterName);

    if (characterIndex !== -1) {
      // If the character exists, add the new attack to their attacks array
      if (!jsonData[characterIndex].attacks) {
        jsonData[characterIndex].attacks = [];
      }
      jsonData[characterIndex].attacks.push({
        name: newAttackData.attackName,
        toHitBonus: newAttackData.attackToHitBonus,
        damage: newAttackData.attackDamage,
        damageType: newAttackData.attackDamageType,
      });
    } else {
      console.error(`Character not found: ${newAttackData.characterName}`);
      return;
    }

    // Write the new data to S3
    await writeDataToS3(jsonData);
  } catch (error) {
    console.error(error);
  }
}


export async function displayCharactersFromJSON() {
  try {
    // Get the current data from S3
    const jsonData = await getCurrentData();

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


document.getElementById('submit-button').addEventListener('click', async (event) => {
  event.preventDefault();
  await addCharacterToS3();
});

document.getElementById('submit-attack-button').addEventListener('click', async (event) => {
  event.preventDefault();
  await addAttackToCharacter();
});

document.getElementById("add-character-button").addEventListener("click", function() {
  document.getElementById("character-form-container").style.display = "block";
  document.getElementById("attack-form-container").style.display = "none";
  document.getElementById("character-card-container").style.display = "none";
});

document.getElementById("add-attack-button").addEventListener("click", function() {
  document.getElementById("character-form-container").style.display = "none";
  document.getElementById("attack-form-container").style.display = "block";
  document.getElementById("character-card-container").style.display = "none";
});

document.getElementById("view-characters-button").addEventListener("click", function() {
  document.getElementById("character-form-container").style.display = "none";
  document.getElementById("attack-form-container").style.display = "none";
  document.getElementById("character-card-container").style.display = "block";

  displayCharactersFromJSON();
});

document.getElementById("edit-button").addEventListener("click", function() {
  document.getElementById("edit-button").style.display = "none";
  document.getElementById("save-button").style.display = "inline-block";
  document.getElementById("cancel-button").style.display = "inline-block";
});

document.getElementById("save-button").addEventListener("click", function() {
  document.getElementById("save-button").style.display = "none";
  document.getElementById("cancel-button").style.display = "none";
  document.getElementById("edit-button").style.display = "inline-block";
});

document.getElementById("cancel-button").addEventListener("click", function() {
  document.getElementById("save-button").style.display = "none";
  document.getElementById("cancel-button").style.display = "none";
  document.getElementById("edit-button").style.display = "inline-block";
});

const editButton = document.getElementById('edit-button');
const cancelButton = document.getElementById('cancel-button');
const cardContainer = document.getElementById('cards');

editButton.addEventListener('click', () => {
  const textElements = cardContainer.querySelectorAll('h3, p');
  textElements.forEach(element => {
    element.contentEditable = true;
  });
});

cancelButton.addEventListener('click', () => {
  displayCharactersFromJSON();
});