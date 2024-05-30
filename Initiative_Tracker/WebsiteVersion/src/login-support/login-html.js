export function showLoginForm() {
  document.getElementById('login-form').style.display = 'block';
  document.getElementById('signup-form').style.display = 'none';
  document.getElementById('confirmation-code').style.display = 'none';
  document.getElementById('confirm-button').style.display = 'none';
  document.getElementById('resend-code-button').style.display = 'none';
}

export function showSignupForm() {
  document.getElementById('login-form').style.display = 'none';
  document.getElementById('signup-form').style.display = 'block';
  document.getElementById('confirmation-code').style.display = 'none';
  document.getElementById('confirm-button').style.display = 'none';
  document.getElementById('resend-code-button').style.display = 'none';
}

export function showConfirmationCodeInput() {
  document.getElementById('login-form').style.display = 'none';
  document.getElementById('signup-form').style.display = 'none';
  document.getElementById('confirmation-code').style.display = 'block';
  document.getElementById('confirm-button').style.display = 'block';
  document.getElementById('resend-code-button').style.display = 'block';
}