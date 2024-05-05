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
    
    removeCharacter() {
        var charactersRemoved = false;
        // Iterate in reverse because removing from the array messes with the index
        for (let i = initiativeTracker.characters.length-1; i >= 0; i--) {
            const checkbox = document.getElementById(`checkbox_${i}`);
            if (checkbox.checked) {
                charactersRemoved = true;
                // Adjust currentTurn if necessary (Do this at the end to not interfere with iteration)
                if (i <= initiativeTracker.currentTurn) { 
                    initiativeTracker.currentTurn--; 
                    if (initiativeTracker.currentTurn < 0) {
                        initiativeTracker.currentTurn = initiativeTracker.characters.length -1; // Wrap around
                    }
                }
                initiativeTracker.characters.splice(i, 1);  // Remove the character
            }
        }
        displayInitiativeList(); // Update the display
        if (!charactersRemoved) {
            alert(`No characters selected!`);
        }
    },
    
    addStatusCondition() {
        let status = prompt("Enter status name: ");
        let durationInput = prompt("Enter duration (Ex. 5 Turns(B) or 3 Turns (E)): ");
        var someoneChecked = false;
    
        // Extract numeric duration and type (B or E)
        let matches = durationInput.match(/(\d+)\s+Turns\s+\((B|E)\)/i);
        if (matches && matches.length === 3) {
            let duration = parseInt(matches[1]);
            let type = matches[2];
            let durationString = `${duration} Turns (${type})`;
    
            for (let i = 0; i < initiativeTracker.characters.length; i++) {
                const checkbox = document.getElementById(`checkbox_${i}`);
                if (checkbox.checked) {
                    someoneChecked = true;
                    initiativeTracker.characters[i].statusConditions.push([status, durationInput]); 
                }
            }
        } else {
            console.error("Invalid duration format. Please use the format: '5 Turns(B)' or '3 Turns (E)'.");
        }

        if (!someoneChecked) {
            alert("No characters selected!");
        } else {
            displayInitiativeList(); // Update the display
        }
    },
    
    removeStatusCondition() {
        let status = prompt("Enter status to remove: ");
        var someoneChecked = false;
        for (let i = 0; i < initiativeTracker.characters.length; i++) {
            const checkbox = document.getElementById(`checkbox_${i}`);
            if (checkbox.checked) {
                someoneChecked = true;
                initiativeTracker.characters[i].statusConditions = initiativeTracker.characters[i].statusConditions.filter(([c]) => c !== status);
            }
        }
        if (!someoneChecked) {
            alert("No characters selected!");
        } else {
            displayInitiativeList(); // Update the display
        }
    },

    changeHP() {
        const characters = initiativeTracker.characters;
        let hpChange = parseInt(prompt("Enter HP change (positive or negative):"));
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
        displayInitiativeList(); 
        if (!hpChanged) {
            alert(`No characters selected!`);
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
        let checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `checkbox_${index}`; // Set the checkbox ID
        if (index === initiativeTracker.currentTurn) {
            characterDisplay.innerHTML = `==> ${checkbox.outerHTML} ${character.name} - Initiative: ${character.initiative} - AC: ${character.ac} - Current HP: ${character.currentHP}/${character.maxHP} <==`;  
        } else {
            characterDisplay.innerHTML = `${checkbox.outerHTML} ${character.name} - Initiative: ${character.initiative} - AC: ${character.ac} - Current HP: ${character.currentHP}/${character.maxHP}`;
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

document.getElementById('addCharacter').addEventListener('click', addCharacter);
document.getElementById('nextTurn').addEventListener('click', function() {initiativeTracker.nextTurn();});
document.getElementById('addStatus').addEventListener('click', function() {initiativeTracker.addStatusCondition();});
document.getElementById('removeStatus').addEventListener('click', function() {initiativeTracker.removeStatusCondition();});
document.getElementById('changeHP').addEventListener('click', function() {initiativeTracker.changeHP();});
document.getElementById('removeCharacter').addEventListener('click', function() {initiativeTracker.removeCharacter();});

document.getElementById('toggleSidebar').addEventListener('click', function() {
    document.querySelector('.sidebar').classList.toggle('collapsed');
});

