import { Request, Response, NextFunction } from "express";

function validateCreateExam(req: Request, res: Response, next: NextFunction) {
  // should add exam answers in validation here
  const { name, questionsIds } = req.body;

  if (!name) {
    return res.status(400).json({ msg: "name is required" });
  }

  if (!questionsIds) {
    return res
      .status(400)
      .json({ msg: "questions is required , No empty Exam" });
  }

  next();
}

export { validateCreateExam };
