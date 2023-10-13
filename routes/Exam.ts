import express from 'express';
import { createExam, createExamRandom, updateExam } from '../controllers/exam.js';
import { validateCreateExam } from '../middleware/validation/examValidation.js';
import { Exam } from '../DB/Entities/Exam.js';

var router = express.Router();

router.post('/new', validateCreateExam, async (req, res) => {

    try {
        await createExam(req, res);
        res.status(201).send("Exam created succeffylly");

    } catch (error) {
        console.error("Error ocurred while creating the Exam" + error);
        res.status(500).send("something went wrong when trying to create the Exam");
    }

});

// need some validation here 
router.post('/newByRandom' ,async (req, res) => {
    try {

        await createExamRandom(req, res);

    } catch (error) {
        console.error("error while creating Random Exam" + error);
        res.status(500).json({ message: 'Failed to create the exam' });
    }

});

router.put('/edit', async (req, res) => {

    try {
        await updateExam(req, res);
        res.status(201).send("Exam updated succeffylly");

    } catch (error) {
        console.error("Error ocurred while updated the Exam" + error);
        res.status(500).send("something went wrong when trying to update the Exam");
    }

});


router.get('/getExam', async (req, res) => {
    try {
        const examName = String(req.query.name);

        const existingExam = await Exam.findOne({
            where: { name: examName },
            relations: ['questions']
        });

        if (existingExam === null) {
            return res.status(404).json({ msg: 'Exam not found' });
        }

        res.status(200).json({ exam: existingExam });

    } catch (error) {
        console.error("Error ocurred while getting the exam" + error);
        res.status(500).send("internal server error ");
    }
});


router.delete('/delete', async (req, res) => {

    try {
        const id = Number(req.query.id);
        const existingExam = await Exam.findOneBy({ id })

        if (!existingExam) {
            return res.status(404).send("there are no exam , give me existing Exam ");
        }

        await existingExam.remove();
        res.status(200).send("exam deleted succeffuly");

    } catch (error) {
        console.error("error occurred during creation of Exam");
        res.status(500).send("something went wrong");
    }
});




export default router;
