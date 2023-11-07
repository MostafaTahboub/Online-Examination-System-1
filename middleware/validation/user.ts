import express from "express";
import isEmail from "validator/lib/isEmail.js";
import { User } from "../../DB/Entities/User.js";
import baseLogger from "../../log.js";

const validateUser = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const values = ["name", "userName", "email", "password", "type"];
  const user = req.body;
  const errorList = [];
  // const errorList = values.map(key => !user[key] && `${key} is Required!`).filter(Boolean);
  values.forEach((key) => {
    if (!user[key]) {
      return errorList.push(`${key} is Required to create User!`);
    }
  });

  if (!isEmail.default(user.email)) {
    errorList.push("Email is not Valid");
  }

  if (user.password.length < 6) {
    errorList.push("Password should contain at least 6 characters!");
  }

  const test = await User.findOneBy({
    email: req.body.email,
  });

  if (test) {
    return res.status(409).send("choose another email :)");
  }

  const test1 = await User.findOneBy({
    username: req.body.userName,
  });

  if (test) {
    return res.status(409).send("choose another username :)");
  }
  if (user.type !== "instructor" && user.type !== "student") {
    errorList.push(`There are no such role!`);
  }

  if (errorList.length) {
    baseLogger.error(
      "data provided to create user don't match the restrictions"
    );
    res.status(400).send(errorList);
  } else {
    next();
  }
};

export { validateUser };
