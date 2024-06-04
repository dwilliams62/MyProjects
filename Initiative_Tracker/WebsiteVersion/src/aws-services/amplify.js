import { Amplify } from 'aws-amplify';
import { signIn, signOut, getCurrentUser, updatePassword } from '@aws-amplify/auth';
import awsconfig from '../aws-exports';

try {
  Amplify.configure(awsconfig);
} catch (error) {
  console.log(error);
}

export async function authenticateUser(username, password) {
  try {
    console.log(username);
    console.log(password);
    const user = await signIn({
      username: username,
      password: password,
    });
    return user;
  } catch (error) {
    console.log(error);
  }
}

export async function getThisUser() {
  try {
    const user = await getCurrentUser();
    return user;
  } catch (error) {
    console.error('Error fetching current user:', error);
  }
}

export async function getCurrentUsername() {
  try {
    const user = await getCurrentUser();
    return user.username;
  } catch (error) {
    console.error('Error fetching current user:', error);
    throw error;
  }
}

export async function signOutUser() {
  try {
    await signOut();
    console.log('Signed out successfully');
    window.location.href = 'index.html';
  } catch (error) {
    console.error('Error signing out:', error);
  }
}

export async function changePassword(oldPassword, newPassword, confirmNewPassword) {
  try {
    const user = await getCurrentUser();

    // Validate the old password
    if (!oldPassword || oldPassword.trim() === '') {
      throw new Error('Old password is required');
    }

    // Validate the new password
    if (!newPassword || newPassword.trim() === '') {
      throw new Error('New password is required');
    }

    // Validate the confirm new password
    if (newPassword !== confirmNewPassword) {
      throw new Error('New password and confirm new password do not match');
    }

    // Validate password complexity
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      throw new Error('New password does not meet complexity requirements');
    }

    // Update the password
    await updatePassword(user, oldPassword, newPassword);
    console.log('Password changed successfully');
  } catch (error) {
    console.error('Error changing password:', error);
  }
}

export async function changeEmail(newEmail) {
  try {
    const user = await getCurrentUser();
    await Auth.updateUserAttributes(user, {
      email: newEmail,
    });
    console.log('Email changed successfully');
  } catch (error) {
    console.error('Error changing email:', error);
  }
}

export const getUsersCount = async () => {
  const users = await Auth.listUsers();
  return users.length;
};