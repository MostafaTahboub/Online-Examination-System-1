import { Request, Response, NextFunction } from "express";
import { User } from "../../DB/Entities/User.js";
import { Exam } from "../../DB/Entities/Exam.js";

const validateUserEnrollment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req.body;
  const existingUser = await User.findOneBy({ id: userId });

  if (!existingUser) {
    return res.status(404).send("there are no user with this id ");
  } else {
    if (existingUser.role.roleName != "user") {
      return res.status(403).send("this user is not a student");
    } else {
      next();
    }
  }
};

const validateExamEnrollment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { examId } = req.body;
  const existingExam = await Exam.findOneBy({ id: examId });
  const currentTime = new Date();

  if (!existingExam) {
    return res.status(404).send("there are no exam with this Id");
  } else {
    if (currentTime > existingExam.endTime) {
      return res
        .status(403)
        .send("Enrollment is not allowed becasuse the exam has ended");
    } else if (currentTime < existingExam.startTime) {
      return res
        .status(403)
        .send(
          `Enrollment is not allowed becasuse the exam hasn't started yet, startTime: ${existingExam.startTime} `
        );
    } else {
      next();
    }
  }
};

export { validateExamEnrollment, validateUserEnrollment };
