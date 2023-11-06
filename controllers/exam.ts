import { Request, Response as response } from "express";
import { Exam } from "../DB/Entities/Exam.js";
import { Question } from "../DB/Entities/Question.js";
import { In } from "typeorm";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import { convertStartTime } from "../middleware/validation/examValidation.js";

const createExam = async (req: Request, res: response) => {
  const { title, duration, password, startTime, questionsIds } = req.body;
  const newExam = new Exam();
  newExam.title = title;
  newExam.startTime = convertStartTime(startTime).toDate();
  newExam.duration = duration;
  newExam.password = password;
  newExam.code = generateExamCode(title);

  const [questions, numberOfQuestions] = await Question.findAndCount({
    where: {
      id: In(questionsIds),
    },
  });
  let ExamScore = 0;

  for (let i = 0; i < questions.length; i++) {
    ExamScore += questions[i].weight;
  }

  newExam.score = ExamScore;
  newExam.questions = questions;
  newExam.numberOfQuestions = numberOfQuestions;
  await newExam.save();
  res.status(201).json({ msg: "exam create successfully", exam: newExam });
};

const updateExam = async (req: Request, res: response) => {
  const examId = Number(req.params.id);
  const existingExam = await Exam.findOneBy({ id: examId });

  if (existingExam === null) {
    return res.status(404).json({ msg: "Exam not found" });
  }

  const examData = req.body;

  existingExam.title = examData.title;
  existingExam.duration = examData.duration;
  existingExam.startTime = moment(examData.startTime).toDate();
  existingExam.score = examData.score;
  const [questions, num] = await Question.findAndCount({
    where: {
      id: In(examData.questionsIds),
    },
  });
  existingExam.numberOfQuestions = num;
  existingExam.questions = questions;
  existingExam.save();
};

const createExamRandom = async (req: Request, res: response) => {
  const { title, startTime, duration } = req.body;
  const numberOfRandomQuestions = req.body.numberOfQuestions;

  const exam = new Exam();
  exam.title = title;
  exam.duration = duration;
  exam.startTime = moment(startTime).toDate();

  const randomQuestions = await Question.createQueryBuilder("question")
    .orderBy("RAND()")
    .limit(numberOfRandomQuestions)
    .getMany();

  exam.questions = randomQuestions;

  const createdExam = await exam.save();

  res
    .status(201)
    .json({ message: "Exam created with random questions", exam: createdExam });
};

function shuffleArray(array: any) {
  if (array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
}

const randomizeQuestions = (exam: Exam) => {
  if (exam) {
    const qustions = exam.questions;

    shuffleArray(qustions);

    const qustionSet = qustions.slice(0, 10);

    return qustionSet;
  }
};

const fetchQuestionsForExam = async (exam: Exam) => {
  const questions = exam.questions;

  return questions;
};

function generateExamCode(title: string) {
  const uuid = uuidv4();

  const firstDigits = uuid.substring(0, 6);

  const formattedCode =
    title.replace(/\s+/g, "-").toLowerCase() + "-" + firstDigits;

  return formattedCode;
}

export {
  createExam,
  updateExam,
  createExamRandom,
  randomizeQuestions,
  generateExamCode,
  shuffleArray,
  fetchQuestionsForExam,
};
