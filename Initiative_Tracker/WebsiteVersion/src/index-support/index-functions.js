import { getCurrentUsername, getThisUser, signOutUser } from '../aws-services/amplify.js';

export function collapseText(textWrappers, originalTexts, isCollapsed, speed = 50) {
  let animationId;
  const animateCollapse = (timestamp) => {
    let i = 0;
    if (isCollapsed) {
      const animate = (timestamp) => {
        let allDone = true;
        for (let j = 0; j < textWrappers.length; j++) {
          const textWrapper = textWrappers[j];
          if (i < originalTexts[j].length) {
            textWrapper.textContent = originalTexts[j].substring(0, i + 1);
            allDone = false;
          }
        }
        i++;
        if (allDone) {
          cancelAnimationFrame(animationId);
        } else {
          animationId = requestAnimationFrame((timestamp) => {
            setTimeout(() => {
              animate(timestamp);
            }, speed);
          });
        }
      };
      animate(timestamp);
    } else {
      let maxLength = Math.max(...originalTexts.map(text => text.length));
      i = maxLength;
      const animate = (timestamp) => {
        let allDone = true;
        for (let j = 0; j < textWrappers.length; j++) {
          const textWrapper = textWrappers[j];
          if (i > 0) {
            textWrapper.textContent = originalTexts[j].substring(0, i);
            allDone = false;
          }
        }
        i--;
        if (allDone) {
          cancelAnimationFrame(animationId);
        } else {
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
    viewUserInfoButton.addEventListener('click', () => {
      window.location.href = 'user-options.html';
    });
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
  signOutUser().then(() => {
    toggleTopBarButtons(null);
  });
}

export function checkUserLogin() {
  getThisUser().then((user) => {
    if (user) {
      getCurrentUsername().then((username) => {
        toggleTopBarButtons(username);
        toggleSidebarButtons(true);
      });
    } else {
      toggleTopBarButtons(null);
      toggleSidebarButtons(false);
    }
  });
}

export function toggleSidebarButtons(isLoggedIn) {
  const loadCharacterButton = document.getElementById('loadCharacter');
  const saveBattleButton = document.getElementById('saveBattle');
  const loadBattleButton = document.getElementById('loadBattle');
  
  if (isLoggedIn) {
    loadCharacterButton.style.display = 'block';
    saveBattleButton.style.display = 'block';
    loadBattleButton.style.display = 'block';
  } else {
    loadCharacterButton.style.display = 'none';
    saveBattleButton.style.display = 'none';
    loadBattleButton.style.display = 'none';
  }
}