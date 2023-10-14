import { Request, Response } from "express";
import moment from "moment";
import { Exam } from "../DB/Entities/Exam.js";
import { Question } from "../DB/Entities/Question.js";
import { In } from "typeorm";



const createExam = async (req: Request, res: Response) => {

    const { name, duration, endTime, startTime, questionsIds } = req.body;
    const newExam = new Exam();
    newExam.name = name;
    
    const startTimeMoment = moment(startTime, 'h:mm A');
    
    const endTimeMoment = moment(endTime, 'h:mm A');
    
    if (!startTimeMoment.isValid()) {
        return res.status(400).json({ error: 'Invalid start time format' });
    }
    
    if (!endTimeMoment.isValid()) {
        return res.status(400).json({ error: 'Invalid start end format' });
    }

    
    const questions = await Question.find({
        where: {
            id: In(questionsIds)
        }
    });
    
    newExam.questions = questions;
    
    const startTimeDate = startTimeMoment.toDate(); 
    const endTimeDate = endTimeMoment.toDate(); 
    
    newExam.startTime = startTimeDate;
    newExam.endTime = endTimeDate;
    
    const durationMilliseconds = newExam.endTime.getTime() - newExam.startTime.getTime();
    const durationMinutes = Math.floor(durationMilliseconds / (1000 * 60)); 

    newExam.duration = durationMinutes;
    
    
    await newExam.save()
}

// const existingExam = await Exam.findOne({
//     where: { name: examName },
//     relations: ['Question']
// });

const updateExam = (async (req: Request, res: Response) => {
    const examName = String(req.query.name);
    const existingExam = await Exam.findOneBy({name:examName});

    if (existingExam === null) {
        return res.status(404).json({ msg: 'Question not found' });
    }

    const { name, duration, endTime, startTime, questionsIds } = req.body;

    existingExam.name = name;
    existingExam.duration = duration;
    existingExam.startTime = startTime;
    existingExam.endTime = endTime;
    existingExam.questions = questionsIds;
    const startTimeMoment = moment(startTime, 'h:mm A');

    const endTimeMoment = moment(endTime, 'h:mm A');

    if (!startTimeMoment.isValid()) {
        return res.status(400).json({ error: 'Invalid start time format' });
    }

    if (!endTimeMoment.isValid()) {
        return res.status(400).json({ error: 'Invalid start end format' });
    }

    const questions = await Question.find({
        where: {
            id: In(questionsIds)
        }
    });

    const startTimeDate = startTimeMoment.toDate(); // As JavaScript Date
    const endTimeDate = endTimeMoment.toDate(); // As JavaScript Date
    existingExam.startTime = startTimeDate;
    existingExam.endTime = endTimeDate;
    existingExam.questions = questions;
});


const createExamRandom=async(req:Request,res:Response)=>{

    const { name, startTime, endTime, duration } = req.body;
    const numberOfRandomQuestions = 10;
    
    const exam = new Exam();
    exam.name=name;
    exam.duration = duration;

    const randomQuestions = await Question
    .createQueryBuilder('question')
    .orderBy('RAND()')
    .limit(numberOfRandomQuestions)
    .getMany();
    
    const startTimeMoment = moment(startTime, 'h:mm A');

    const endTimeMoment = moment(endTime, 'h:mm A');

    if (!startTimeMoment.isValid()) {
        return res.status(400).json({ error: 'Invalid start time format' });
    }

    if (!endTimeMoment.isValid()) {
        return res.status(400).json({ error: 'Invalid start end format' });
    }

    const startTimeDate = startTimeMoment.toDate(); 
    const endTimeDate = endTimeMoment.toDate(); 
      
    exam.startTime = startTimeDate;
    exam.endTime = endTimeDate;
    
    exam.questions = randomQuestions;

    const createdExam = await exam.save();

    res.status(201).json({ message: 'Exam created with random questions', exam: createdExam });

}


export { createExam, updateExam ,createExamRandom };