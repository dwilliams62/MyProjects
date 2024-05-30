import InitiativeTracker from './index-support/initiativeTracker.js';
import { addCharacterManual, addCharacterFromJSON } from './index-support/initiativeTracker.js';

let initiativeTracker = new InitiativeTracker();
initiativeTracker.displayInitiativeList();

document.getElementById('addCharacter').addEventListener('click', function() {addCharacterManual(initiativeTracker)});
document.getElementById('nextTurn').addEventListener('click', function() {initiativeTracker.nextTurn();});
document.getElementById('addStatus').addEventListener('click', function() {initiativeTracker.addStatusCondition();});
document.getElementById('removeStatus').addEventListener('click', function() {initiativeTracker.removeStatusCondition();});
document.getElementById('changeHP').addEventListener('click', function() {initiativeTracker.changeHP();});
document.getElementById('removeCharacter').addEventListener('click', function() {initiativeTracker.removeCharacter();});
document.getElementById("henchmanAttack").addEventListener("click", function() {initiativeTracker.rollAttack()});

document.getElementById('loadCharacter').addEventListener('click', function() {addCharacterFromJSON(initiativeTracker);});

document.getElementById('collapseSidebar').addEventListener('click', function() {
    document.querySelector('.it-sidebar').classList.toggle('collapsed');
});

const sidebar = document.querySelector('.it-sidebar');
const textWrapper = document.querySelector('.text-wrapper');
const text = textWrapper.textContent;
let isCollapsed = false;
let animationId;

// Assume this is the button that triggers the collapse
const collapseButton = document.querySelector('#collapseSidebar');

collapseButton.addEventListener('click', () => {
  // Add a small delay to ensure the transition has started before starting the animation
  setTimeout(() => {
    if (!isCollapsed) {
      // Start collapsing animation
      let i = 0;
      const animateCollapse = (timestamp) => {
        if (i >= text.length) {
          cancelAnimationFrame(animationId);
        } else {
          textWrapper.textContent = text.substring(0, text.length - i);
          i++;
          animationId = requestAnimationFrame((timestamp) => {
            setTimeout(() => {
              animateCollapse(timestamp);
            }, 50); // adjust this value to change the speed of the animation
          });
        }
      };
      animationId = requestAnimationFrame(animateCollapse);
    } else {
      // Start expanding animation
      let i = 0;
      const animateExpand = (timestamp) => {
        if (i >= text.length) {
          cancelAnimationFrame(animationId);
        } else {
          textWrapper.textContent = text.substring(0, i + 1);
          i++;
          animationId = requestAnimationFrame((timestamp) => {
            setTimeout(() => {
              animateExpand(timestamp);
            }, 50); // adjust this value to change the speed of the animation
          });
        }
      };
      animationId = requestAnimationFrame(animateExpand);
    }

    // Toggle the collapsed state
    isCollapsed = !isCollapsed;
  }, 10); // add a small delay to ensure the transition has started
});

sidebar.addEventListener('transitionend', (event) => {
  if (event.propertyName === 'width') {
    cancelAnimationFrame(animationId);
    // Ensure the final state of the text animation matches the collapsed state
    if (isCollapsed) {
      textWrapper.textContent = ''; // Fully collapsed
    } else {
      textWrapper.textContent = text; // Fully expanded
    }
  }
});