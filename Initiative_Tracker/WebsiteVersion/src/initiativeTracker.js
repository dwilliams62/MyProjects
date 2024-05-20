import { confirmRemoveCharacter, addStatusCondition,
    removeStatusCondition, changeHP, closePopup } from './it-functions.js';

class InitiativeTracker {
    constructor() {
        this.characters = [];
        this.currentTurn = 0;
    }

    addCharacter(character) {
        this.characters.push(character);
        this.sortInitiative();

        // Update currentTurn if new character has higher initiative
        if (this.characters.length > 1 && this.currentTurn < this.characters.length) {
            if (character.initiative > this.characters[this.currentTurn+1].initiative) {
                this.currentTurn++;
                if (this.currentTurn >= this.characters.length) {
                    this.currentTurn = 0; // Wrap around if needed
                }
            }
        } 

        this.displayInitiativeList(); // Update the display
    }

    sortInitiative() {
        this.characters.sort((a, b) => b.initiative - a.initiative);
    }

    nextTurn() {
        const endingTurn = this.characters[this.currentTurn];
        const startingTurn = this.characters[(this.currentTurn + 1) % this.characters.length];
        
        let foundStatus = false;
        
        // Check ending turn
        endingTurn.statusConditions = endingTurn.statusConditions.filter((status) => {
            const [condition, duration] = status;
        
            if (String(duration).endsWith("(E)")) { // Convert duration to a string
                foundStatus = true;
                console.log(`Don't forget, ${endingTurn.name} is ${condition}!`);
        
                if (String(duration).toLowerCase().includes('turn')) {
                    let turnsLeft = parseInt(String(duration).split(" ")[0]);
                    turnsLeft--;
                    if (turnsLeft === 0) {
                        console.log(`${endingTurn.name}'s ${condition} is over!`);
                        return false; // Remove from array
                    } else {
                        status[1] = `${turnsLeft} Turns (E)`;
                        return true; // Keep in array (update duration)
                    }
                }
            }
            return true; // Keep all other statuses
        });
        
        // Check starting turn
        startingTurn.statusConditions = startingTurn.statusConditions.filter((status) => {
            const [condition, duration] = status;
        
            if (String(duration).endsWith("(B)")) { // Convert duration to a string
                foundStatus = true;
                console.log(`Don't forget, ${startingTurn.name} is ${condition}!`);
        
                if (String(duration).toLowerCase().includes('turn')) {
                    let turnsLeft = parseInt(String(duration).split(" ")[0]);
                    turnsLeft--;
                    if (turnsLeft === 0) {
                        console.log(`${startingTurn.name}'s ${condition} is over!`);
                        return false; // Remove from array
                    } else {
                        status[1] = `${turnsLeft} Turns (B)`; // Update duration
                        return true; // Keep in array (update duration)
                    }
                }
            }
            return true; // Keep all other statuses
        });
        
        this.currentTurn = (this.currentTurn + 1) % this.characters.length;
        this.displayInitiativeList(); // Update the display
    }
    
    removeCharacter() {
        populatePopup('Remove Character', `
          <p>Are you sure you'd like to delete the selected characters?</p>
          <button id="confirmRemove-removeCharacter">Confirm</button>
          <button id="cancelRemove-removeCharacter">Cancel</button>
        `);
      
        const confirmRemove = document.getElementById('confirmRemove-removeCharacter');
        const cancelRemove = document.getElementById('cancelRemove-removeCharacter');
      
        confirmRemove.addEventListener('click', confirmRemoveCharacter.bind(this));
        cancelRemove.addEventListener('click', closePopup);
      }
      
      addStatusCondition() {
        populatePopup('Add Status Condition', `
          <label for="statusName-addStatusCondition">Enter status name:</label>
          <input type="text" id="statusName-addStatusCondition"><br><br>
          <label for="duration-addStatusCondition">Enter duration (Ex. 5 Turns(B) or 3 Turns (E)):</label>
          <input type="text" id="duration-addStatusCondition"><br><br>
          <button id="addStatus-addStatusCondition">Add Status</button>
          <button id="cancelStatus-addStatusCondition">Cancel</button>
        `);
      
        const addStatus = document.getElementById('addStatus-addStatusCondition');
        const cancelStatus = document.getElementById('cancelStatus-addStatusCondition');
      
        addStatus.addEventListener('click', () => {
          const status = document.getElementById('statusName-addStatusCondition').value;
          const durationInput = document.getElementById('duration-addStatusCondition').value;
          addStatusCondition.call(this, status, durationInput);
        });
      
        cancelStatus.addEventListener('click', closePopup);
      }
      
