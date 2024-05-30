import { Amplify } from 'aws-amplify';
import { signIn, signOut, getCurrentUser } from '@aws-amplify/auth';
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
  } catch (error) {
    console.error('Error signing out:', error);
  }
}