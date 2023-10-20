import { Request, Response, NextFunction } from 'express';
import moment from 'moment-timezone';


function validateCreateExam(req: Request, res: Response, next: NextFunction) {
  // should add exam answers in validation here 
  const { title, score, startTime, duration, questionsIds } = req.body;

  const timezone = 'Asia/Riyadh';
  // const StartTime= moment.tz(startTime,timezone);

  if (!title) {
    return res.status(400).json({ msg: "title is required" });
  }

  if (!duration) {
    return res.status(400).json({ msg: "exam must have duration" });
  }

  if (!startTime) {
    return res.status(400).json({ msg: "exam must have startTime" });
  } else {
    const currentTime = moment.tz(timezone);
    const StartTime = convertStartTime(startTime);

    if (currentTime > StartTime) {
      return res.status(400).json({
        error: 'Bad request',
        message: 'The start time must be in the future'
      });
    }
  }
  if (!score) {
    return res.status(400).send("exam must have score ");
  }

  if (!questionsIds) {
    return res
      .status(400)
      .json({ msg: "questions is required , No empty Exam" });
  }

  next();
}

function convertStartTime(time: any) {
  const timezone = 'Asia/Riyadh';
  const convertedTime = moment.tz(time, timezone).subtract(3, 'hours');
  return convertedTime;
}


export { validateCreateExam , convertStartTime};
