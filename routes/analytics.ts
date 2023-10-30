import express, { response } from "express";
import { authenticate } from "../middleware/auth/authenticate.js";
import jwt from "jsonwebtoken";
import { User } from "../DB/Entities/User.js";
import { Exam } from "../DB/Entities/Exam.js";
import { authorize } from "../middleware/auth/authorize.js";
import { Response } from "../DB/Entities/Response.js";
import baseLogger from "../log.js";
import { EqualOperator } from "typeorm";
const router = express.Router();

router.get("/by_user",  authenticate, authorize("GET_User_Analytics"), async (req, res) => {
  try {
    const token = req.cookies["token"];   
    const decode = jwt.decode(token, { json: true });
    let sum: number = 0;
    let weight: number = 0;
    if (decode !== null) {

      let user = await User.findOneBy({ email: decode.email });
      if (user !== null) {
        if (user.exams !== undefined) {
          var responses: Response[] = [];
          for (let exam of user.exams) {
            for(let res of exam.responses)
           {responses = [...responses, res]}
          }
          // let responses: Response[] = user?.responses;
          for (let i = 0; i < responses.length; i++) {
            sum += responses[i].totalScore;
            weight += responses[i].exam.score;
          }
          res.status(200)
            .send(
              `Hi ${user.name} your exams rate is: ${sum / responses?.length}`
            );
            baseLogger.info(`The user: ${user.name} has viewed his exam rate by ${decode.fullName} which is: ${sum/weight}`)
        }
        else {
          return res.status(404).send("No responses found")
        }
      }
      else {
        return res.status(404).send("The user not found");
      }
    }
  } catch (error) {
    baseLogger.error(`Error while calculate the user exam rate: ${error}`);
    res.status(500).send("somthing went wrong");
  }
});

router.get(
  "/By_exam",
  authenticate,
  authorize("GET_Exam_Analytics"),
  async (req, res) => {
    try {
        const token = req.cookies["token"];
        const decode = jwt.decode(token, { json: true });
        if(decode === null)
        return res.status(401).send('Token not valid');
        else
      {
        const exam_id = Number(req.body.examID);

      if (!exam_id) {
       return res.status(400).send("Enter the exam id");
      }
      else{
          const exam = await Exam.findOneBy({ id: exam_id });
          let x: Response = new Response;
          if (exam !== null) {
            let sum: number = 0;
            let score: number = 0;
            let e_response: Response[] = exam.responses;
            if (e_response.length > 0) {
              for (let response of e_response) {
                sum += response.totalScore;
                score += response.exam.score;
              }
              let avg: number = sum / score;
              baseLogger.info(`The user: ${decode.fullName} has viewed the exam rate which is: ${avg}`)
              return res
                .status(200)
                .send(`The average score in this exam is :${avg}`);
            } else {
                baseLogger.info(`No Responses found for this exam: ${exam_id}`);
              return res.status(404).send("No Responses Found");
            }
          } else {
            baseLogger.info(`Ther are no exam with id: ${exam_id}`);
            return res.status(404).send("There are no exam with this id");
          }
        } 
    }
    } catch (error) {
      
      baseLogger.error(`Error while calculating the exam rate: ${error}`)}
       res.status(500).send("something went wrong ");             
      }
);

export default router;
