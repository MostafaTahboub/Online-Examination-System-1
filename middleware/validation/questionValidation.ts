import { Request, Response, NextFunction } from "express";
import { Question } from "../../DB/Entities/Question.js";
import baseLogger from "../../log.js";

async function validateCreateQuestion(req:Request,res:Response,next:NextFunction){

const {text,answer,order}=req.body;
if (!text)
{
  baseLogger.error(`Trying to log in with invalid credentials`)
    return res.status(400).json({err:"text is required"});
}


  next();
}

export { validateCreateQuestion };
