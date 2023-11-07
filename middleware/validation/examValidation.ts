import { Request, Response, NextFunction } from "express";
import moment from "moment-timezone";
import baseLogger from "../../log.js";

function validateCreateExam(req: Request, res: Response, next: NextFunction) {
  const { title, startTime, duration, questionsIds } = req.body;

  const timezone = "Asia/Riyadh";

  if (!title) {
    baseLogger.error(`Can't create exam without title`);
    return res.status(400).json({ msg: "title is required" });
  }

  if (!duration) {
    baseLogger.error(`Can't create exam without duration`);
    return res.status(400).json({ msg: "exam must have duration" });
  }

  if (!startTime) {
    baseLogger.error(`Can't create exam without start time`);
    return res.status(400).json({ msg: "exam must have startTime" });
  } else {
    const currentTime = moment.tz(timezone);
    const StartTime = convertStartTime(startTime);

    if (currentTime > StartTime) {
      baseLogger.error(
        `Can't create exam with start time before the time of creating that exam`
      );
      return res.status(400).json({
        error: "Bad request",
        message: "The start time must be in the future",
      });
    }
  }

  if (!questionsIds) {
    return res
      .status(400)
      .json({ msg: "questions is required , No empty Exam" });
  }

  next();
}

function convertStartTime(time: any) {
  const timezone = "Asia/Riyadh";
  const convertedTime = moment.tz(time, timezone).subtract(3, "hours");
  return convertedTime;
}

export { validateCreateExam, convertStartTime };
