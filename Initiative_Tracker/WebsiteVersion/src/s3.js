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
  const name = prompt("Enter a name:");
  const initiativeModifier = parseInt(prompt("Enter initiative modifier:"));
  const ac = parseInt(prompt("Enter AC:"));
  const maxHp = parseInt(prompt("Enter max HP:"));
  const isHenchman = prompt("Is this a henchman? (yes/no):").toLowerCase() === 'yes';

  let attack;
  if (isHenchman) {
    const attackName = prompt("Enter attack name:");
    const attackToHitBonus = parseInt(prompt("Enter attack to hit bonus:"));
    const attackDamage = prompt("Enter attack damage (e.g. 3d6+4):");
    const attackDamageType = prompt("Enter attack damage type:");

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

async function addCharacterFromJSON(initiativeTracker) {
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
}

export { writeDataToS3, addCharacterFromJSON };