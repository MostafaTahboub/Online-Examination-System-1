import express from "express";
import baseLogger from "../../log.js";
const validateResponse = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const values = ["user", "exam", "score"];
  const errorList = values
    .map((key) => !req.body[key] && `${key} is Required`)
    .filter(Boolean);
  if (errorList.length) {
    baseLogger.error(`There are missid valuse for creating exam`);
    res.status(400).send(errorList);
  } else {
    next();
  }
};

export { validateResponse };