      removeStatusCondition() {
        populatePopup('Remove Status Condition', `
          <label for="statusToRemove-removeStatusCondition">Enter status to remove:</label>
          <input type="text" id="statusToRemove-removeStatusCondition"><br><br>
          <button id="removeStatus-removeStatusCondition">Remove Status</button>
          <button id="cancelRemoveStatus-removeStatusCondition">Cancel</button>
        `);
      
        const removeStatus = document.getElementById('removeStatus-removeStatusCondition');
        const cancelRemoveStatus = document.getElementById('cancelRemoveStatus-removeStatusCondition');
      
        removeStatus.addEventListener('click', () => {
          const status = document.getElementById('statusToRemove-removeStatusCondition').value;
          removeStatusCondition.call(this, status);
        });
      
        cancelRemoveStatus.addEventListener('click', closePopup);
      }
      
      changeHP() {
        populatePopup('Change HP', `
          <label for="hpChange-changeHP">Enter HP change (positive or negative):</label>
          <input type="number" id="hpChange-changeHP"><br><br>
          <button id="changeHPButton-changeHP">Change HP</button>
          <button id="cancelHP-changeHP">Cancel</button>
        `);
      
        const changeHPButton = document.getElementById('changeHPButton-changeHP');
        const cancelHPButton = document.getElementById('cancelHP-changeHP');
      
        changeHPButton.addEventListener('click', () => {
          const hpChange = parseInt(document.getElementById('hpChange-changeHP').value);
          changeHP.call(this, hpChange);
        });
      
        cancelHPButton.addEventListener('click', closePopup);
    }

    rollAttack() {
        let attackLog = document.getElementById("attackLog");
        let attackText = "--------\n";
    
        for (let i = 0; i < this.characters.length; i++) {
            const checkbox = document.getElementById(`checkbox_${i}`);
            if (checkbox.checked) {
                let character = this.characters[i];
                if (!character.attacks || character.attacks.length === 0) {
                    alert(`Character ${character.name} does not have any attacks.`);
                    continue;
                }
    
                let attack;
                if (character.attacks.length === 1) {
                    attack = character.attacks[0];
                } else {
                    let attackOptions = character.attacks.map((attack, index) => `${index + 1}. ${attack.name}`).join('\n');
                    let attackChoice = prompt(`Which attack would you like to perform for character ${character.name}?\n${attackOptions}`);
                    attack = character.attacks[parseInt(attackChoice) - 1];
                }
    
                let toHitRoll = Math.floor(Math.random() * 20) + 1; // Roll a d20
                let toHitTotal = toHitRoll + attack.toHitBonus;
    
                let damageMatch = attack.damage.match(/^(\d+)d(\d+)\+(\d+)$/);
                if (!damageMatch) {
                    alert(`Invalid damage format for character ${character.name}. Should be of the form '2d6+8'.`);
                    continue;
                }
    
                let numDice = parseInt(damageMatch[1]);
                let diceSize = parseInt(damageMatch[2]);
                let damageBonus = parseInt(damageMatch[3]);
    
                let damageRoll = 0;
                for (let j = 0; j < numDice; j++) {
                    damageRoll += Math.floor(Math.random() * diceSize) + 1; // Roll a dice of size diceSize
                }
                let damageTotal = damageRoll + damageBonus;
    
                attackText += `Character ${character.name} rolls an attack:` +
                              `\nTo Hit: ${toHitTotal} (${toHitRoll} + ${attack.toHitBonus})` +
                              `\nDamage: ${damageTotal} (${damageRoll} + ${damageBonus}) ${attack.damageType}\n--------\n`;
            }
        }
    
        attackText += "\n";
    
        attackLog.innerText = attackText + attackLog.innerText;
        let attackLines = attackLog.innerText.split("\n-------------\n");
        if (attackLines.length > 50) {
            attackLines.splice(50, attackLines.length - 50);
            attackLog.innerText = attackLines.join("\n-------------\n");
        }
    }

