import express from "express";
import { User } from "../../DB/Entities/User.js";
import baseLogger from "../../log.js";

const validateUserLogin = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const values = ["email", "password"];
  const user = req.body;
  let errorList: string[] = [];

  values.forEach((key) => {
    if (!user[key]) {
      errorList.push(`${key} is Required to LogIn!`);
    }
  });

  if (errorList.length) {
    baseLogger.error(`Trying to log in with missed credentials`);
    res.status(400).send(errorList);
  } else {
    const x = User.findOneBy({ email: user.email });
    if (x === null) {
      baseLogger.error(`Trying to log in with invalid credentials`);
      res.status(500).send("Inter valid credentials");
    } else {
      next();
    }
  }
};

export { validateUserLogin };
