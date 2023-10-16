import express from "express";
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
    res.status(400).send(errorList);
  } else {
    next();
  }
};

export { validateResponse };
