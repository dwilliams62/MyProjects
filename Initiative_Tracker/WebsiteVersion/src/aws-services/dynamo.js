import { DynamoDB } from 'aws-sdk';

const dynamodb = new DynamoDB.DocumentClient();

const updateTotalUsers = async () => {
  const params = {
    TableName: 'UserStats',
    Key: { id: 'stats' },
    UpdateExpression: 'SET totalUsers = totalUsers + :val',
    ExpressionAttributeValues: { ':val': 1 },
  };
  await dynamodb.update(params).promise();
};

const updateTotalBattles = async () => {
  const params = {
    TableName: 'UserStats',
    Key: { id: 'stats' },
    UpdateExpression: 'SET totalBattles = totalBattles + :val',
    ExpressionAttributeValues: { ':val': 1 },
  };
  await dynamodb.update(params).promise();
};

const updateTotalEnemiesDefeated = async () => {
  const params = {
    TableName: 'UserStats',
    Key: { id: 'stats' },
    UpdateExpression: 'SET totalEnemiesDefeated = totalEnemiesDefeated + :val',
    ExpressionAttributeValues: { ':val': 1 },
  };
  await dynamodb.update(params).promise();
};