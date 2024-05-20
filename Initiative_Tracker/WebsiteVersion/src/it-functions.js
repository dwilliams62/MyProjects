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