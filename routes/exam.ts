import express, { response } from "express";
import {
  createExam,
  createExamRandom,
  shuffleArray,
  randomizeQuestions,
  updateExam,
} from "../controllers/exam.js";
import { validateCreateExam } from "../middleware/validation/examValidation.js";
import { Exam } from "../DB/Entities/Exam.js";
import { authenticate } from "../middleware/auth/authenticate.js";
import { authorize } from "../middleware/auth/authorize.js";
import { Enrollment } from "../DB/Entities/Enrollment.js";
import { Response } from "../DB/Entities/Response.js";
import jwt from "jsonwebtoken";
import { Exam_answers } from "../DB/Entities/Exam_answers.js";
import { User } from "../DB/Entities/User.js";
import { sqsClient, SendMessageCommand } from "../aws-config.js"; // Adjust the path
import AWS from "aws-sdk";

AWS.config.update({
  region: "us-east-1",
  accessKeyId: process.env.ACCESS_KEY,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
});

var router = express.Router();

router.post(
  "/",
  authenticate,
  authorize("POST_Exam"),
  validateCreateExam,
  async (req, res) => {
    try {
      await createExam(req, res);
    } catch (error) {
      console.error("Error ocurred while creating the Exam" + error);
      res
        .status(500)
        .send("something went wrong when trying to create the Exam");
    }
  }
);

router.post(
  "/random",
  authenticate,
  authorize("POST_Exam"),
  async (req, res) => {
    try {
      await createExamRandom(req, res);
    } catch (error) {
      console.error("error while creating Random Exam" + error);
      res.status(500).json({ message: "Failed to create the exam" });
    }
  }
);

router.put("/", authenticate, authorize("PUT_Exam"), async (req, res) => {
  try {
    await updateExam(req, res);
    res.status(201).send("Exam updated succeffylly");
  } catch (error) {
    console.error("Error ocurred while updated the Exam" + error);
    res.status(500).send("something went wrong when trying to update the Exam");
  }
});

router.get("/:id", authenticate, authorize("GET_Exam"), async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) {
      return res.status(400).send("Exam id required");
    }

    const existingExam = await Exam.findOne({
      where: { id: id },
      relations: ["questions"],
    });

    if (existingExam === null) {
      return res.status(404).json({ msg: "Exam not found" });
    }

    res.status(200).json({ exam: existingExam });
  } catch (error) {
    console.error("Error ocurred while getting the exam" + error);
    res.status(500).send("internal server error ");
  }
});

router.delete(
  "/:id",
  authenticate,
  authorize("DELETE_Exam"),
  async (req, res) => {
    try {
      const id = Number(req.params.id);
      if (!id) {
        return res.status(400).send("Exam id required");
      }
      const existingExam = await Exam.findOneBy({ id });

      if (!existingExam) {
        return res
          .status(404)
          .send("there are no exam , give me existing Exam ");
      } else {
        const currentTime = new Date();
        const examEndTime = new Date(
          existingExam.startTime.getTime() + existingExam.duration * 60 * 1000
        );

        if (currentTime < examEndTime) {
          return res
            .status(400)
            .send("you cant delete , this exam in progress ");
        } else {
          await existingExam.remove();
          res.status(200).send("exam deleted succeffuly");
        }
      }
    } catch (error) {
      console.error("error occurred during creation of Exam");
      res.status(500).send("something went wrong");
    }
  }
);

