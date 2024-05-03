let initiativeTracker = {
    characters: [],
    currentTurn: 0, 

    addCharacter(name, initiative, ac, currentHP, maxHP) {
        this.characters.push({
            name: name,
            initiative: initiative,
            ac: ac,
            currentHP: currentHP,
            maxHP: maxHP,
            statusConditions: []
        });
        this.sortInitiative();

        // Update currentTurn if new character has higher initiative
        if (this.characters.length > 1 && this.currentTurn < this.characters.length) {
            if (initiative > this.characters[this.currentTurn+1].initiative) {
                this.currentTurn++;
                if (this.currentTurn >= this.characters.length) {
                    this.currentTurn = 0; // Wrap around if needed
                }
            }
        } 

        displayInitiativeList(); // Update the display
    },

    sortInitiative() {
        this.characters.sort((a, b) => b.initiative - a.initiative);
    },

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
        displayInitiativeList(); // Update the display
    },
    
    addStatusCondition(name, condition, duration) {
        const character = this.characters.find((char) => char.name === name);
        if (character) {
            character.statusConditions.push([condition, duration]);
        } else {
            console.error(`Character '${name}' not found!`);
        }
    },
    
    removeStatusCondition(name, condition) {
        const character = this.characters.find((char) => char.name === name);
        if (character) {
            character.statusConditions = character.statusConditions.filter(([c]) => c !== condition);
        } else {
            console.error(`Character '${name}' not found!`);
        }
    },

    changeHP(name, hpChange) {
        const character = this.characters.find((char) => char.name === name);
        if (character) {
            let newHP = character.currentHP + hpChange;

            // Apply restrictions
            if (newHP < 0) {
                newHP = 0;
            } else if (newHP > character.maxHP) {
                newHP = character.maxHP;
            }

            character.currentHP = newHP;
            displayInitiativeList(); // Update the display
        } else {
            console.error(`Character '${name}' not found!`);
        }
    },

    removeCharacter(name) {
        const index = this.characters.findIndex((char) => char.name === name);
        if (index !== -1) {
            // Adjust currentTurn if necessary 
            if (index < this.currentTurn) {
                this.currentTurn--; 
            }
            if (this.currentTurn >= this.characters.length-1) {
                this.currentTurn = 0;
            }

            this.characters.splice(index, 1);  // Remove the character
            displayInitiativeList(); // Update the display
        } else {
            console.error(`Character '${name}' not found!`);
        }
    }
};

function addCharacter() {
    let name = prompt("Enter character name: ");
    let initiative = parseInt(prompt("Enter character initiative: "));
    let ac =  parseInt(prompt("Enter character armor class: "));
    let currentHP =  parseInt(prompt("Enter character current HP: "));
    let maxHP = parseInt(prompt("Enter character max HP: "));

    initiativeTracker.addCharacter(name, initiative, ac, currentHP, maxHP); 
    displayInitiativeList(); // Update the display
}

function displayInitiativeList() {
    const initiativeListDiv = document.getElementById("initiativeList");
    initiativeListDiv.innerHTML = ''; // Clear existing list

    initiativeTracker.characters.forEach((character, index) => {
        let characterDisplay = document.createElement('div');
        if (index === initiativeTracker.currentTurn) {
            characterDisplay.innerHTML = `==> ${character.name} - Initiative: ${character.initiative} - AC: ${character.ac} - Current HP: ${character.currentHP}/${character.maxHP} <==`;  
        } else {
            characterDisplay.innerHTML = `${character.name} - Initiative: ${character.initiative} - AC: ${character.ac} - Current HP: ${character.currentHP}/${character.maxHP}`;
        }
        initiativeListDiv.appendChild(characterDisplay);  
    });

    const statusEffectsDiv = document.getElementById('statusEffects');
    statusEffectsDiv.innerHTML = ''; // Clear existing effects

    const currentCharacter = initiativeTracker.characters[initiativeTracker.currentTurn];
    if (currentCharacter.statusConditions.length > 0) {
        currentCharacter.statusConditions.forEach((status) => {
            const statusDisplay = document.createElement('div');
            statusDisplay.textContent = `${status[0]}: ${status[1]}`; 
            statusEffectsDiv.appendChild(statusDisplay); 
        });
    } else {
        const noneDisplay = document.createElement('div');
        noneDisplay.textContent = "No current status effects";
        statusEffectsDiv.appendChild(noneDisplay);
    }
}

function addStatusCondition() {
    let name = prompt("Enter character name: ");
    let status = prompt("Enter status name: ");
    let durationInput = prompt("Enter duration (Ex. 5 Turns(B) or 3 Turns (E)): ");

    // Extract numeric duration and type (B or E)
    let matches = durationInput.match(/(\d+)\s+Turns\s+\((B|E)\)/i);
    if (matches && matches.length === 3) {
        let duration = parseInt(matches[1]);
        let type = matches[2];
        let durationString = `${duration} Turns (${type})`;

        initiativeTracker.addStatusCondition(name, status, durationString);
        displayInitiativeList(); // Update the display
    } else {
        console.error("Invalid duration format. Please use the format: '5 Turns(B)' or '3 Turns (E)'.");
    }
}


function removeStatusCondition() {
    let name = prompt("Enter character name: ");
    let status = prompt("Enter status to remove: ");

    initiativeTracker.removeStatusCondition(name, status); 
    displayInitiativeList(); // Update the display
}

document.getElementById('addCharacter').addEventListener('click', addCharacter);
document.getElementById('nextTurn').addEventListener('click', () => initiativeTracker.nextTurn());
document.getElementById('addStatus').addEventListener('click', addStatusCondition);
document.getElementById('removeStatus').addEventListener('click', removeStatusCondition);

document.getElementById('toggleSidebar').addEventListener('click', function() {
    document.querySelector('.sidebar').classList.toggle('collapsed');
});

document.getElementById('changeHP').addEventListener('click', function() {
    let name = prompt("Enter character name:");
    let hpChange = parseInt(prompt("Enter HP change (positive or negative):"));
    initiativeTracker.changeHP(name, hpChange); 
});

document.getElementById('removeCharacter').addEventListener('click', function() {
    let name = prompt("Enter the character name to remove: ");
    initiativeTracker.removeCharacter(name); 
});

