import { Request, Response, NextFunction } from 'express';

function validateCreateQuestion(req:Request,res:Response,next:NextFunction){

const {name,text,answer,order}=req.body;
if (!text)
{
    return res.status(400).json({err:"text is required"});
}
if (!name)
{
    return res.status(400).json({err:"name is required"});
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
