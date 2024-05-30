import { CognitoIdentityServiceProvider } from 'aws-sdk';

const region = 'us-east-1';
const clientId = '7jeteurjn5fg890f8m634asp98';

const cognito = new CognitoIdentityServiceProvider({
  region: region,
});

export async function signUp(username, password, email) {
  try {
    const signUpResponse = await cognito.signUp({
      ClientId: clientId,
      Username: username,
      Password: password,
      UserAttributes: [
        {
          Name: 'email',
          Value: email,
        },
      ],
    }).promise();

    return signUpResponse;
  } catch (error) {
    console.log(error);
  }
}

export async function confirmUserSignUp(username, confirmationCode) {
  try {
    const confirmResponse = await cognito.confirmSignUp({
      ClientId: clientId,
      Username: username,
      ConfirmationCode: confirmationCode,
    }).promise();

    return confirmResponse;
  } catch (error) {
    console.log(error);
  }
}