import InitiativeTracker from './initiativeTracker.js';
import { addCharacterManual } from './initiativeTracker.js';
import { writeDataToS3, addCharacterFromJSON } from './s3.js';

let initiativeTracker = new InitiativeTracker();

document.getElementById('addCharacter').addEventListener('click', function() {addCharacterManual(initiativeTracker)});
document.getElementById('nextTurn').addEventListener('click', function() {initiativeTracker.nextTurn();});
document.getElementById('addStatus').addEventListener('click', function() {initiativeTracker.addStatusCondition();});
document.getElementById('removeStatus').addEventListener('click', function() {initiativeTracker.removeStatusCondition();});
document.getElementById('changeHP').addEventListener('click', function() {initiativeTracker.changeHP();});
document.getElementById('removeCharacter').addEventListener('click', function() {initiativeTracker.removeCharacter();});
document.getElementById("henchmanAttack").addEventListener("click", function() {initiativeTracker.rollAttack()});

document.getElementById('writeCharacter').addEventListener('click', function() {writeDataToS3();});
document.getElementById('loadCharacter').addEventListener('click', function() {addCharacterFromJSON(initiativeTracker);});

document.getElementById('collapseSidebar').addEventListener('click', function() {
    document.querySelector('.it-sidebar').classList.toggle('collapsed');
});

