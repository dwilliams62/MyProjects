// Import necessary functions from other modules
import { 
  // Confirms the removal of a character from the initiative tracker
  confirmRemoveCharacter, 
  // Adds a status condition to a character
  addStatusCondition, 
  // Processes status effects for a character
  processStatusEffects, 
  // Updates the current turn in the initiative tracker
  updateCurrentTurn,
  // Removes a status condition from a character
  removeStatusCondition, 
  // Changes the HP of a character
  changeHP, 
  // Rolls an attack for a character
  rollAttack as rollAttackIT, 
  // Closes the popup
  closePopup 
} from './it-functions.js';

import { 
  // Creates a new round separator for the initiative list
  createNewRoundSeparator, 
  // Creates an AC display for a character
  createAcDisplay, 
  // Creates a health display for a character
  createHealthDisplay, 
  // Creates a status display for a character
  createStatusDisplay,
  // Creates a beginning of turn display for a character
  createBeginningOfTurnDisplay, 
  // Creates an end of turn display for a character
  createEndOfTurnDisplay 
} from './it-html.js';

import { 
  // Gets the current data from AWS S3
  getCurrentData 
} from "../aws-services/s3.js";

// InitiativeTracker class
class InitiativeTracker {
  // Constructor for the InitiativeTracker class
  constructor() {
    // Generate a random 6-digit ID for the initiative tracker
    this.id = Math.floor(Math.random() * 1000000);
    
    // Array to store characters in the initiative tracker
    // Each character object contains the following properties:
    // - name: The name of the character
    // - initiative: The initiative of the character
    // - ac: The armor class of the character
    // - currentHP: The current HP of the character
    // - maxHP: The maximum HP of the character
    // - statusConditions: An array of status conditions affecting the character
    // - isHenchman: A boolean indicating whether the character is a henchman
    // - attack: An object containing the character's attack information
    this.characters = [];
    
    // The current turn in the initiative tracker
    this.currentTurn = 0;
  }

  // ---------------------------------------------------------------
  // addCharacter function
  // ---------------------------------------------------------------
  // Adds a character to the initiative tracker
  // Parameters: character - The character object to add
  // Returns: None
  // ---------------------------------------------------------------
  addCharacter(character) {
    // Add the character to the characters array
    this.characters.push(character);
    
    // Sort the characters by initiative
    this.sortInitiative();
    
    // Update the current turn if the new character has higher initiative
    this.currentTurn = updateCurrentTurn(this.characters, this.currentTurn, character.initiative);

    // Update the display
    this.displayInitiativeList();
  }

  // ---------------------------------------------------------------
  // sortInitiative function
  // ---------------------------------------------------------------
  // Sorts the characters in the initiative tracker by initiative
  // Parameters: None
  // Returns: None
  // ---------------------------------------------------------------
  sortInitiative() {
    // Sort the characters in descending order by initiative
    this.characters.sort((a, b) => b.initiative - a.initiative);
  }

  // ---------------------------------------------------------------
  // nextTurn function
  // ---------------------------------------------------------------
  // Advances to the next turn in the initiative tracker
  // Parameters: None
  // Returns: None
  // ---------------------------------------------------------------
  nextTurn() {
    // Get the character whose turn is ending
    const endingTurn = this.characters[this.currentTurn];
    
    // Get the character whose turn is starting
    const startingTurn = this.characters[(this.currentTurn + 1) % this.characters.length];

    // Process status effects for the ending character
    processStatusEffects(endingTurn, 'E');
    
    // Process status effects for the starting character
    processStatusEffects(startingTurn, 'B');

    // Advance to the next turn
    this.currentTurn = (this.currentTurn + 1) % this.characters.length;
    
    // Update the display
    this.displayInitiativeList();
  }
  
