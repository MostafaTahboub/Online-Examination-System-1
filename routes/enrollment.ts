import express from "express";
import { User } from "../DB/Entities/User.js";
import {
  validateExamEnrollment,
  validateUserEnrollment,
} from "../middleware/validation/enrollmentValidation.js";
import { Exam } from "../DB/Entities/Exam.js";
import { Enrollment } from "../DB/Entities/Enrollment.js";
import baseLogger from "../log.js";
import { authenticate } from "../middleware/auth/authenticate.js";
import sendEmail from "../controllers/SES.js";
import { authorize } from "../middleware/auth/authorize.js";

var router = express.Router();

router.post(
  "/users",
  validateUserEnrollment,
  validateExamEnrollment,
  authenticate,
  authorize("POST_Enrollment"),
  async (req, res) => {
    try {
      const userId = req.body.userId;
      const examId = req.body.examId;

      const previousEnrollment = await Enrollment.find({
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

      if (!(previousEnrollment.length === 0)) {
        baseLogger.info(
          `Trying to enroll user already enrolled in the same exam`
        );
        return res
          .status(403)
          .send("The student already enrolled in this exam ");
      }

      const enrollment = new Enrollment();
      enrollment.user = userId;
      enrollment.exam = examId;

      await enrollment.save();
      const existingUser = await User.findOneBy({ id: userId });
      const existingExam = await Exam.findOneBy({ id: examId });
      sendEmail(
        `${existingUser?.email}`,
        "Exam Enrollment",
        `Hi ${existingUser?.name} you have been enrolled to exam with this id: ${existingExam?.id} starts at: ${existingExam?.startTime}. Get Ready , please use this passwrod : ${existingExam?.password}`
      );
      baseLogger.info(`Enrollment created successfully: ${enrollment.id}`);
      res
        .status(201)
        .json({ msg: "enrollment created successfully", enrollment });
    } catch (error) {
      baseLogger.error("Error while creating Enrollment" + error);
      res.status(500).send("something went Wrong");
    }
  }
);

export default router;
