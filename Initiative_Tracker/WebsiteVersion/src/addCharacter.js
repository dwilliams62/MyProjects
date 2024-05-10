import config from './config';
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: 'us-east-1',
  credentials: {
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey,
  },
});

// Define the bucket and object key.
const bucketName = "custom-character-info";
const objectKey = "test-character/character.json";

// Function to collect data from user
function collectData() {
  const name = document.getElementById('name').value;
  const initiativeModifier = parseInt(document.getElementById('initiative-modifier').value);
  const ac = parseInt(document.getElementById('ac').value);
  const maxHp = parseInt(document.getElementById('max-hp').value);
  const isHenchman = document.getElementById('is-henchman').checked;
  const isMainCharacter = document.getElementById('is-main-character').checked;

  let attack;
  if (isHenchman) {
    const attackName = document.getElementById('attack-name').value;
    const attackToHitBonus = parseInt(document.getElementById('attack-to-hit-bonus').value);
    const attackDamage = document.getElementById('attack-damage').value;
    const attackDamageType = document.getElementById('attack-damage-type').value;

    // Validate attack damage format
    const damageRegex = /^\d+d\d+\+\d+$/;
    if (!damageRegex.test(attackDamage)) {
      throw new Error("Invalid attack damage format");
    }
        
    attack = {
      name: attackName,
      toHitBonus: attackToHitBonus,
      damage: attackDamage,
      damageType: attackDamageType,
    };
  }

  if (isMainCharacter) {
    const spellCastingModifier = parseInt(document.getElementById('spell-casting-modifier').value);
    const spellSaveDc = parseInt(document.getElementById('spell-save-dc').value);
    const speed = parseInt(document.getElementById('speed').value);

    // Add the main character fields to the data object
    flattenedData.spellCastingModifier = spellCastingModifier;
    flattenedData.spellSaveDc = spellSaveDc;
    flattenedData.speed = speed;
  }

  return {
    name,
    initiativeModifier,
    ac,
    maxHp,
    isHenchman,
    attack,
  };
}

async function writeDataToS3() {
  try {
    // Try to get the current data from the S3 object.
    const getCurrentDataCommand = new GetObjectCommand({
      Bucket: bucketName,
      Key: objectKey,
    });
    const getCurrentDataResponse = await s3Client.send(getCurrentDataCommand);
    const currentData = await getCurrentDataResponse.Body.transformToString();

    // Parse the current data as JSON.
    let jsonData;
    if (currentData) {
      jsonData = JSON.parse(currentData);
    } else {
      jsonData = [];
    }

    // Collect new data from user
    const newData = collectData();
    const flattenedData = {
      name: newData.name,
      initiativeModifier: newData.initiativeModifier,
      ac: newData.ac,
      maxHp: newData.maxHp,
      isHenchman: newData.isHenchman,
    };

    if (newData.isHenchman) {
      flattenedData.attack = {
        name: newData.attack.name,
        toHitBonus: newData.attack.toHitBonus,
        damage: newData.attack.damage,
        damageType: newData.attack.damageType,
      };
    }

    // Append the new data to the existing data
    jsonData.push(flattenedData);

    // Convert the JSON back to string.
    const stringifiedJsonData = JSON.stringify(jsonData);

    // Write the new data to the S3 object.
    const putObjectCommand = new PutObjectCommand({
      Bucket: bucketName,
      Key: objectKey,
      Body: stringifiedJsonData,
    });
    await s3Client.send(putObjectCommand);

    // Print the full JSON after writing to it.
    console.log(stringifiedJsonData);
  } catch (error) {
    // If the NoSuchKey error is thrown, it means the object doesn't exist.
    if (error.name === "NoSuchKey") {
      // Create the S3 object with an empty array.
      const putObjectCommand = new PutObjectCommand({
        Bucket: bucketName,
        Key: objectKey,
        Body: JSON.stringify([]),
      });
      await s3Client.send(putObjectCommand);

      // Recall the function to retry the operation.
      writeDataToS3();
    } else {
      console.error(error);
    }
  }
}