router.post(
  "/start",
  authenticate,
  authorize("Take_Exam"),
  async (req, res) => {
    try {
      console.log("from start");
      const token = req.cookies.token;
      const examId = req.body.examId;
      const password = req.body.password;
      if (!examId || !password) {
        return res.status(400).send("Exam id and password required");
      }
      const exam = await Exam.findOne({
        where: {
          id: examId,
        },
        relations: ["questions"],
      });

      if (!exam) {
        return res.status(404).send("Exam not found");
      }
      const shuffledOrder = exam.questions.map((question) => question.id);
      shuffleArray(shuffledOrder);
      const shuffledOrderJSON = JSON.stringify(shuffledOrder);
      const questionsInShuffledOrder = shuffledOrder.map((questionIndex) => {
        return exam.questions.find((question) => question.id === questionIndex);
      });

      const simplifiedQuestions = questionsInShuffledOrder.map((question) => {
        const id = question?.id;
        const text = question?.text;
        const weight = question?.weight;
        const type = question?.type;
        const options = question?.options;

        return {
          id,
          text,
          weight,
          type,
          options,
        };
      });

      const comparingPassword = exam.password === password;
      const decoded = jwt.decode(token, { json: true });

      if (!decoded) {
        return res.status(400).send("Invalid token");
      }

      if (!comparingPassword) {
        return res.status(400).send("password isn't correct");
      }

      const userId = decoded.userId;
      const user = await User.findOneBy({ id: userId });

      if (!user) {
        return res.status(404).send("User not found");
      }

      const enrollmentUserInExam = await Enrollment.findOne({
        where: {
          user: {
            id: userId,
          },
          exam: {
            id: examId,
          },
        },
      });

      if (!enrollmentUserInExam) {
        return res.status(403).send("You are not enrolled in this exam.");
      }
      const dublicateResponse = await Response.findOne({
        relations: {
          user: true,
          exam: true,
        },
        where: {
          user: {
            id: userId,
          },
          exam: {
            id: examId,
          },
          status: "inProgress",
        },
      });

      if (dublicateResponse) {
        return res.status(403).send("You can't enter the exam more than once.");
      }
      const currentTime = new Date();
      const examEndTime = new Date(
        exam.startTime.getTime() + exam.duration * 60 * 1000
      );
      console.log(exam.startTime);
      console.log(currentTime);

      if (currentTime < exam.startTime) {
        return res
          .status(400)
          .send(
            "You are a good student (NERD), but please wait until the exam starts."
          );
      }

      if (currentTime > examEndTime) {
        return res
          .status(400)
          .send("The exam time has ended. See you in the summer.");
      }
      const newResponse = new Response();
      newResponse.exam = exam;
      newResponse.user = user;
      newResponse.status = "inProgress";
      newResponse.shuffledQuestionOrder = shuffledOrder;
      await newResponse.save();

      res.status(200).json({
        msg: "Exam started successfully. Be careful when submitting answers.",
        questions: simplifiedQuestions,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("An error occurred while starting the exam.");
    }
  }
);

router.post("/submit", async (req, res) => {
  try {
    console.log("from submit ");
    const token = req.cookies.token;
    const { submittedAnswers } = req.body;
    const decoded = jwt.decode(token, { json: true });

    if (decoded) {
      const userId = decoded.userId;
      console.log(`User ID: ${userId}`);

      const lastResponse = await Response.findOne({
        relations: {
          user: true,
          exam: true,
        },
        where: {
          user: userId,
          status: "inProgress",
        },
        order: {
          createdAt: "DESC",
        },
      });

      if (lastResponse) {
        const currentExamId = lastResponse.exam.id;
        console.log(currentExamId);
        const currentExam = await Exam.findOne({
          where: {
            id: currentExamId,
          },
          relations: ["questions"],
        });

        if (currentExam) {
          const currentTime = new Date();
          const examEndTime = new Date(
            currentExam.startTime.getTime() + currentExam.duration * 60 * 1000
          );

          if (examEndTime < currentTime) {
            lastResponse.totalScore = 0;
            await lastResponse.save();
            return res
              .status(404)
              .send(
                "The exam has finished. You can't submit. See you in the summer."
              );
          }

          const shuffledQuestionOrder = lastResponse.shuffledQuestionOrder;

          const examAnswers = [];

          for (let i = 0; i < shuffledQuestionOrder.length; i++) {
            const questionIndex = shuffledQuestionOrder[i];
            const exam_answers = new Exam_answers();
            exam_answers.response = lastResponse;
            exam_answers.user = lastResponse.user;
            exam_answers.exam = currentExam;
            exam_answers.answer = submittedAnswers[i];
            exam_answers.question = currentExam.questions[questionIndex - 1];
            await exam_answers.save();
            examAnswers.push(exam_answers);
          }

          lastResponse.exam_answers = examAnswers;
          await lastResponse.save();
          const sendMessageCommand = new SendMessageCommand({
            QueueUrl:
              "https://sqs.us-east-1.amazonaws.com/918000663876/exam-submissions-queue",
            MessageBody: JSON.stringify({
              lastResponseId: lastResponse.id,
              submittedAnswers: submittedAnswers,
              userId: userId,
            }),
          });

          try {
            await sqsClient.send(sendMessageCommand);
            res.status(200).json({ message: "Exam submission in progress." });
          } catch (error) {
            console.error("Error sending message to SQS:", error);
            res.status(500).json({ message: "Error submitting the exam." });
          }
        } else {
          return res.status(500).send("No valid exam found for the user.");
        }
      } else {
        return res
          .status(500)
          .send("Something went wrong. make the start exam before .");
      }
    } else {
      return res.status(400).send("Invalid token");
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while submitting the exam." });
  }
});

router.get("/mark", async (req, res) => {
  try {
    const token = req.cookies.token;
    const examId = req.body.examId;
    const decoded = jwt.decode(token, { json: true });
    if (decoded) {
      const userId = decoded.userId;
      console.log(userId);
      const exam = await Exam.findOneBy({ id: examId });

      const response = await Response.findOne({
        relations: {
          user: true,
          exam: true,
        },
        where: {
          user: {
            id: userId,
          },
          exam: {
            id: examId,
          },
        },
      });

      console.log(response);

      if (!response) {
        res.status(404).send("there is no respones wiht this exam");
      }

      res
        .status(200)
        .send(`Your totalScore is ${response?.totalScore}/${exam?.score}`);
    }
  } catch (error) {
    res.status(500).send("something is went wrong ");
    console.error(error);
  }
});

export default router;
