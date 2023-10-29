import { Consumer } from 'sqs-consumer';
import { Exam_answers } from '../DB/Entities/Exam_answers.js';
import { DeleteMessageCommand, sqsClient } from '../aws-config.js'; // Adjust the path


const queueConsumer = Consumer.create({
  sqs: sqsClient,
  queueUrl: 'https://sqs.us-east-1.amazonaws.com/918000663876/exam-submissions-queue',
  handleMessage: async (message) => {
    try {
      console.log("from consumer ");
      const messageBody = JSON.parse(message.Body || '');

      const { userId, lastResponse, submittedAnswers } = messageBody;
      const shuffledQuestionOrder = lastResponse.shuffledQuestionOrder; // Assuming you store the shuffled order in the Response
      const currentExam = lastResponse?.currentExam;
      const examAnswers = [];

      for (let i = 0; i < shuffledQuestionOrder.length; i++) {
        const questionIndex = shuffledQuestionOrder[i];
        const exam_answers = new Exam_answers();
        exam_answers.response = lastResponse;
        exam_answers.user = lastResponse.user;
        exam_answers.exam = currentExam;
        exam_answers.answer = submittedAnswers[i];
        exam_answers.question = currentExam?.questions[questionIndex - 1];
        await exam_answers.save();
        examAnswers.push(exam_answers);
      }

      let totalScore = 0;

      for (let i = 0; i < currentExam?.questions?.length; i++) {
        const questionIndex = shuffledQuestionOrder[i];
        const shuffledAnswer = submittedAnswers[i];

        if (
          currentExam.questions &&
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
            console.error(
              "Question is undefined for index:",
              questionIndex
            );
          }
        } else {
          console.error("Invalid question index:", questionIndex);
        }
      }

      lastResponse.totalScore = totalScore;
      lastResponse.exam_answers = examAnswers;
      lastResponse.status = "done";
      await lastResponse.save();

      await sqsClient.send(new DeleteMessageCommand({
        QueueUrl: 'https://sqs.us-east-1.amazonaws.com/918000663876/exam-submissions-queue',
        ReceiptHandle: message.ReceiptHandle,
      }));
    } catch (error) {
      console.error('Error processing message:', error);
    }
  },
});

queueConsumer.on('error', (err) => {
  console.error('Error:', err.message);
});

export default queueConsumer;
