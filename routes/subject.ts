import express from "express";
import { Subject } from "../DB/Entities/Subject.js";
import baseLogger from "../log.js";
import { authenticate } from "../middleware/auth/authenticate.js";
import { authorize } from "../middleware/auth/authorize.js";

var router = express.Router();

router.post("/", authenticate, authorize("POST_Subject"), async (req, res) => {
  try {
    let newSubject = new Subject();
    newSubject.name = req.body.name;
    await newSubject.save();
    baseLogger.info(`new subject has been added succefully`);
    res.status(201).send("new subject created succeffuly ");
  } catch (error) {
    res.status(500).send("something went wrong ");
    baseLogger.error("error occured while creating subject : " + error);
  }
});

router.get("/", async (req, res) => {
  try {
    const subjects = await Subject.find();

    res.status(200).send(subjects);
  } catch (error) {
    res.status(500).send("something went wrong");
    console.error(error);
  }
});

export default router;