  // ---------------------------------------------------------------
  // removeCharacter function
  // ---------------------------------------------------------------
  // Removes a character from the initiative tracker
  // Parameters: None
  // Returns: None
  // ---------------------------------------------------------------
  removeCharacter() {
    // Populate the popup with a confirmation message
    populatePopup('Remove Character', `
      <p>Are you sure you'd like to delete the selected characters?</p>
      <button id="confirmRemove-removeCharacter">Confirm</button>
      <button id="cancelRemove-removeCharacter">Cancel</button>
    `);
  
    // Get the confirm and cancel buttons
    const confirmRemove = document.getElementById('confirmRemove-removeCharacter');
    const cancelRemove = document.getElementById('cancelRemove-removeCharacter');
  
    // Add event listeners to the buttons
    confirmRemove.addEventListener('click', confirmRemoveCharacter.bind(this));
    cancelRemove.addEventListener('click', closePopup);
  }
  
  // ---------------------------------------------------------------
  // addStatusCondition function
  // ---------------------------------------------------------------
  // Adds a status condition to a character
  // Parameters: None
  // Returns: None
  // ---------------------------------------------------------------
  addStatusCondition() {
    // Populate the popup with a form to add a status condition
    populatePopup('Add Status Condition', `
      <label for="statusName-addStatusCondition">Enter status name:</label>
      <input type="text" id="statusName-addStatusCondition"><br><br>
      <label for="duration-addStatusCondition">Enter duration (Ex. 5 Turns(B) or 3 Turns (E)):</label>
      <input type="text" id="duration-addStatusCondition"><br><br>
      <button id="addStatus-addStatusCondition">Add Status</button>
      <button id="cancelStatus-addStatusCondition">Cancel</button>
    `);
  
    // Get the add and cancel buttons
    const addStatus = document.getElementById('addStatus-addStatusCondition');
    const cancelStatus = document.getElementById('cancelStatus-addStatusCondition');
  
    // Add event listeners to the buttons
    addStatus.addEventListener('click', () => {
      // Get the status name and duration from the form
      const status = document.getElementById('statusName-addStatusCondition').value;
      const durationInput = document.getElementById('duration-addStatusCondition').value;
      
      // Add the status condition to the character
      addStatusCondition.call(this, status, durationInput);
    });
  
    cancelStatus.addEventListener('click', closePopup);
  }
  
  // ---------------------------------------------------------------
  // removeStatusCondition function
  // ---------------------------------------------------------------
  // Removes a status condition from a character
  // Parameters: None
  // Returns: None
  // ---------------------------------------------------------------
  removeStatusCondition() {
    // Populate the popup with a form to remove a status condition
    populatePopup('Remove Status Condition', `
      <label for="statusToRemove-removeStatusCondition">Enter status to remove:</label>
      <input type="text" id="statusToRemove-removeStatusCondition"><br><br>
      <button id="removeStatus-removeStatusCondition">Remove Status</button>
      <button id="cancelRemoveStatus-removeStatusCondition">Cancel</button>
    `);
  
    // Get the remove and cancel buttons
    const removeStatus = document.getElementById('removeStatus-removeStatusCondition');
    const cancelRemoveStatus = document.getElementById('cancelRemoveStatus-removeStatusCondition');
  
    // Add event listeners to the buttons
    removeStatus.addEventListener('click', () => {
      // Get the status to remove from the form
      const status = document.getElementById('statusToRemove-removeStatusCondition').value;
      
      // Remove the status condition from the character
      removeStatusCondition.call(this, status);
    });
  
    cancelRemoveStatus.addEventListener('click', closePopup);
  }
  
  // ---------------------------------------------------------------
  // changeHP function
  // ---------------------------------------------------------------
  // Changes the HP of a character
  // Parameters: None
  // Returns: None
  // ---------------------------------------------------------------
  changeHP() {
    // Populate the popup with a form to change HP
    populatePopup('Change HP', `
      <label for="hpChange-changeHP">Enter HP change (positive or negative):</label>
      <input type="number" id="hpChange-changeHP"><br><br>
      <button id="changeHPButton-changeHP">Change HP</button>
      <button id="cancelHP-changeHP">Cancel</button>
    `);
  
    // Get the change and cancel buttons
    const changeHPButton = document.getElementById('changeHPButton-changeHP');
    const cancelHPButton = document.getElementById('cancelHP-changeHP');
  
    // Add event listeners to the buttons
    changeHPButton.addEventListener('click', () => {
      // Get the HP change from the form
      const hpChange = parseInt(document.getElementById('hpChange-changeHP').value);
      
      // Change the HP of the character
      changeHP.call(this, hpChange);
    });
  
    cancelHPButton.addEventListener('click', closePopup);
  }

