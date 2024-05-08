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
    }
    
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
    }
    
    removeStatusCondition() {
        let status = prompt("Enter status to remove: ");
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
    }

    changeHP() {
        const characters = this.characters;
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
        this.displayInitiativeList(); 
        if (!hpChanged) {
            alert(`No characters selected!`);
        }
    }

    rollAttack() {
        let attackLog = document.getElementById("attackLog");
        let attackText = "--------\n";

        for (let i = 0; i < this.characters.length; i++) {
            const checkbox = document.getElementById(`checkbox_${i}`);
            if (checkbox.checked) {
                let character = this.characters[i];
                if (!character.attack) {
                    alert(`Character ${character.name} does not have an attack.`);
                    continue;
                }

                let toHitRoll = Math.floor(Math.random() * 20) + 1; // Roll a d20
                let toHitTotal = toHitRoll + character.attack.toHitBonus;

                let damageMatch = character.attack.damage.match(/^(\d+)d(\d+)\+(\d+)$/);
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
                              `\nTo Hit: ${toHitTotal} (${toHitRoll} + ${character.attack.toHitBonus})` +
                              `\nDamage: ${damageTotal} (${damageRoll} + ${damageBonus}) ${character.attack.damageType}\n--------\n`;
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

        this.characters.forEach((character, index) => {
            let characterDisplay = document.createElement('div');
            let checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `checkbox_${index}`; // Set the checkbox ID
            if (index === this.currentTurn) {
                characterDisplay.innerHTML = `==> ${checkbox.outerHTML} ${character.name} - Initiative: ${character.initiative} - AC: ${character.ac} - Current HP: ${character.currentHP}/${character.maxHP} <==`;  
            } else {
                characterDisplay.innerHTML = `${checkbox.outerHTML} ${character.name} - Initiative: ${character.initiative} - AC: ${character.ac} - Current HP: ${character.currentHP}/${character.maxHP}`;
            }
            initiativeListDiv.appendChild(characterDisplay);  
        });

        const statusEffectsDiv = document.getElementById('statusEffects');
        statusEffectsDiv.innerHTML = ''; // Clear existing effects

        const currentCharacter = this.characters[this.currentTurn];

        const acDisplay = document.createElement('div');
        acDisplay.classList.add('status-effect');
        acDisplay.innerHTML = `<span>AC:</span> <span>${currentCharacter.ac}</span>`;
        statusEffectsDiv.appendChild(acDisplay);

        const healthDisplay = document.createElement('div');
        healthDisplay.classList.add('status-effect');
        healthDisplay.innerHTML = `<span>Health:</span> <span>${currentCharacter.currentHP}/${currentCharacter.maxHP}</span>`;
        statusEffectsDiv.appendChild(healthDisplay);

        const beginningOfTurnDisplay = document.createElement('div');
        beginningOfTurnDisplay.classList.add('status-effect');
        beginningOfTurnDisplay.innerHTML = '<span>Beginning of Turn:</span>';
        const beginningOfTurnList = document.createElement('ul');
        beginningOfTurnDisplay.appendChild(beginningOfTurnList);

        const endOfTurnDisplay = document.createElement('div');
        endOfTurnDisplay.classList.add('status-effect');
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
                    statusDisplay.classList.add('status-effect');
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
            noneDisplay.classList.add('status-effect');
            noneDisplay.textContent = "No current status effects";
            statusEffectsDiv.appendChild(noneDisplay);
        }
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