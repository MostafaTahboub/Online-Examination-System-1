import { Request, Response } from "express";
import { Question } from "../DB/Entities/Question.js";
import { Subject } from "../DB/Entities/Subject.js";

const insertQuestion = (async (req: Request, res: Response) => {

    const { text, name, weight, options, answer, order, subjectName, question_TypeId } = req.body;

    const newQuestion = new Question();
    newQuestion.name = name;
    newQuestion.text = text;
    newQuestion.weight = weight;
    newQuestion.answer = answer;
    newQuestion.order = order;
    newQuestion.type = question_TypeId;
    newQuestion.options = options;

    const existingSubject = await Subject.findOneBy(subjectName);

    if (!existingSubject) {
        const newSubject = new Subject();
        newSubject.name = req.body.subjectName;
        await newSubject.save();
        newQuestion.subject = newSubject;
    } else {

        newQuestion.subject = existingSubject;
    }


    await newQuestion.save()
        .then(() => {
            res.status(201).json({
                msg: "question created succefully ",
                qustion: newQuestion
            })
        })
        .catch((err) => {
            console.error("failed to create this quesion " + err);
            res.status(500).json({ msg: "Error creating question " });
        })
});


const updateQuestion = (async (req: Request, res: Response) => {
    const questionName = String(req.query.name);
    const existingQuestion = await Question.findOneBy({ name: questionName });

    if (existingQuestion === null) {
        return res.status(404).json({ msg: 'Question not found' });
    }

    const { text, name, weight, options, answer, order } = req.body;

    existingQuestion.name = name;
    existingQuestion.text = text;
    existingQuestion.answer = answer;
    existingQuestion.weight = weight;
    existingQuestion.order = order;

    if (existingQuestion.options !== null) {
        existingQuestion.options = options;
    }

    await existingQuestion.save()
        .then(() => {
            res.status(200).json({ msg: "question has been upadated successfully ", existingQuestion });
        })
        .catch((err) => {
            console.error("something went wrong while updateing Q " + err);
            res.status(500).json({ msg: 'Failed to update question ' });
        })
});


const getAllQuestions = (async (req: Request, res: Response) => {
    try {
        const page = Number(req.query.page || '1');
        const pageSize = Number(req.query.size || '10');

        const [items, total] = await Question.findAndCount({
            skip: pageSize * (page - 1),
            take: pageSize,
            order: {
                createdAt: 'ASC'
            },
        });

        res.send({
            page,
            pageSize: items.length,
            total,
            items
        });

    } catch (error) {
        res.status(500).json({ err: "something went wrong" });
        console.error("Error ocurred while getting all questions : " + error);
    }
});



export { insertQuestion, updateQuestion, getAllQuestions };
