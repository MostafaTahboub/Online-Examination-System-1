import { Consumer } from "sqs-consumer";
import { Exam_answers } from "../DB/Entities/Exam_answers.js";
import { DeleteMessageCommand, sqsClient } from "../aws-config.js";
import { Response } from "../DB/Entities/Response.js";
import { Exam } from "../DB/Entities/Exam.js";
import dotenv from "dotenv";
import sendEmail from "../controllers/SES.js";
import { User } from "../DB/Entities/User.js";
import baseLogger from "../log.js";

dotenv.config();

const SES_Config = {
  accessKeyId: process.env.ACCESS_KEY,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
};

const queueConsumer = Consumer.create({
  sqs: sqsClient,
  queueUrl:
    "https://sqs.us-east-1.amazonaws.com/918000663876/exam-submissions-queue",
  handleMessage: async (message) => {
    try {
      const messageBody = JSON.parse(message.Body || "");
      const { lastResponseId, submittedAnswers, userId } = messageBody;
      const lastResponse = await Response.findOneBy({ id: lastResponseId });
      const exam = lastResponse?.exam;
      const title = await exam?.title;

      const currentExam = await Exam.findOne({
        where: {
          id: exam?.id,
        },
        relations: ["questions"],
      });
      const user = await User.findOneBy({ id: userId });

      if (lastResponse && currentExam) {
        const shuffledQuestionOrder = lastResponse.shuffledQuestionOrder;
        console.log(shuffledQuestionOrder);
        let totalScore = 0;

        for (let i = 0; i < currentExam.questions.length; i++) {
          const questionIndex = shuffledQuestionOrder[i];
          const shuffledAnswer = submittedAnswers[i];

          if (
            currentExam?.questions &&
            questionIndex >= 0 &&
            questionIndex <= currentExam?.questions?.length
          ) {
            const question = currentExam?.questions[questionIndex - 1];

            if (question) {
              switch (question.type) {
                case "TrueFalse":
                  if (question.answer === shuffledAnswer) {
                    totalScore += question.weight;
                  }
                  break;
                case "MultipleChoice":
                  if (question.correctAnswer === shuffledAnswer) {
                    totalScore += question.weight;
                  }
                  break;
                case "FillInTheBlank":
                  if (question.blankAnswer === shuffledAnswer) {
                    totalScore += question.weight;
                  }
                  break;
                default:
                  // Handle unknown question types
                  console.error("Unknown question type:", question.type);
                  break;
              }
            } else {
              console.error("Question is undefined for index:", questionIndex);
            }
          } else {
            console.error("Invalid question index:", questionIndex);
          }
        }
        lastResponse.totalScore = totalScore;
        lastResponse.status = "done";
        await lastResponse.save();

        sendEmail(
          `${user?.email}`,
          "your mark",
          `Hi ${user?.username} your mark for the ${title} exam is : ${totalScore}`
        );

        await sqsClient.send(
          new DeleteMessageCommand({
            QueueUrl:
              "https://sqs.us-east-1.amazonaws.com/918000663876/exam-submissions-queue",
            ReceiptHandle: message.ReceiptHandle,
          })
        );
      }
    } catch (error) {
      baseLogger.error("Error processing message:", error);
    }
  },
});

queueConsumer.on("error", (err) => {
  baseLogger.error("Error:", err.message);
});

export default queueConsumer;
