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

// Function to write data to S3 object
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

    // Prompt the user for new data.
    const newName = prompt("Enter a name:");
    const newAge = prompt("Enter an age:");
    const newCity = prompt("Enter a city:");

    // Create new data object with user input.
    const newData = {
      "name": newName,
      "age": parseInt(newAge), // Convert age to integer
      "city": newCity,
    };
    jsonData.push(newData);

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

export { writeDataToS3 };