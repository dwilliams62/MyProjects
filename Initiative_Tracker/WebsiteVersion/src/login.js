import { signUp, confirmUserSignUp } from './aws-services/cognito';
import { authenticateUser } from './aws-services/amplify';
import { createFolderAndFile } from './aws-services/s3';
import { showLoginForm, showSignupForm, showConfirmationCodeInput } from './login-support/login-html';


const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const confirmationCodeInput = document.getElementById('confirmation-code');
const confirmButton = document.getElementById('confirm-button');
const switchLink = document.getElementById('switch-link');
const resendCodeButton = document.getElementById('resend-code-button');

// Add an event listener to the switch link
switchLink.addEventListener('click', () => {
  if (loginForm.style.display === 'none') {
    showLoginForm();
  } else {
    showSignupForm();
  }
});

// Add an event listener to the sign up form
signupForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = document.getElementById('signup-username').value;
  const password = document.getElementById('signup-password').value;
  const email = document.getElementById('signup-email').value;

  try {
    await signUp(username, password, email);
    showConfirmationCodeInput();
  } catch (error) {
    console.error(error);
  }
});

confirmButton.addEventListener('click', async () => {
  const username = document.getElementById('signup-username').value;
  const password = document.getElementById('signup-password').value;
  const confirmationCode = confirmationCodeInput.value;

  try {
    await confirmUserSignUp(username, confirmationCode);
    const user = await authenticateUser(username, password);
    await createFolderAndFile();
    redirectToIndexPage(user);
  } catch (error) {
    console.error(error);
  }
});

// Add an event listener to the login form
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const usernameInput = document.getElementById('login-username');
  const passwordInput = document.getElementById('login-password');
  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  try {
    if (username && password) {
      await authenticateUser(username, password);
      redirectToIndexPage(user);
    } else {
      console.error('Username and password are required to login');
    }
  } catch (error) {
    console.error(error);
  }
});

function redirectToIndexPage(user) {
  window.location.href = 'index.html';
}