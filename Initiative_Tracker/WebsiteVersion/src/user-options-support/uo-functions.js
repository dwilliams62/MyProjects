import { getCurrentData, writeDataToS3 } from '../aws-services/s3.js';
import { collectData, collectAttackData } from './uo-html.js';

export async function addCharacterToS3() {
  try {
    // Collect new data from user
    const newData = collectData();

    // Get the current data from S3
    let jsonData = await getCurrentData();

    // Append the new data to the existing data
    jsonData.push(newData);

    //sort the data
    jsonData.sort((a, b) => a.name.localeCompare(b.name));

    // Write the new data to S3
    await writeDataToS3(jsonData);
  } catch (error) {
    console.error(error);
  }
}

export async function addAttackToCharacter() {
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
        description: newAttackData.attackDescription,
        toHitBonus: newAttackData.attackToHitBonus,
        damage: newAttackData.attackDamage,
        damageType: newAttackData.attackDamageType,
      });
      jsonData[characterIndex].attacks.sort((a, b) => a.name.localeCompare(b.name));
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

export async function updateJSONData() {
  const currentData = await getCurrentData();
  const cardContainer = document.getElementById('cards');
  const characterCards = cardContainer.querySelectorAll('.character-card');

  // Loop through each character card
  characterCards.forEach((card, index) => {
    const textElements = card.querySelectorAll('h3 i, p i');
    const characterData = currentData[index];

    // Loop through each editable field in the card
    textElements.forEach((element) => {
      if (element.classList.contains('edited')) {
        const key = element.parentNode.childNodes[0].textContent.replace(':', '').trim().toLowerCase();

        // Update the corresponding field in the character data
        switch(key) {
          case 'name':
            characterData.name = element.textContent;
            break;
          case 'hp':
            const hpValues = element.textContent.split('/');
            characterData.currentHp = hpValues[0];
            characterData.maxHp = hpValues[1];
            break;
          case 'ac':
            characterData.ac = element.textContent;
            break;
          case 'speed':
            characterData.speed = element.textContent;
            break;
          case 'initiative modifier':
            characterData.initiativeModifier = element.textContent;
            break;
          case 'spell casting modifier':
            characterData.spellCastingModifier = element.textContent;
            break;
          case 'spell save dc':
            characterData.spellSaveDc = element.textContent;
            break;
        }

        // Remove the 'edited' class
        element.classList.remove('edited');
      }
    });
  });

  // Write the updated data back to S3
  writeDataToS3(currentData);
}

export async function isCharacterListEmpty() {
    try {
      const jsonData = await getCurrentData();
      return jsonData.length === 0;
    } catch (error) {
      console.error(error);
    }
}

export async function deleteData() {
    try {
      const jsonData = await getCurrentData();
      const emptyJson = {};
      await writeDataToS3(emptyJson);
      console.log('Data deleted successfully');
    } catch (error) {
      console.error('Error deleting data:', error);
    }
}