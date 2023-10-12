import express from 'express';
import { Subject } from '../DB/Entities/Subject.js';

var router = express.Router();

router.post('/new', async (req, res) => {
    try {
        let newSubject = new Subject();
        newSubject.name = req.body.name;
        await newSubject.save();
        res.status(201).send('new subject create succeffuly ');
    } catch (error) {
        res.status(500).send("something went wrong ");
        console.error("error occured while creating subject : " + error);
    }
});


export default router;