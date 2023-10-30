import { SQSClient, SendMessageCommand, DeleteMessageCommand } from '@aws-sdk/client-sqs';


const sqsClient = new SQSClient({
    region: 'us-east-1',
    credentials: {
      accessKeyId:process.env.ACESS_KEY_ID ||'',
      secretAccessKey:process.env.SECRET_KEY_ID ||'',
    },
  });
  

export { sqsClient, SendMessageCommand, DeleteMessageCommand };