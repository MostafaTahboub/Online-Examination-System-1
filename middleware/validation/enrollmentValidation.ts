import { Request, Response, NextFunction } from "express";
import { User } from "../../DB/Entities/User.js";
import { Exam } from "../../DB/Entities/Exam.js";
import baseLogger from "../../log.js";

const validateUserEnrollment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).send("Enter the userId");
  }
  const existingUser = await User.findOneBy({ id: userId });

  if (!existingUser) {
    baseLogger.error(`Tring to enroll user dosn't exist to exam`);
    return res.status(404).send("there are no user with this id ");
  } else {
    if (existingUser.role.roleName != "student") {
      baseLogger.error(`Trying to enroll somone with no student role to exam`);
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
  if (!examId) {
    return res.status(400).send("Enter the examId");
  }
  const existingExam = await Exam.findOneBy({ id: examId });

  if (!existingExam) {
    baseLogger.info(`Tring to enroll somone to exam dosn't exist`);
    return res.status(404).send("there are no exam with this Id");
  } else {
    const currentTime = new Date();
    const examEndTime = new Date(
      existingExam.startTime.getTime() + existingExam.duration * 60 * 1000
    );
    if (currentTime > examEndTime) {
      baseLogger.info(`Enrollment is not allowed becasuse the exam has ended`);
      return res
        .status(403)
        .send("Enrollment is not allowed becasuse the exam has ended");
    }
    next();
  }
};

export { validateExamEnrollment, validateUserEnrollment };
