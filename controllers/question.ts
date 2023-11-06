import { Request, Response } from "express";
import { Question } from "../DB/Entities/Question.js";
import { Subject } from "../DB/Entities/Subject.js";

const updateQuestion = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const question = await Question.findOneBy({ id: id });

  if (question === null) {
    return res.status(404).json({ msg: "Question not found" });
  }
  const questionData = req.body;

  const subject = await Subject.findOneBy({ name: questionData.subjectName });

  if (subject) {
    question.text = questionData.text;
    question.type = questionData.type;
    question.weight = questionData.weight;
    question.subject = subject;
  }

  if (question.type === "TrueFalse") {
    question.answer = questionData.answer;
  } else if (question.type === "MultipleChoice") {
    question.options = questionData.options;
    question.correctAnswer = questionData.correctAnswer;
  } else if (question.type === "FillInTheBlank") {
    question.blank = questionData.blanks;
    question.blankAnswer = questionData.blankAnswer;
  } else {
    return res.status(400).send("Invalid type");
  }

  await question
    .save()
    .then(() => {
      res
        .status(200)
        .json({ msg: "question has been upadated successfully ", question });
    })
    .catch((err) => {
      console.error("something went wrong while updateing Q " + err);
      res.status(500).json({ msg: "Failed to update question " });
    });
};

const getAllQuestions = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page || "1");
    const pageSize = Number(req.query.size || "10");

    const [items, total] = await Question.findAndCount({
      skip: pageSize * (page - 1),
      take: pageSize,
      order: {
        createdAt: "ASC",
      },
    });

    res.status(200).send({
      page,
      pageSize: items.length,
      total,
      items,
    });
  } catch (error) {
    res.status(500).json({ err: "something went wrong" });
    console.error("Error ocurred while getting all questions : " + error);
  }
};

export { updateQuestion, getAllQuestions };
