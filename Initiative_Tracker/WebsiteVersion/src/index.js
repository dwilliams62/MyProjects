import InitiativeTracker from './index-support/initiativeTracker.js';
import { addCharacterManual } from './index-support/initiativeTracker.js';
import { collapseText, checkUserLogin } from './index-support/index-functions.js';
import { populateCharacterPopup } from './index-support/it-html';
import { saveInitiativeTracker, createLoadBattlePopup, loadInitiativeTracker } from './index-support/it-functions.js';
import { getCurrentData } from './aws-services/s3.js';

let initiativeTracker = new InitiativeTracker();
initiativeTracker.displayInitiativeList();

document.getElementById('addCharacter').addEventListener('click', function() {addCharacterManual(initiativeTracker)});
document.getElementById('nextTurn').addEventListener('click', function() {initiativeTracker.nextTurn();});
document.getElementById('addStatus').addEventListener('click', function() {initiativeTracker.addStatusCondition();});
document.getElementById('removeStatus').addEventListener('click', function() {initiativeTracker.removeStatusCondition();});
document.getElementById('changeHP').addEventListener('click', function() {initiativeTracker.changeHP();});
document.getElementById('removeCharacter').addEventListener('click', function() {initiativeTracker.removeCharacter();});
document.getElementById("henchmanAttack").addEventListener("click", function() {initiativeTracker.rollAttack()});

document.getElementById('loadCharacter').addEventListener('click', async () => {
  const characters = await getCurrentData();
  populateCharacterPopup(characters, initiativeTracker);
});

document.getElementById("saveBattle").addEventListener("click", function() {saveInitiativeTracker(initiativeTracker)});
document.getElementById('loadBattle').addEventListener('click', async () => {
  createLoadBattlePopup();
});

export async function handleLoadBattleButtonClick(battleId) {
  initiativeTracker = await loadInitiativeTracker(battleId);
  initiativeTracker.displayInitiativeList();
}

document.getElementById('collapseSidebar').addEventListener('click', function() {
    document.querySelector('.it-sidebar').classList.toggle('collapsed');
});

const collapseButton = document.querySelector('#collapseSidebar');
const sidebarButtons = document.querySelector('.sidebar-buttons');
const textWrappers = sidebarButtons.querySelectorAll('.text-wrapper');
let isCollapsed = false;
let originalTexts = [];

for (let i = 0; i < textWrappers.length; i++) {
  originalTexts.push(textWrappers[i].textContent);
}

collapseButton.addEventListener('click', () => {
  collapseText(textWrappers, originalTexts, isCollapsed);
  isCollapsed = !isCollapsed;
});

checkUserLogin();