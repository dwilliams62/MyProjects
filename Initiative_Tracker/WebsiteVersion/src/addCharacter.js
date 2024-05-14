import config from './config';
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";

// Define the bucket and object key.
const bucketName = "custom-character-info";
const objectKey = "test-character/character.json";

// Function to collect data from user
function collectData() {
  const name = document.getElementById('name').value;
  const initiativeModifier = parseInt(document.getElementById('initiative-modifier').value);
  const ac = parseInt(document.getElementById('ac').value);
  const maxHp = parseInt(document.getElementById('max-hp').value);
  const spellCastingModifier = parseInt(document.getElementById('spell-casting-modifier').value);
  const spellSaveDc = parseInt(document.getElementById('spell-save-dc').value);
  const speed = parseInt(document.getElementById('speed').value);

  return {
    name,
    initiativeModifier,
    ac,
    maxHp,
    spellCastingModifier,
    spellSaveDc,
    speed,
  };
}

async function writeDataToS3() {
  try {
    const s3Client = new S3Client({
      region: 'us-east-1',
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
      cache: false,
    });

    // Collect new data from user
    const newData = collectData();

    // Try to get the current data from the S3 object.
    const getCurrentDataCommand = new GetObjectCommand({
      Bucket: bucketName,
      Key: objectKey,
    });
    const getCurrentDataResponse = await s3Client.send(getCurrentDataCommand);
    const currentData = await getCurrentDataResponse.Body.transformToString();

    // Parse the current data as JSON.
    let jsonData = JSON.parse(currentData);

    // Append the new data to the existing data
    jsonData.push(newData);

    // Check if the JSON is still valid after adding the new data
    try {
      JSON.stringify(jsonData);
    } catch (error) {
      console.error("Error parsing JSON after adding new data:", error);
      return;
    }

    // Convert the JSON back to string.
    const stringifiedJsonData = JSON.stringify(jsonData);

    // Write the new data to the S3 object.
    console.log("Preparing to write data to S3...");
    const putObjectCommand = new PutObjectCommand({
      Bucket: bucketName,
      Key: objectKey,
      Body: stringifiedJsonData,
    });
    console.log("putObjectCommand:", putObjectCommand);

    await s3Client.send(putObjectCommand);
    console.log("Data written to S3 successfully!");

    // Print the full JSON after writing to it.
    console.log(stringifiedJsonData);
  } catch (error) {
    // If the NoSuchKey error is thrown, it means the object doesn't exist.
    if (error.name === "NoSuchKey") {
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

const submitButton = document.getElementById('submit-button');

submitButton.addEventListener('click', async (event) => {
  event.preventDefault();
  await writeDataToS3();
});





import { createCard } from './characterCard.js';

export async function displayCharactersFromJSON() {
  try {
    const s3Client = new S3Client({
      region: 'us-east-1',
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
      cache: false,
    });
    // Try to get the current data from the S3 object.
    const getCurrentDataCommand = new GetObjectCommand({
      Bucket: bucketName,
      Key: objectKey,
    });
    const getCurrentDataResponse = await s3Client.send(getCurrentDataCommand);
    const currentData = await getCurrentDataResponse.Body.transformToString();

    // Parse the current data as JSON.
    const jsonData = JSON.parse(currentData);

    // Create a card for each character in the JSON data
    jsonData.forEach(characterData => {
      const characterInfo = {
        name: characterData.name,
        currentHp: characterData.currentHp || characterData.maxHp,
        maxHp: characterData.maxHp,
        ac: characterData.ac,
        speed: characterData.speed,
        initiativeModifier: characterData.initiativeModifier,
        spellCastingModifier: characterData.spellCastingModifier,
        spellSaveDc: characterData.spellSaveDc,
      };

      // Create a card for the character
      createCard(characterInfo);
    });
  } catch (error) {
    console.error(error);
  }
}

displayCharactersFromJSON();