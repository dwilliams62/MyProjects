import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { fetchAuthSession } from '@aws-amplify/auth';
import { getCurrentUsername } from './amplify';


async function createS3ClientWithUserCredentials() {
  try {
    const { credentials } = await fetchAuthSession();
    const s3Client = new S3Client({
      credentials,
      region: 'us-east-1', // specify your region
    });
    return s3Client;
  } catch (error) {
    console.error('Error creating S3 client with user credentials:', error);
    throw error;
  }
}

export async function getCurrentData(path = null, type = 'character') {
  try {
    const s3Client = await createS3ClientWithUserCredentials();
    const username = await getCurrentUsername();

    let key;
    if (path) {
      key = path;
    } else {
      key = `${username}/${type}.json`;
    }

    const getObjectCommand = new GetObjectCommand({
      Bucket: 'custom-character-info',
      Key: key,
    });
    const getObjectResponse = await s3Client.send(getObjectCommand);
    const currentData = await getObjectResponse.Body.transformToString();

    if (currentData.trim() === '') { 
      return []; 
    } else {
      return JSON.parse(currentData);
    }
  } catch (error) {
    console.error(error);
    return []; 
  }
}

export async function writeDataToS3(jsonData, path = null, type = 'character') {
  try {
    const s3Client = await createS3ClientWithUserCredentials();
    const username = await getCurrentUsername();

    const stringifiedJsonData = JSON.stringify(jsonData);

    let key;
    if (path) {
      key = path;
    } else {
      key = `${username}/${type}.json`;
    }

    const putObjectCommand = new PutObjectCommand({
      Bucket: 'custom-character-info',
      Key: key,
      Body: stringifiedJsonData,
    });

    await s3Client.send(putObjectCommand);
    console.log('Data written to S3 successfully!');
  } catch (error) {
    console.error(error);
  }
}

export async function createFolderAndFile() {
  try {
    const username = await getCurrentUsername();
    const s3Client = await createS3ClientWithUserCredentials();

    const putObjectCommand = new PutObjectCommand({
      Bucket: 'custom-character-info',
      Key: `${username}/character.json`,
      Body: '',
    });

    await s3Client.send(putObjectCommand);
    console.log('Folder and file created successfully!');
  } catch (error) {
    console.error('Error creating folder and file in S3:', error);
  }
}