  // ---------------------------------------------------------------
  // rollAttack function
  // ---------------------------------------------------------------
  // Rolls an attack for a character
  // Parameters: None
  // Returns: None
  // ---------------------------------------------------------------
  rollAttack() {
    // Get the selected characters
    const selectedCharacters = this.characters.filter((character, index) => {
      // Get the checkbox for the character
      const checkbox = document.getElementById(`checkbox_${index}`);
      return checkbox.checked;
    });
  
    // Check if any characters are selected
    if (selectedCharacters.length === 0) {
      // If not, display an error message
      alert("No characters selected!");
      return;
    }

    // Sort the selected characters by their position in the initiative tracker
    selectedCharacters.sort((a, b) => {
      // Get the indices of the characters in the initiative tracker
      const aIndex = (this.characters.indexOf(a) - this.currentTurn + this.characters.length) % this.characters.length;
      const bIndex = (this.characters.indexOf(b) - this.currentTurn + this.characters.length) % this.characters.length;
      return aIndex - bIndex;
    });
  
    // Get the attack log element
    let attackLog = document.getElementById("attackLog");
    
    // Initialize the current index
    let currentIndex = 0;
  
    // Function to show the next character's attacks
    function showNextCharacter() {
      // Check if all characters have been shown
      if (currentIndex >= selectedCharacters.length) {
        // If so, close the popup
        closePopup();
        return;
      }
  
      // Get the current character
      const character = selectedCharacters[currentIndex];
      
      // Populate the popup with the character's attacks
      const popupContent = document.getElementById('popupContent');
      popupContent.innerHTML = `
        <h2>${character.name}'s attacks</h2>
        <div class="it-popup-attacks-container">
        </div>
        <button id="cancel-button">Cancel</button>
        <button id="next-button">Next</button>
      `;
  
      // Get the cancel and next buttons
      const cancelButton = document.getElementById('cancel-button');
      cancelButton.addEventListener('click', closePopup);
  
      const nextButton = document.getElementById('next-button');
      nextButton.addEventListener('click', () => {
        // Show the next character's attacks
        currentIndex++;
        showNextCharacter();
      });
  
      // Get the attacks container
      const attacksContainer = popupContent.querySelector('.it-popup-attacks-container');
  
      // Check if the character has any attacks
      if (character.attacks && character.attacks.length > 0) {
        // If so, add each attack to the container
        character.attacks.forEach((attack, index) => {
          // Create an attack card
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
          
          // Add an event listener to the attack card
          attackCard.addEventListener('click', () => {
            // Roll the attack
            const attackResult = rollAttackIT(character, index);
            
            // Add the attack result to the attack log
            const attackText = `Character ${character.name} rolls an attack:` +
                               `\nTo Hit: ${attackResult.toHitTotal}` +
                               `\nDamage: ${attackResult.damageTotal} ${attackResult.damageType}\n--------\n`;
            attackLog.innerText = attackText + attackLog.innerText;
            
            // Limit the attack log to 50 entries
            const attackLines = attackLog.innerText.split("\n-------------\n");
            if (attackLines.length > 50) {
              attackLines.splice(50, attackLines.length - 50);
              attackLog.innerText = attackLines.join("\n-------------\n");
            }
            
            // Show the next character's attacks
            currentIndex++;
            showNextCharacter();
          });
          
          // Add the attack card to the container
          attacksContainer.appendChild(attackCard);
        });
      } else {
        // If not, display a message indicating that the character has no attacks
        const noAttacksMessage = document.createElement('p');
        noAttacksMessage.textContent = 'No attacks listed!';
        attacksContainer.appendChild(noAttacksMessage);
      }
  
      // Show the popup
      document.getElementById('popup').style.display = 'block';
    }
  
    // Show the first character's attacks
    showNextCharacter();
  }

