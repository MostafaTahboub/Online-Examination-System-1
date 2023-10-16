import express from "express";
import { User } from "../../DB/Entities/User.js";
const validateUserLogin = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const values = ["email", "password"];
  const user = req.body;
  let errorList: string[] = [];
  // const errorList = values.map(key => !user[key] && `${key} is Required!`).filter(Boolean);
  values.forEach((key) => {
    if (!user[key]) {
      return errorList.push(`${key} is Required to LogIn!`);
    }
  });

  if (errorList.length) {
    res.status(400).send(errorList);
  } else {
    const x = User.findOneBy({ email: user.email });
    if (x === null) {
      res.status(500).send("Inter valid credentials");
    } else {
      next();
    }
  }
};

export { validateUserLogin };
