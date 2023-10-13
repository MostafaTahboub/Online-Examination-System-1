import express from "express";
import { getAllQuestions, insertQuestion, updateQuestion } from "../controllers/question.js";
import { validateCreateQuestion } from "../middleware/validation/questionValidation.js";
import { Question } from "../DB/Entities/Question.js";
import { authenticate } from "../middleware/auth/authenticate.js";
import { authorize } from "../middleware/auth/authorize.js";

var router = express.Router();

router.post('/new',authenticate, authorize("Add_Question"), validateCreateQuestion, async (req, res) => {
    try {
        await insertQuestion(req, res);
    } catch (error) {
        console.error("Eror occured while creating question " + error);
    }
});

router.put('/edit',authenticate, authorize("Update_Question"), async (req, res) => {

    try {
        await updateQuestion(req, res);
    } catch (error) {
        console.error("error while update question" + error)
    }
});

router.get('/getByName', async (req, res) => {
    const questionName = String(req.query.name);
    const existingQuestion = await Question.findOneBy({ name: questionName });

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

// could be changed to delete by id 
router.delete('/deletByName', async (req, res) => {
    try {
        const questionName = String(req.query.name);
        const existingQuestion = await Question.findOneBy({ name: questionName });

        if (!existingQuestion) {
            return res.status(404).send("qestion not found");
        }

        else {
            await existingQuestion.remove();
            res.status(200).send("qustion removed succefully");
        }

    } catch (error) { // it couldn't be deleted if question exist in at least on exam (i will create it )
        console.error("error while removing the question " + error);
        res.status(500).send("something went wrong");
    }
});




export default router;