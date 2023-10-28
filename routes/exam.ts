import express, { response } from "express";
import {
  createExam,
  createExamRandom,
  shuffleArray,
  randomizeQuestions,
  updateExam,
  fetchQuestionsForExam,
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
import AWS from 'aws-sdk';

AWS.config.update({
  accessKeyId: 'YOUR_AWS_ACCESS_KEY',
  secretAccessKey: 'YOUR_AWS_SECRET_ACCESS_KEY',
  region: 'us-east-1',
});

var router = express.Router();

router.post("/new", authenticate, authorize("POST_Exam"), validateCreateExam, async (req, res) => {
  try {
    await createExam(req, res);
  } catch (error) {
    console.error("Error ocurred while creating the Exam" + error);
    res.status(500).send("something went wrong when trying to create the Exam");
  }
});

// need some validation here
router.post("/newByRandom", authenticate, authorize("POST_Exam"), async (req, res) => {
  try {
    await createExamRandom(req, res);
  } catch (error) {
    console.error("error while creating Random Exam" + error);
    res.status(500).json({ message: "Failed to create the exam" });
  }
});

router.put("/edit",authenticate, authorize("PUT_Exam"), async (req, res) => {
  try {
    await updateExam(req, res);
    res.status(201).send("Exam updated succeffylly");
  } catch (error) {
    console.error("Error ocurred while updated the Exam" + error);
    res.status(500).send("something went wrong when trying to update the Exam");
  }
});


router.get("/getExam/:id", authenticate, authorize("GET_Exam"), async (req, res) => {
  try {
    const id = Number(req.params.id);
    if(!id)
    {
      return res.status(400).send("Exam id required")
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


router.delete("/delete/:id", authenticate, authorize("DELETE_Exam"), async (req, res) => {
  try {
    const id = Number(req.params.id);
    if(!id)
    {
      return res.status(400).send("Exam id required")
    }
    const existingExam = await Exam.findOneBy({ id });

    if (!existingExam) {
      return res.status(404).send("there are no exam , give me existing Exam ");
    } else {
      const currentTime = new Date();
      const examEndTime = new Date(
        existingExam.startTime.getTime() + existingExam.duration * 60 * 1000
      );

      if (currentTime < examEndTime) {
        return res.status(400).send("you cant delete , this exam in progress ");
      } else {
        await existingExam.remove();
        res.status(200).send("exam deleted succeffuly");
      }
    }
  } catch (error) {
    console.error("error occurred during creation of Exam");
    res.status(500).send("something went wrong");
  }
});


router.post("/start", authenticate, authorize("Take_Exam"), async (req, res) => {
  try {
    console.log("from start");
    const token = req.cookies.token;
    const examId = req.body.examId;
    const password = req.body.password;
    if(!examId || !password)
    {
      return res.status(400).send("Exam id and password required")
    }

    // Find the exam with the provided examId
    const exam = await Exam.findOne({
      where: {
        id: examId,
      },
      relations: ["questions"],
    });

    if (!exam) {
      return res.status(404).send("Exam not found");
    }

    // Shuffle the order of questions
    const shuffledOrder = exam.questions.map((question) => question.id);
    shuffleArray(shuffledOrder); // Shuffle the order
    const shuffledOrderJSON = JSON.stringify(shuffledOrder);

    console.log({ questions: shuffledOrder });
    console.log({ questions: shuffledOrderJSON });

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

    // Check if the user is enrolled in the exam
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

    // Check for duplicate responses in progress
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

    // console.log(dublicateResponse);
    if (dublicateResponse) {
      return res.status(403).send("You can't enter the exam more than once.");
    }

    // Check if the exam is within the allowed time frame
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

    // Create a new response and save it
    const newResponse = new Response();
    newResponse.exam = exam;
    newResponse.user = user;
    newResponse.status = "inProgress";
    newResponse.shuffledQuestionOrder = shuffledOrder;
    await newResponse.save();

    res
      .status(200)
      .send("Exam started successfully. Be careful when submitting answers.");
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while starting the exam.");
  }
});



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

      console.log("Last Response:", lastResponse);

      if (lastResponse) {
        const currentExamId = lastResponse.exam.id;
        console.log(currentExamId);
        const currentExam = await Exam.findOne({
          where: {
            id: currentExamId,
          },
          relations: ["questions"],
        });
        console.log("Current Exam:", currentExam);
        console.log("Current Exam Questions:", currentExam?.questions);

        if (currentExam) {
          const currentTime = new Date();
          const examEndTime = new Date(
            currentExam.startTime.getTime() + currentExam.duration * 60 * 1000
          );

          console.log("Current Time:", currentTime);
          console.log("Exam End Time:", examEndTime);

          if (examEndTime < currentTime) {
            lastResponse.totalScore = 0;
            await lastResponse.save();
            return res
              .status(404)
              .send(
                "The exam has finished. You can't submit. See you in the summer."
              );
          }

          const shuffledQuestionOrder = lastResponse.shuffledQuestionOrder; // Assuming you store the shuffled order in the Response

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

          let totalScore = 0;

          for (let i = 0; i < currentExam.questions.length; i++) {
            const questionIndex = shuffledQuestionOrder[i];
            const shuffledAnswer = submittedAnswers[i];

            // Check if currentExam.questions[questionIndex] exists and is an object
            if (
              currentExam.questions &&
              questionIndex >= 0 &&
              questionIndex <= currentExam.questions.length
            ) {
              const question = currentExam.questions[questionIndex - 1];

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

          res.status(200).json({
            msg: "The exam has finished, and the response has been submitted. Best of luck!",
            totalScore: totalScore,
          });
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


export default router;
