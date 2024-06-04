import { SES } from 'aws-sdk';

const sendEmail = async (name, email, description) => {
  const ses = new SES({ region: 'us-east-1' });
  const params = {
    Destination: {
      ToAddresses: ['your-email-address'],
    },
    Message: {
      Body: {
        Text: {
          Data: `Name: ${name}\nEmail: ${email}\nDescription: ${description}`,
        },
      },
      Subject: {
        Data: 'Contact Us Form Submission',
      },
    },
    Source: 'your-email-address',
  };
  await ses.sendEmail(params).promise();
};