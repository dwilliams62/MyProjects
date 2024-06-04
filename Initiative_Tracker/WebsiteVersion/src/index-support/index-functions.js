import { getCurrentUsername, getThisUser, signOutUser as amplifySignOutUser } from '../aws-services/amplify.js';

export function collapseText(textWrappers, originalTexts, isCollapsed, speed = 50) {
  let animationId;
  const animateCollapse = (timestamp) => {
    let i = 0;
    if (isCollapsed) {
      const animate = (timestamp) => {
        if (i >= originalTexts[0].length) {
          cancelAnimationFrame(animationId);
        } else {
          for (let j = 0; j < textWrappers.length; j++) {
            const textWrapper = textWrappers[j];
            textWrapper.textContent = originalTexts[j].substring(0, i + 1);
          }
          i++;
          animationId = requestAnimationFrame((timestamp) => {
            setTimeout(() => {
              animate(timestamp);
            }, speed);
          });
        }
      };
      animate(timestamp);
    } else {
      i = originalTexts[0].length;
      const animate = (timestamp) => {
        if (i <= 0) {
          cancelAnimationFrame(animationId);
        } else {
          for (let j = 0; j < textWrappers.length; j++) {
            const textWrapper = textWrappers[j];
            textWrapper.textContent = originalTexts[j].substring(0, i);
          }
          i--;
          animationId = requestAnimationFrame((timestamp) => {
            setTimeout(() => {
              animate(timestamp);
            }, speed);
          });
        }
      };
      animate(timestamp);
    }
  };
  animationId = requestAnimationFrame(animateCollapse);
}

export function toggleTopBarButtons(username) {
  const topbar = document.querySelector('.topbar');
  const buttons = topbar.querySelector('.it-buttons');
  buttons.innerHTML = '';
  if (username) {
    const welcomeMessage = document.createElement('span');
    welcomeMessage.textContent = `Welcome, ${username}`;
    welcomeMessage.style.marginRight = '10px';
    buttons.appendChild(welcomeMessage);
    const viewUserInfoButton = document.createElement('button');
    viewUserInfoButton.textContent = 'View User Info';
    buttons.appendChild(viewUserInfoButton);
    const signOutButton = document.createElement('button');
    signOutButton.textContent = 'Sign-out';
    signOutButton.addEventListener('click', localSignOutUser);
    buttons.appendChild(signOutButton);
  } else {
    const loginButton = document.createElement('button');
    loginButton.textContent = 'Log In';
    loginButton.addEventListener('click', () => {
      window.location.href = 'login.html';
    });
    buttons.appendChild(loginButton);
  }
}

function localSignOutUser() {
  amplifySignOutUser().then(() => {
    toggleTopBarButtons(null);
  });
}

export function checkUserLogin() {
  getThisUser().then((user) => {
    if (user) {
      getCurrentUsername().then((username) => {
        toggleTopBarButtons(username);
      });
    } else {
      toggleTopBarButtons(null);
    }
  });
}