  // ---------------------------------------------------------------
  // displayInitiativeList function
  // ---------------------------------------------------------------
  // Updates the display of the initiative tracker
  // Parameters: None
  // Returns: None
  // ---------------------------------------------------------------
  displayInitiativeList() {
    // Get the initiative list element
    const initiativeListDiv = document.getElementById("initiativeList");
    
    // Clear the existing list
    initiativeListDiv.innerHTML = '';
  
    // Check if there are any characters in the initiative tracker
    if (this.characters.length === 0) {
      // If not, display a message indicating that there are no characters
      let noCharactersMessage = document.createElement('div');
      noCharactersMessage.textContent = 'No characters in this battle!';
      initiativeListDiv.appendChild(noCharactersMessage);
      return;
    }
  
    // Check if it's the start of a new round
    if (this.currentTurn === 0) {
      // If so, add a new round separator
      initiativeListDiv.appendChild(createNewRoundSeparator('green'));
    }
  
    // Add each character to the initiative list
    for (let i = this.currentTurn; i < this.characters.length; i++) {
      initiativeListDiv.appendChild(this.createCharacterCard(i));
    }
  
    // Check if it's not the start of a new round
    if (this.currentTurn !== 0) {
      // If so, add a new round separator
      initiativeListDiv.appendChild(createNewRoundSeparator('grey'));
    }
  
    // Add each character that has already gone this round to the initiative list
    for (let i = 0; i < this.currentTurn; i++) {
      initiativeListDiv.appendChild(this.createCharacterCard(i));
    }

    // Get the status effects element
    const statusEffectsDiv = document.getElementById('statusEffects');
    
    // Clear the existing status effects
    statusEffectsDiv.innerHTML = '';
  
    // Get the current character
    const currentCharacter = this.characters[this.currentTurn];
  
    // Add the character's AC to the status effects
    const acDisplay = createAcDisplay(currentCharacter.ac);
    statusEffectsDiv.appendChild(acDisplay);
  
    // Add the character's health to the status effects
    const healthDisplay = createHealthDisplay(currentCharacter.currentHP, currentCharacter.maxHP);
    statusEffectsDiv.appendChild(healthDisplay);
  
    // Create beginning and end of turn displays
    const { beginningOfTurnDisplay, beginningOfTurnList } = createBeginningOfTurnDisplay();
    const { endOfTurnDisplay, endOfTurnList } = createEndOfTurnDisplay();
  
    // Check if the character has any status conditions
    if (currentCharacter.statusConditions.length > 0) {
      // If so, add each status condition to the status effects
      currentCharacter.statusConditions.forEach((status) => {
        // Check if the status condition occurs at the beginning of the turn
        if (status[1].includes('(B)')) {
          // If so, add it to the beginning of turn display
          const beginningOfTurnListItem = document.createElement('li');
          beginningOfTurnListItem.textContent = status[0];
          beginningOfTurnList.appendChild(beginningOfTurnListItem);
        } 
        // Check if the status condition occurs at the end of the turn
        else if (status[1].includes('(E)')) {
          // If so, add it to the end of turn display
          const endOfTurnListItem = document.createElement('li');
          endOfTurnListItem.textContent = status[0];
          endOfTurnList.appendChild(endOfTurnListItem);
        } 
        // If the status condition does not occur at the beginning or end of the turn, add it to the status effects
        else {
          const statusDisplay = createStatusDisplay(status);
          statusEffectsDiv.appendChild(statusDisplay);
        }
      });
      
      // Add the beginning and end of turn displays to the status effects
      if (beginningOfTurnList.children.length > 0) {
        statusEffectsDiv.appendChild(beginningOfTurnDisplay);
      }
      if (endOfTurnList.children.length > 0) {
        statusEffectsDiv.appendChild(endOfTurnDisplay);
      }
    } 
    // If the character has no status conditions, display a message indicating that
    else {
      const noneDisplay = document.createElement('div');
      noneDisplay.classList.add('it-status-effect');
      noneDisplay.textContent = "No current status effects";
      statusEffectsDiv.appendChild(noneDisplay);
    }
  }

