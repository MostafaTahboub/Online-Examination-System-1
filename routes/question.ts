import express from "express";
import { getAllQuestions, updateQuestion } from "../controllers/question.js";
import { validateCreateQuestion } from "../middleware/validation/questionValidation.js";
import { Question } from "../DB/Entities/Question.js";
import { authenticate } from "../middleware/auth/authenticate.js";
import { authorize } from "../middleware/auth/authorize.js";
import { Subject } from "../DB/Entities/Subject.js";
import baseLogger from "../log.js";

var router = express.Router();

router.post('/new', authenticate,  validateCreateQuestion, async (req, res) => {

    const questionData = req.body;
    const question = new Question();

    const subject = await Subject.findOneBy({ id:questionData.subjectId });

    if (subject) {

        question.text = questionData.text;
        question.type = questionData.type;
        question.weight = questionData.weight;
        question.subject = subject;
    }
    if (question.type === 'TrueFalse') {
        if(questionData.answer && questionData.answer === ("T"||"F"))
        {question.answer = questionData.answer;}
        else {
            return res.status(400).send("invalid question answer")
        }
    } else if (question.type === 'MultipleChoice') {
        if(questionData.options)
        {question.options = questionData.options;}
        else {
            return res.status(400).send("Invalid options for multiple choice type questions");
        }
        if(questionData.correctAnswer && questionData.correctAnswer === ("A"||"B"||"C"||"D"))
        {question.correctAnswer = questionData.correctAnswer;}
        else {
            return res.status(400).send("invalid MCQ answer")
        }
    } else if (question.type === 'FillInTheBlank') {
        if(questionData.blanks)
        {question.blanks = questionData.blanks;}
        else {return res.status(400).send("Blanks is required");}
        if(questionData.blankAnswer)
        {question.blankAnswer = questionData.blankAnswer;}
        else {return res.status(400).send("BlankAnswer is required");}
    }
    else{
        return res.status(400).send("invalid question type")
    }

    try {
        const savedQuestion = await question.save();
        baseLogger.info(`Question created successfully: ${question.id}`);
        res.status(201).json({ message: 'Question created successfully', question: savedQuestion });
    } catch (error) {
        baseLogger.error(`Failed to create question`)
        res.status(500).json({ error: 'Failed to create question' });
    }
});

router.put('/edit', authenticate, validateCreateQuestion, async (req, res) => {

    try {
        await updateQuestion(req, res);
        baseLogger.info(`Qusetion with id: ${req.params.id} has been updated`);
        return res.status(200).send("question updated successfully");
    } catch (error) {
        res.status(500).send(error)
        baseLogger.error("error while updating question" + error)
    }
});

router.get('/get/:id',authenticate, async (req, res) => {
    if(req.body.id)
    {const id = Number(req.params.id);
    const existingQuestion = await Question.findOneBy({id:id});
    
    if (!existingQuestion) {
        baseLogger.info(`Trying to retrive a question that dosn't exist`)
        return res.status(404).send("question not found ");
    }

    else {
        baseLogger.info(`The qustion with id: ${existingQuestion.id} has been retrived`);
        res.status(200).json({ question: existingQuestion });
    }}
    else {
        return res.status(400).send("Enter the question id");
    }
});

router.get('/all', (req, res) => {
    
    getAllQuestions(req, res);
});

 
router.delete('/delete/:id', async (req, res) => {
    try {
         const id = Number(req.params.id);
        const existingQuestion = await Question.findOneBy({id:id});

        if (!existingQuestion) {
            baseLogger.error(`Trying to delete a question that isn't exist`);
            return res.status(404).send("qestion not found");
        }

        else {
            if (!existingQuestion.exams.length) {
                baseLogger.info(`Question ${existingQuestion.id} already in exam so it can't be deleted`)
                return res.status(400).send("can't delete question , question is exist in  exam");
            }

            await existingQuestion.remove();
            baseLogger.info(`Question ${existingQuestion.id} removed succefully`)
            res.status(200).send("qustion removed succefully");
        }

    } catch (error) {
        baseLogger.error("error while removing the question " + error);
        res.status(500).send("something went wrong");
    }
});


export default router;