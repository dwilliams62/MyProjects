import { addCharacterToS3, addAttackToCharacter, updateJSONData } from './user-options-support/uo-functions.js';
import { clearForm, displayCharactersFromJSON, toggleVisibility, setEditMode } from './user-options-support/uo-html.js';
import { signOutUser } from './aws-services/amplify.js';

// Add event listeners
document.getElementById('submit-button').addEventListener('click', async (event) => {
  event.preventDefault();
  const loadingIndicator = document.getElementById('loading-indicator');
  loadingIndicator.textContent = 'Loading...';
  await addCharacterToS3();
  clearForm(document.getElementById('character-form'));
  loadingIndicator.textContent = 'Successfully Uploaded!';
});

document.getElementById('submit-attack-button').addEventListener('click', async (event) => {
  event.preventDefault();
  await addAttackToCharacter();
});

document.getElementById("add-character-button").addEventListener("click", function() {
  toggleVisibility(['character-form-container', 'attack-form-container', 'character-card-container'], 'character-form-container');
});

document.getElementById("add-attack-button").addEventListener("click", function() {
  toggleVisibility(['character-form-container', 'attack-form-container', 'character-card-container'], 'attack-form-container');
});

document.getElementById("view-characters-button").addEventListener("click", function() {
  toggleVisibility(['character-form-container', 'attack-form-container', 'character-card-container'], 'character-card-container');
  displayCharactersFromJSON();
});

document.getElementById("edit-button").addEventListener("click", function() {
  setEditMode(true);
});

document.getElementById("save-button").addEventListener("click", function() {
  updateJSONData();
  displayCharactersFromJSON();
  setEditMode(false);
});

document.getElementById("cancel-button").addEventListener("click", function() {
  setEditMode(false);
});

document.getElementById("sign-out-button").addEventListener("click", signOutUser);