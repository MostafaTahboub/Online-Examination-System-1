import AWS from "aws-sdk";
import dotenv from "dotenv";
import baseLogger from "../log.js";
dotenv.config();

const SES_Config = {
  accessKeyId: process.env.ACCESS_KEY,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
};
let AWS_SES = new AWS.SES(SES_Config);

const sendEmail = async (recepantEmail: string, name: string, data: string) => {
  let params = {
    Source: process.env.AWS_SES_SENDER || "",
    Destination: {
      ToAddresses: [`${recepantEmail}`],
    },
    ReplyToAddresses: [],
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `<p>${data}</p>`,
        },
        Text: {
          Charset: "UTF-8",
          Data: data,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: `${name}`,
      },
    },
  };
  try {
    const res = await AWS_SES.sendEmail(params, () => {}).promise();
    console.log(res);
    baseLogger.info(`email is sent: ${res}`);
  } catch (error) {
    baseLogger.error(`Error sending Email: ${error}`);
    console.log(`not working ${error}`);
  }
};
export default sendEmail;
