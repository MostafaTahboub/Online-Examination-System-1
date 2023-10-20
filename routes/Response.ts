import express from 'express'
import { getAllResponses } from '../controllers/response.js';
import { authenticate } from '../middleware/auth/authenticate.js';
import { authorize } from '../middleware/auth/authorize.js';
import { validateResponse } from '../middleware/validation/response.js';
const router = express.Router();

// router.post("newResponse",authenticate, authorize('POST_response'), validateResponse, (req,res) => {
//     insertResponse(req.body).then(()=> {
//         res.status(201).send("Response has been added succefully");
//     })
//     .catch(err => {
//         console.log(err);
//         res.status(500).send("Somthing went wrong adding response");
//     })
// });

router.get(
  "/all",
  authenticate,
  authorize("GET_Respnses"),
  (req, res, next) => {
    const payload = {
      page: req.query.page?.toString() || "1",
      pageSize: req.query.pageSize?.toString() || "5",
    };
    getAllResponses(payload)
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send("somthing went wrong in all responses");
      });
  }
);

router.delete;

export default router;
