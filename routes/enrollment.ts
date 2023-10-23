import express from "express";
import { User } from "../DB/Entities/User.js";
import { validateExamEnrollment, validateUserEnrollment, }
  from "../middleware/validation/enrollmentValidation.js";
import { Exam } from "../DB/Entities/Exam.js";
import { Enrollment } from "../DB/Entities/Enrollment.js";
import baseLogger from "../log.js";

var router = express.Router();

router.post("/enroll", validateUserEnrollment, validateExamEnrollment, async (req, res) => {
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
      baseLogger.info(`Trying to enroll user already enrolled in the same exam`);
      return res.status(403).send("The student already enrolled in this exam ");
    }

    const enrollment = new Enrollment();
    enrollment.user = userId;
    enrollment.exam = examId;

    await enrollment.save();
    baseLogger.info(`Enrollment created successfully: ${enrollment.id}`);
    res.status(201).json({ msg: "enrollment created successfully", enrollment });

  } catch (error) {
    baseLogger.error("Error while creating Enrollment" + error);
    res.status(500).send("something went Wrong");
  }
}
);

export default router;
