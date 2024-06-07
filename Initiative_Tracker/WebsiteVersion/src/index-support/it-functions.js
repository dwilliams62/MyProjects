export function processStatusEffects(character, timing) {
  let foundStatus = false;

  character.statusConditions = character.statusConditions.filter((status) => {
      const [condition, duration] = status;

      if (String(duration).endsWith(`(${timing})`)) { 
          foundStatus = true;
          console.log(`Don't forget, ${character.name} is ${condition}!`);

          if (String(duration).toLowerCase().includes('turn')) {
              let turnsLeft = parseInt(String(duration).split(" ")[0]);
              turnsLeft--;
              if (turnsLeft === 0) {
                  console.log(`${character.name}'s ${condition} is over!`);
                  return false; 
              } else {
                  status[1] = `${turnsLeft} Turns (${timing})`;
                  return true; 
              }
          }
      }
      return true; 
  });

  return foundStatus;
}

export function updateCurrentTurn(characters, currentTurn, newCharacterInitiative) {
  if (characters.length > 1 && currentTurn < characters.length) {
      if (newCharacterInitiative > characters[currentTurn+1].initiative) {
          currentTurn++;
          if (currentTurn >= characters.length) {
              currentTurn = 0; // Wrap around if needed
          }
      }
  }
  return currentTurn;
}

export function closePopup() {
  document.getElementById('popup').style.display = 'none';
  // Clear the popup content
  document.getElementById('popupContent').innerHTML = '';
}

export function confirmRemoveCharacter() {
  var charactersRemoved = false;
  // Iterate in reverse because removing from the array messes with the index
  for (let i = this.characters.length-1; i >= 0; i--) {
    const checkbox = document.getElementById(`checkbox_${i}`);
    if (checkbox.checked) {
      charactersRemoved = true;
      // Adjust currentTurn if necessary (Do this at the end to not interfere with iteration)
      if (i <= this.currentTurn) { 
        this.currentTurn--; 
        if (this.currentTurn < 0) {
          this.currentTurn = this.characters.length -1; // Wrap around
        }
      }
      this.characters.splice(i, 1);  // Remove the character
    }
  }
  this.displayInitiativeList(); // Update the display
  if (!charactersRemoved) {
    alert(`No characters selected!`);
  }
  document.getElementById('popup').style.display = 'none';
}

export function addStatusCondition(status, durationInput) {
  var someoneChecked = false;
  
  // Extract numeric duration and type (B or E)
  let matches = durationInput.match(/(\d+)\s+Turns\s+\((B|E)\)/i);
  if (matches && matches.length === 3) {
    let duration = parseInt(matches[1]);
    let type = matches[2];
    let durationString = `${duration} Turns (${type})`;
  
    for (let i = 0; i < this.characters.length; i++) {
      const checkbox = document.getElementById(`checkbox_${i}`);
      if (checkbox.checked) {
        someoneChecked = true;
        this.characters[i].statusConditions.push([status, durationString]); 
      }
    }
  } else {
    console.error("Invalid duration format. Please use the format: '5 Turns(B)' or '3 Turns (E)'.");
  }

  if (!someoneChecked) {
    alert("No characters selected!");
  } else {
    this.displayInitiativeList(); // Update the display
  }
  document.getElementById('popup').style.display = 'none';
}

export function removeStatusCondition(status) {
  var someoneChecked = false;
  for (let i = 0; i < this.characters.length; i++) {
    const checkbox = document.getElementById(`checkbox_${i}`);
    if (checkbox.checked) {
      someoneChecked = true;
      this.characters[i].statusConditions = this.characters[i].statusConditions.filter(([c]) => c !== status);
    }
  }
  if (!someoneChecked) {
    alert("No characters selected!");
  } else {
    this.displayInitiativeList(); // Update the display
  }
  document.getElementById('popup').style.display = 'none';
}

export function changeHP(hpChange) {
  console.log("Change HP button clicked");
  const characters = this.characters;
  var hpChanged = false;
  for (let i = 0; i < characters.length; i++) {
    const checkbox = document.getElementById(`checkbox_${i}`);
    if (checkbox.checked) {
      hpChanged = true;
      let newHP = characters[i].currentHP + hpChange; 
      if (newHP < 0) {
        newHP = 0;
      } else if (newHP > characters[i].maxHP) {
        newHP = characters[i].maxHP;
      }
      characters[i].currentHP = newHP;
    }
  }
  this.displayInitiativeList(); 
  if (!hpChanged) {
    alert(`No characters selected!`);
  }
  document.getElementById('popup').style.display = 'none';
}

export function rollAttack(character, attackIndex) {
  // Roll a d20
  const toHitRoll = Math.floor(Math.random() * 20) + 1;
  const toHitTotal = toHitRoll + character.attacks[attackIndex].toHitBonus;

  // Roll damage
  const damageMatch = character.attacks[attackIndex].damage.match(/^(\d+)d(\d+)\+(\d+)$/);
  if (!damageMatch) {
    throw new Error(`Invalid damage format for character ${character.name}. Should be of the form '2d6+8'.`);
  }

  const numDice = parseInt(damageMatch[1]);
  const diceSize = parseInt(damageMatch[2]);
  const damageBonus = parseInt(damageMatch[3]);

  let damageRoll = 0;
  for (let j = 0; j < numDice; j++) {
    damageRoll += Math.floor(Math.random() * diceSize) + 1; // Roll a dice of size diceSize
  }
  const damageTotal = damageRoll + damageBonus;

  return {
    toHitTotal,
    damageTotal,
    damageType: character.attacks[attackIndex].damageType,
  };
}

export async function addCharacterFromJSON(character, initiativeTracker, initiativeValue) {
  try {
    let initiative;
    if (initiativeValue !== undefined) {
      initiative = initiativeValue;
    } else {
      const initiativeModifier = character.initiativeModifier;
      const roll = Math.floor(Math.random() * 20) + 1; // Roll a d20
      initiative = roll + initiativeModifier;
    }

    const characterToAdd = {
      name: character.name,
      initiative,
      ac: character.ac,
      currentHP: character.maxHp,
      maxHP: character.maxHp,
      statusConditions: [],
    };

    initiativeTracker.addCharacter(characterToAdd);
  } catch (error) {
    console.error(error);
  }
}