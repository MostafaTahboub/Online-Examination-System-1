import { Request, Response, NextFunction } from "express";
import { Question } from "../../DB/Entities/Question.js";
import baseLogger from "../../log.js";

async function validateCreateQuestion(req:Request,res:Response,next:NextFunction){

  const values = ["text", "answer", "type", "weight"];
  const question = req.body;
  const errorList = [];
  // const errorList = values.map(key => !question[key] && `${key} is Required!`).filter(Boolean);
  values.forEach((key) => {
    if (!question[key]) {
      return errorList.push(`${key} is Required to create User!`);
    }
  });

if (errorList.length > 0)
{
  baseLogger.error(`Trying to log in with invalid credentials`)
    return res.status(400).send("All fiels are required")
}


  next();
}

export { validateCreateQuestion };