    displayInitiativeList() {
        const initiativeListDiv = document.getElementById("initiativeList");
        initiativeListDiv.innerHTML = ''; // Clear existing list

        if (this.characters.length === 0) {
            let noCharactersMessage = document.createElement('div');
            noCharactersMessage.textContent = 'No characters in this battle!';
            initiativeListDiv.appendChild(noCharactersMessage);
            return;
        }
    
        if (this.currentTurn === 0) {
            let newRoundSeparator = document.createElement('div');
            newRoundSeparator.textContent = 'NEW ROUND';
            newRoundSeparator.style.textAlign = 'center';
            newRoundSeparator.style.fontWeight = 'bold';
            newRoundSeparator.style.border = '1px solid green'; // add a green border
            initiativeListDiv.appendChild(newRoundSeparator);
        }
    
        for (let i = this.currentTurn; i < this.characters.length; i++) {
            initiativeListDiv.appendChild(this.createCharacterCard(i));
        }
    
        if (this.currentTurn !== 0) {
            let newRoundSeparator = document.createElement('div');
            newRoundSeparator.textContent = 'NEW ROUND';
            newRoundSeparator.style.textAlign = 'center';
            newRoundSeparator.style.fontWeight = 'bold';
            newRoundSeparator.style.border = '1px solid grey'; // add a grey border
            initiativeListDiv.appendChild(newRoundSeparator);
        }
    
        for (let i = 0; i < this.currentTurn; i++) {
            initiativeListDiv.appendChild(this.createCharacterCard(i));
        }

        const statusEffectsDiv = document.getElementById('statusEffects');
        statusEffectsDiv.innerHTML = ''; // Clear existing effects

        const currentCharacter = this.characters[this.currentTurn];

        const acDisplay = document.createElement('div');
        acDisplay.classList.add('it-status-effect');
        acDisplay.innerHTML = `<span>AC:</span> <span>${currentCharacter.ac}</span>`;
        statusEffectsDiv.appendChild(acDisplay);

        const healthDisplay = document.createElement('div');
        healthDisplay.classList.add('it-status-effect');
        healthDisplay.innerHTML = `<span>Health:</span> <span>${currentCharacter.currentHP}/${currentCharacter.maxHP}</span>`;
        statusEffectsDiv.appendChild(healthDisplay);

        const beginningOfTurnDisplay = document.createElement('div');
        beginningOfTurnDisplay.classList.add('it-status-effect');
        beginningOfTurnDisplay.innerHTML = '<span>Beginning of Turn:</span>';
        const beginningOfTurnList = document.createElement('ul');
        beginningOfTurnDisplay.appendChild(beginningOfTurnList);

        const endOfTurnDisplay = document.createElement('div');
        endOfTurnDisplay.classList.add('it-status-effect');
        endOfTurnDisplay.innerHTML = '<span>End of Turn:</span>';
        const endOfTurnList = document.createElement('ul');
        endOfTurnDisplay.appendChild(endOfTurnList);

        if (currentCharacter.statusConditions.length > 0) {
            currentCharacter.statusConditions.forEach((status) => {
                if (status[1].includes('(B)')) {
                    const beginningOfTurnListItem = document.createElement('li');
                    beginningOfTurnListItem.textContent = status[0];
                    beginningOfTurnList.appendChild(beginningOfTurnListItem);
                } else if (status[1].includes('(E)')) {
                    const endOfTurnListItem = document.createElement('li');
                    endOfTurnListItem.textContent = status[0];
                    endOfTurnList.appendChild(endOfTurnListItem);
                } else {
                    const statusDisplay = document.createElement('div');
                    statusDisplay.classList.add('it-status-effect');
                    statusDisplay.innerHTML = `<span>${status[0]}:</span> <span>${status[1]}</span>`;
                    statusEffectsDiv.appendChild(statusDisplay);
                }
            });
            if (beginningOfTurnList.children.length > 0) {
                statusEffectsDiv.appendChild(beginningOfTurnDisplay);
            }
            if (endOfTurnList.children.length > 0) {
                statusEffectsDiv.appendChild(endOfTurnDisplay);
            }
        } else {
            const noneDisplay = document.createElement('div');
            noneDisplay.classList.add('it-status-effect');
            noneDisplay.textContent = "No current status effects";
            statusEffectsDiv.appendChild(noneDisplay);
        }
    }

