import { confirmRemoveCharacter, addStatusCondition, processStatusEffects, updateCurrentTurn,
    removeStatusCondition, changeHP, rollAttack as rollAttackIT, closePopup } from './it-functions.js';
import { createNewRoundSeparator, createAcDisplay, createHealthDisplay, createStatusDisplay,
      createBeginningOfTurnDisplay, createEndOfTurnDisplay } from './it-html.js';
import { getCurrentData } from "../aws-services/s3.js";

class InitiativeTracker {
    constructor() {
      this.id = Math.floor(Math.random() * 1000000); // Generate a random 6-digit ID
      this.characters = [];
      this.currentTurn = 0;
    }

    addCharacter(character) {
        this.characters.push(character);
        this.sortInitiative();
                // Update currentTurn if new character has higher initiative
        this.currentTurn = updateCurrentTurn(this.characters, this.currentTurn, character.initiative);

        this.displayInitiativeList(); // Update the display
    }

    sortInitiative() {
        this.characters.sort((a, b) => b.initiative - a.initiative);
    }

    nextTurn() {
        const endingTurn = this.characters[this.currentTurn];
        const startingTurn = this.characters[(this.currentTurn + 1) % this.characters.length];

        processStatusEffects(endingTurn, 'E');
        processStatusEffects(startingTurn, 'B');

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
      const selectedCharacters = this.characters.filter((character, index) => {
        const checkbox = document.getElementById(`checkbox_${index}`);
        return checkbox.checked;
      });
    
      if (selectedCharacters.length === 0) {
        alert("No characters selected!");
        return;
      }

      selectedCharacters.sort((a, b) => {
        const aIndex = (this.characters.indexOf(a) - this.currentTurn + this.characters.length) % this.characters.length;
        const bIndex = (this.characters.indexOf(b) - this.currentTurn + this.characters.length) % this.characters.length;
        return aIndex - bIndex;
      });
    
      let attackLog = document.getElementById("attackLog");
      let currentIndex = 0;
    
      function showNextCharacter() {
        if (currentIndex >= selectedCharacters.length) {
          closePopup();
          return;
        }
    
        const character = selectedCharacters[currentIndex];
        const popupContent = document.getElementById('popupContent');
        popupContent.innerHTML = `
          <h2>${character.name}'s attacks</h2>
          <div class="it-popup-attacks-container">
          </div>
          <button id="cancel-button">Cancel</button>
          <button id="next-button">Next</button>
        `;
    
        const cancelButton = document.getElementById('cancel-button');
        cancelButton.addEventListener('click', closePopup);
    
        const nextButton = document.getElementById('next-button');
        nextButton.addEventListener('click', () => {
          currentIndex++;
          showNextCharacter();
        });
    
        const attacksContainer = popupContent.querySelector('.it-popup-attacks-container');
    
        if (character.attacks && character.attacks.length > 0) {
          character.attacks.forEach((attack, index) => {
            const attackCard = document.createElement('div');
            attackCard.className = 'it-popup-attack-card';
            attackCard.innerHTML = `
              <div class="it-popup-attack-header">
                <h3>${attack.name}</h3>
              </div>
              <p>${attack.description || 'No description provided'}</p>
              <hr>
              <div class="it-popup-attack-info">
                <p><b>To Hit Bonus:</b> +${attack.toHitBonus} | <b>Attack Damage:</b> ${attack.damage} <span>${attack.damageType}</span></p>
              </div>
            `;
            attackCard.addEventListener('click', () => {
              const attackResult = rollAttackIT(character, index);
              const attackText = `Character ${character.name} rolls an attack:` +
                                 `\nTo Hit: ${attackResult.toHitTotal}` +
                                 `\nDamage: ${attackResult.damageTotal} ${attackResult.damageType}\n--------\n`;
              attackLog.innerText = attackText + attackLog.innerText;
              const attackLines = attackLog.innerText.split("\n-------------\n");
              if (attackLines.length > 50) {
                attackLines.splice(50, attackLines.length - 50);
                attackLog.innerText = attackLines.join("\n-------------\n");
              }
              currentIndex++;
              showNextCharacter();
            });
            attacksContainer.appendChild(attackCard);
          });
        } else {
          const noAttacksMessage = document.createElement('p');
          noAttacksMessage.textContent = 'No attacks listed!';
          attacksContainer.appendChild(noAttacksMessage);
        }
    
        document.getElementById('popup').style.display = 'block';
      }
    
      showNextCharacter();
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
          initiativeListDiv.appendChild(createNewRoundSeparator('green'));
        }
    
        for (let i = this.currentTurn; i < this.characters.length; i++) {
          initiativeListDiv.appendChild(this.createCharacterCard(i));
        }
    
        if (this.currentTurn !== 0) {
          initiativeListDiv.appendChild(createNewRoundSeparator('grey'));
        }
    
        for (let i = 0; i < this.currentTurn; i++) {
          initiativeListDiv.appendChild(this.createCharacterCard(i));
        }

        const statusEffectsDiv = document.getElementById('statusEffects');
        statusEffectsDiv.innerHTML = ''; // Clear existing effects

        const currentCharacter = this.characters[this.currentTurn];

        const acDisplay = createAcDisplay(currentCharacter.ac);
        statusEffectsDiv.appendChild(acDisplay);
    
        const healthDisplay = createHealthDisplay(currentCharacter.currentHP, currentCharacter.maxHP);
        statusEffectsDiv.appendChild(healthDisplay);
    
        const { beginningOfTurnDisplay, beginningOfTurnList } = createBeginningOfTurnDisplay();
        const { endOfTurnDisplay, endOfTurnList } = createEndOfTurnDisplay();
    
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
                    const statusDisplay = createStatusDisplay(status);
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

// Function to populate the popup
export function populatePopup(title, content) {
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