  // ---------------------------------------------------------------
  // createCharacterCard function
  // ---------------------------------------------------------------
  // Creates a character card for the initiative tracker
  // Parameters: index - The index of the character in the initiative tracker
  // Returns: The character card element
  // ---------------------------------------------------------------
  createCharacterCard(index) {
    // Create the character card element
    let characterCard = document.createElement('div');
    characterCard.classList.add('it-initiative-card');
    
    // Check if it's the current character's turn
    if (index === this.currentTurn) {
      // If so, add the current-turn class to the character card
      characterCard.classList.add('current-turn');
    }
  
    // Create the character name element
    let characterNameDiv = document.createElement('div');
    characterNameDiv.classList.add('character-name');
  
    // Create a checkbox for the character
    let checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = `checkbox_${index}`;
  
    // Create the character name text
    let characterName = document.createTextNode(this.characters[index].name);
  
    // Add the checkbox and character name to the character name element
    characterNameDiv.appendChild(checkbox);
    characterNameDiv.appendChild(characterName);
  
    // Create the character info element
    let characterInfo = document.createElement('div');
    characterInfo.classList.add('character-info');
    characterInfo.innerHTML = `Initiative: ${this.characters[index].initiative} - AC: ${this.characters[index].ac} - Current HP: ${this.characters[index].currentHP}/${this.characters[index].maxHP}`;
  
    // Add the character name and info elements to the character card
    characterCard.appendChild(characterNameDiv);
    characterCard.appendChild(characterInfo);
  
    // Return the character card
    return characterCard;
  }
}

// Export the InitiativeTracker class
export default InitiativeTracker;

// ---------------------------------------------------------------
// addCharacterManual function
// ---------------------------------------------------------------
// Adds a character to the initiative tracker manually
// Parameters: initiativeTracker - The initiative tracker to add the character to
// Returns: None
// ---------------------------------------------------------------
export function addCharacterManual(initiativeTracker) {
  // Prompt the user for the character's name
  let name = prompt("Enter character name: ");
  
  // Prompt the user for the character's initiative
  let initiative = parseInt(prompt("Enter character initiative: "));
  
  // Prompt the user for the character's armor class
  let ac =  parseInt(prompt("Enter character armor class: "));
  
  // Prompt the user for the character's current HP
  let currentHP =  parseInt(prompt("Enter character current HP: "));
  
  // Prompt the user for the character's max HP
  let maxHP = parseInt(prompt("Enter character max HP: "));

  // Prompt the user to indicate whether the character is a henchman
  let isHenchman = prompt("Is this character a henchman? (yes/no): ").toLowerCase();

  // Initialize the character's attack
  let attack;
  
  // Check if the character is a henchman
  if (isHenchman === 'yes') {
    // If so, prompt the user for the attack's name
    let attackName = prompt("Enter attack name: ");
    
    // Prompt the user for the attack's to hit bonus
    let attackToHitBonus = parseInt(prompt("Enter attack to hit bonus: "));
    
    // Prompt the user for the attack's damage
    let attackDamage = prompt("Enter attack damage (in the form of 1d6+3): ");
    
    // Prompt the user for the attack's damage type
    let attackDamageType = prompt("Enter attack damage type: ");
  
    // Create the attack object
    attack = {
      name: attackName,
      toHitBonus: attackToHitBonus,
      damage: attackDamage,
      damageType: attackDamageType
    };
  }

  // Add the character to the initiative tracker
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

// ---------------------------------------------------------------
// populatePopup function
// ---------------------------------------------------------------
// Populates the popup with content
// Parameters: title - The title of the popup
//             content - The content of the popup
// Returns: None
// ---------------------------------------------------------------
export function populatePopup(title, content) {
  // Get the popup element
  const popup = document.getElementById('popup');
  
  // Get the popup content element
  const popupContent = document.getElementById('popupContent');
  
  // Get the popup close button
  const popupClose = document.getElementById('popupClose');

  // Show the popup
  popup.style.display = 'block';
  
  // Set the popup content
  popupContent.innerHTML = `
    <h2>${title}</h2>
    ${content}
  `;
  
  // Add an event listener to the popup close button
  popupClose.onclick = () => {
    // Hide the popup
    popup.style.display = 'none';
  };
}