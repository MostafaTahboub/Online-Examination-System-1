import express from "express";
import { Subject } from "../DB/Entities/Subject.js";
import baseLogger from "../log.js";

var router = express.Router();

router.post("/new", async (req, res) => {
  try {
    let newSubject = new Subject();
    newSubject.name = req.body.name;
    await newSubject.save();
    baseLogger.info(`new subject has been added succefully`);
    res.status(201).send("new subject create succeffuly ");
  } catch (error) {
    res.status(500).send("something went wrong ");
    baseLogger.error("error occured while creating subject : " + error);
  }
});

export default router;
