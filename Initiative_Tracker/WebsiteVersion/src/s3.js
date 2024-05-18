import config from './config';
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";

// Define the bucket and object key.
const bucketName = "custom-character-info";
const objectKey = "test-character/character.json";

// Function to get the current data from S3
export async function getCurrentData() {
  try {
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
  } catch (error) {
    if (error.name === "NoSuchKey") {
      // Create an empty JSON file and upload it to S3
      const emptyData = {};
      await writeDataToS3(emptyData);
      return emptyData;
    } else {
      console.error(error);
      throw error;
    }
  }
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
    console.error(error);
  }
}