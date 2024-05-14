import config from './config';
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";

// Define the bucket and object key.
const bucketName = "custom-character-info";
const objectKey = "test-character/character.json";

// Function to get the current data from S3
export async function getCurrentData() {
  const s3Client = new S3Client({
    region: 'us-east-1',
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
    cache: false,
  });

  const getCurrentDataCommand = new GetObjectCommand({
    Bucket: bucketName,
    Key: objectKey,
  });
  const getCurrentDataResponse = await s3Client.send(getCurrentDataCommand);
  const currentData = await getCurrentDataResponse.Body.transformToString();

  return JSON.parse(currentData);
}

// Function to write data to S3
export async function writeDataToS3(jsonData) {
  try {
    const s3Client = new S3Client({
      region: 'us-east-1',
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
      cache: false,
    });

    const stringifiedJsonData = JSON.stringify(jsonData);

    const putObjectCommand = new PutObjectCommand({
      Bucket: bucketName,
      Key: objectKey,
      Body: stringifiedJsonData,
    });

    await s3Client.send(putObjectCommand);
    console.log("Data written to S3 successfully!");
  } catch (error) {
    // If the NoSuchKey error is thrown, it means the object doesn't exist.
    if (error.name === "NoSuchKey") {
      const s3Client = new S3Client({
        region: 'us-east-1',
        credentials: {
          accessKeyId: config.accessKeyId,
          secretAccessKey: config.secretAccessKey,
        },
        cache: false,
      });
      // Create the S3 object with an empty array.
      const putObjectCommand = new PutObjectCommand({
        Bucket: bucketName,
        Key: objectKey,
        Body: JSON.stringify([collectData()]),
      });
      await s3Client.send(putObjectCommand);
    } else {
      console.error(error);
    }
  }
}




/*async function addCharacterFromJSON(initiativeTracker) {
  const name = prompt("Enter character name: ");

  try {
    // Try to get the current data from the S3 object.
    const getCurrentDataCommand = new GetObjectCommand({
      Bucket: bucketName,
      Key: objectKey,
    });
    const getCurrentDataResponse = await s3Client.send(getCurrentDataCommand);
    const currentData = await getCurrentDataResponse.Body.transformToString();

    // Parse the current data as JSON.
    const jsonData = JSON.parse(currentData);

    // Find the character with the given name
    const characterData = jsonData.find(char => char.name === name);

    if (characterData) {
      let initiative;
      if (characterData.isHenchman) {
        const initiativeModifier = characterData.initiativeModifier;
        const roll = Math.floor(Math.random() * 20) + 1; // Roll a d20
        initiative = roll + initiativeModifier;
      } else {
        initiative = parseInt(prompt(`Enter initiative for ${name}: `));
      }

      const character = {
        name: characterData.name,
        initiative,
        ac: characterData.ac,
        currentHP: characterData.maxHp,
        maxHP: characterData.maxHp,
        statusConditions: [],
      };

      if (characterData.isHenchman) {
        character.attack = {
          name: characterData.attackName,
          toHitBonus: characterData.attackToHitBonus,
          damage: characterData.attackDamage,
          damageType: characterData.attackDamageType,
        };
      }

      if (characterData.isHenchman) {
        initiativeTracker.addCharacter(character);
      } else {
        initiativeTracker.addCharacter(character);
      }
    } else {
      console.log(`No character found with name ${name}`);
    }
  } catch (error) {
    console.error(error);
  }
} */