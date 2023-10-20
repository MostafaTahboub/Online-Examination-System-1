import express from "express";
import { getAllQuestions, updateQuestion } from "../controllers/question.js";
import { validateCreateQuestion } from "../middleware/validation/questionValidation.js";
import { Question } from "../DB/Entities/Question.js";
import { authenticate } from "../middleware/auth/authenticate.js";
import { authorize } from "../middleware/auth/authorize.js";
import { Subject } from "../DB/Entities/Subject.js";

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
        question.answer = questionData.answer;
    } else if (question.type === 'MultipleChoice') {
        question.options = questionData.options;
        question.correctAnswer = questionData.correctAnswer;
    } else if (question.type === 'FillInTheBlank') {
        question.blanks = questionData.blanks;
        question.blankAnswer = questionData.blankAnswer;
    }

    try {
        const savedQuestion = await question.save();
        res.status(201).json({ message: 'Question created successfully', question: savedQuestion });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create question' });
    }
});

router.put('/edit', authenticate, async (req, res) => {

    try {
        await updateQuestion(req, res);
    } catch (error) {
        console.error("error while update question" + error)
    }
});

router.get('/get/:id', async (req, res) => {
    const id = Number(req.params.id);
    const existingQuestion = await Question.findOneBy({id:id});
    
    if (!existingQuestion) {
        return res.status(404).send("question not found ");
    }

    else {
        res.status(200).json({ question: existingQuestion });
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
            return res.status(404).send("qestion not found");
        }

        else {
            if (!existingQuestion.exams.length) {
                return res.status(400).send("can't delete question , question is exist in  exam");
            }

            await existingQuestion.remove();
            res.status(200).send("qustion removed succefully");
        }

    } catch (error) {
        console.error("error while removing the question " + error);
        res.status(500).send("something went wrong");
    }
});


export default router;