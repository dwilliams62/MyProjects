export function createNewRoundSeparator(borderColor) {
    let newRoundSeparator = document.createElement('div');
    newRoundSeparator.textContent = 'NEW ROUND';
    newRoundSeparator.style.textAlign = 'center';
    newRoundSeparator.style.fontWeight = 'bold';
    newRoundSeparator.style.border = `1px solid ${borderColor}`;
    return newRoundSeparator;
}

export function createAcDisplay(ac) {
    const acDisplay = document.createElement('div');
    acDisplay.classList.add('it-status-effect');
    acDisplay.innerHTML = `<span>AC:</span> <span>${ac}</span>`;
    return acDisplay;
}

export function createHealthDisplay(currentHP, maxHP) {
    const healthDisplay = document.createElement('div');
    healthDisplay.classList.add('it-status-effect');
    healthDisplay.innerHTML = `<span>Health:</span> <span>${currentHP}/${maxHP}</span>`;
    return healthDisplay;
}

export function createStatusDisplay(status) {
    const statusDisplay = document.createElement('div');
    statusDisplay.classList.add('it-status-effect');
    statusDisplay.innerHTML = `<span>${status[0]}:</span> <span>${status[1]}</span>`;
    return statusDisplay;
}

export function createBeginningOfTurnDisplay() {
    const beginningOfTurnDisplay = document.createElement('div');
    beginningOfTurnDisplay.classList.add('it-status-effect');
    beginningOfTurnDisplay.innerHTML = '<span>Beginning of Turn:</span>';
    const beginningOfTurnList = document.createElement('ul');
    beginningOfTurnDisplay.appendChild(beginningOfTurnList);
    return { beginningOfTurnDisplay, beginningOfTurnList };
}

export function createEndOfTurnDisplay() {
    const endOfTurnDisplay = document.createElement('div');
    endOfTurnDisplay.classList.add('it-status-effect');
    endOfTurnDisplay.innerHTML = '<span>End of Turn:</span>';
    const endOfTurnList = document.createElement('ul');
    endOfTurnDisplay.appendChild(endOfTurnList);
    return { endOfTurnDisplay, endOfTurnList };
}