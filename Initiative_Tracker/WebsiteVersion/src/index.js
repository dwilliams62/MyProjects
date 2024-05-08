import InitiativeTracker from './initiativeTracker.js';
import { writeDataToS3 } from './s3.js';

let initiativeTracker = new InitiativeTracker();

document.getElementById('addCharacter').addEventListener('click', function() {initiativeTracker.addCharacter();});
document.getElementById('nextTurn').addEventListener('click', function() {initiativeTracker.nextTurn();});
document.getElementById('addStatus').addEventListener('click', function() {initiativeTracker.addStatusCondition();});
document.getElementById('removeStatus').addEventListener('click', function() {initiativeTracker.removeStatusCondition();});
document.getElementById('changeHP').addEventListener('click', function() {initiativeTracker.changeHP();});
document.getElementById('removeCharacter').addEventListener('click', function() {initiativeTracker.removeCharacter();});
document.getElementById("henchmanAttack").addEventListener("click", function() {initiativeTracker.rollAttack()});

document.getElementById('writeCharacter').addEventListener('click', function() {writeDataToS3();});

document.getElementById('toggleSidebar').addEventListener('click', function() {
    document.querySelector('.sidebar').classList.toggle('collapsed');
});