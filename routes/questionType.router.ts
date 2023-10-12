import express from 'express';
import { QuestionType } from '../DB/Entities/question_Types.js';

var router = express.Router();

router.post('/new', async (req, res) => {
    try {

        let questionType = new QuestionType();
        questionType.name = req.body.name;
        await questionType.save();
        res.status(201).send("questionType created Successfully ");

    } catch (error) {
        res.status(500).send('something went wrong ');
        console.error("Error occured while creating question Type" + error);
    }
});


export default router;