    createCharacterCard(index) {
        let characterCard = document.createElement('div');
        characterCard.classList.add('it-initiative-card');
        if (index === this.currentTurn) {
            characterCard.classList.add('current-turn'); // add the current-turn class
        }
    
        let characterNameDiv = document.createElement('div');
        characterNameDiv.classList.add('character-name');
    
        let checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `checkbox_${index}`;
    
        let characterName = document.createTextNode(this.characters[index].name);
    
        characterNameDiv.appendChild(checkbox);
        characterNameDiv.appendChild(characterName);
    
        let characterInfo = document.createElement('div');
        characterInfo.classList.add('character-info');
        characterInfo.innerHTML = `Initiative: ${this.characters[index].initiative} - AC: ${this.characters[index].ac} - Current HP: ${this.characters[index].currentHP}/${this.characters[index].maxHP}`;
    
        characterCard.appendChild(characterNameDiv);
        characterCard.appendChild(characterInfo);
    
        return characterCard;
    }
}

export default InitiativeTracker;

export function addCharacterManual(initiativeTracker) {
    let name = prompt("Enter character name: ");
    let initiative = parseInt(prompt("Enter character initiative: "));
    let ac =  parseInt(prompt("Enter character armor class: "));
    let currentHP =  parseInt(prompt("Enter character current HP: "));
    let maxHP = parseInt(prompt("Enter character max HP: "));

    let isHenchman = prompt("Is this character a henchman? (yes/no): ").toLowerCase();

    let attack;
    if (isHenchman === 'yes') {
        let attackName = prompt("Enter attack name: ");
        let attackToHitBonus = parseInt(prompt("Enter attack to hit bonus: "));
        let attackDamage = prompt("Enter attack damage (in the form of 1d6+3): ");
        let attackDamageType = prompt("Enter attack damage type: ");

        attack = {
            name: attackName,
            toHitBonus: attackToHitBonus,
            damage: attackDamage,
            damageType: attackDamageType
        };
    }

    initiativeTracker.addCharacter({
        name,
        initiative,
        ac,
        currentHP,
        maxHP,
        statusConditions: [],
        isHenchman,
        attack
    });
}

import { getCurrentData } from "./s3";

export async function addCharacterFromJSON(initiativeTracker) {
  const name = prompt("Enter character name: ");
  const count = parseInt(prompt("How many would you like to add? (default: 1)")) || 1;

  try {
    // Get the current data from S3 using the helper function.
    const jsonData = await getCurrentData();

    // Find the character with the given name
    const characterData = jsonData.find(char => char.name === name);

    if (characterData) {
      for (let i = 0; i < count; i++) {
        let initiative;
        if (count > 1) {
          const initiativeModifier = characterData.initiativeModifier;
          const roll = Math.floor(Math.random() * 20) + 1; // Roll a d20
          initiative = roll + initiativeModifier;
        } else {
          const initiativeInput = prompt("Enter initiative roll or type 'roll' to roll for you: ");
          if (!isNaN(parseInt(initiativeInput))) {
            initiative = parseInt(initiativeInput);
          } else {
            const initiativeModifier = characterData.initiativeModifier;
            const roll = Math.floor(Math.random() * 20) + 1; // Roll a d20
            initiative = roll + initiativeModifier;
          }
        }

        const character = {
          name: characterData.name,
          initiative,
          ac: characterData.ac,
          currentHP: characterData.maxHp,
          maxHP: characterData.maxHp,
          statusConditions: [],
        };

        if (characterData.attacks) {
          character.attacks = [];
          characterData.attacks.forEach(attack => {
            character.attacks.push({
              name: attack.name,
              toHitBonus: attack.toHitBonus,
              damage: attack.damage,
              damageType: attack.damageType,
              description: attack.description,
            });
          });
        }

        initiativeTracker.addCharacter(character);
      }
    } else {
      console.log(`No character found with name ${name}`);
    }
  } catch (error) {
    console.error(error);
  }
}

// Function to populate the popup
function populatePopup(title, content) {
  const popup = document.getElementById('popup');
  const popupContent = document.getElementById('popupContent');
  const popupClose = document.getElementById('popupClose');

  popup.style.display = 'block';
  popupContent.innerHTML = `
    <h2>${title}</h2>
    ${content}
  `;

  popupClose.onclick = () => {
    popup.style.display = 'none';
  };
}