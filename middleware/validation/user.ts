import express from "express";
import isEmail from "validator/lib/isEmail.js";
import { User } from "../../DB/Entities/User.js";
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
    name: req.body.userName,
  });

  if (test) {
    return res.status(500).send("choose another userName :)");
  }

  if (user.type !== "instructor" && user.type !== 'student') {
    errorList.push(`There are no such role!`);
  }

  if (errorList.length) {
    res.status(400).send(errorList);
  } else {
    next();
  }
};

export { validateUser };
