import { Request, Response, NextFunction } from 'express';
import { Question } from '../../DB/Entities/Question.js';

async function validateCreateQuestion(req:Request,res:Response,next:NextFunction){

const {name,text,answer,order}=req.body;
if (!text)
{
    return res.status(400).json({err:"text is required"});
}
if (!name)
{
    return res.status(400).json({err:"name is required"});
}
if(name){
  const existingName= await Question.findOneBy({name:name});
  if (existingName){
    return res.status(409).send("try another name , there are question existing with this name ");
  }
}
if (!answer)
{
    return res.status(400).json({err:"answer is required"});
}
if (!order)
{
    return res.status(400).json({err:"order is required"});
}

 next();
}

export { validateCreateQuestion };
