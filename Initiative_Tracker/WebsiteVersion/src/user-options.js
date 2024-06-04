import { addCharacterToS3, addAttackToCharacter, updateJSONData, isCharacterListEmpty, 
    deleteData } from './user-options-support/uo-functions.js';
import { clearForm, displayCharactersFromJSON, toggleVisibility, setEditMode, 
    displayPopup, displayCharactersInDropdown } from './user-options-support/uo-html.js';
import { signOutUser, changeEmail, changePassword } from './aws-services/amplify.js';

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

document.getElementById('change-password-button').addEventListener('click', function() {
  toggleVisibility(['change-password-form', 'change-email-form', 'delete-data-form'], 'change-password-form');
});

document.getElementById('change-email-button').addEventListener('click', function() {
  toggleVisibility(['change-password-form', 'change-email-form', 'delete-data-form'], 'change-email-form');
});

document.getElementById('delete-data-button').addEventListener('click', function() {
  toggleVisibility(['change-password-form', 'change-email-form', 'delete-data-form'], 'delete-data-form');
});

document.getElementById("add-character-button").addEventListener("click", function() {
  toggleVisibility(['character-form-container', 'attack-form-container', 'character-card-container'], 'character-form-container');
});

document.getElementById("add-attack-button").addEventListener("click", async function() {
  toggleVisibility(['character-form-container', 'attack-form-container', 'character-card-container'], 'attack-form-container');
  if (await isCharacterListEmpty()) {
    displayPopup('No characters found. Please add a character first.');
  } else {
    await displayCharactersInDropdown();
  }
});

document.getElementById("view-characters-button").addEventListener("click", async function() {
  toggleVisibility(['character-form-container', 'attack-form-container', 'character-card-container'], 'character-card-container');
  if (await isCharacterListEmpty()) {
    displayPopup('No characters found. Please add a character first.');
  } else {
    displayCharactersFromJSON();
  }
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

document.getElementById('submit-password-button').addEventListener('click', async function(event) {
  event.preventDefault();
  const oldPassword = document.getElementById('old-password').value;
  const newPassword = document.getElementById('new-password').value;
  const confirmNewPassword = document.getElementById('confirm-new-password').value;
  // Call AWS Amplify function to change password
  await changePassword(oldPassword, newPassword, confirmNewPassword);
});

document.getElementById('submit-email-button').addEventListener('click', async function(event) {
  event.preventDefault();
  const newEmail = document.getElementById('new-email').value;
  // Call AWS Amplify function to change email
  await changeEmail(newEmail);
});

document.getElementById('submit-delete-button').addEventListener('click', async function(event) {
  event.preventDefault();
  // Call function to delete data
  await deleteData();
});