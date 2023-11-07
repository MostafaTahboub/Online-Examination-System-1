import express from "express";
import { getAllResponses } from "../controllers/response.js";
import { authenticate } from "../middleware/auth/authenticate.js";
import baseLogger from "../log.js";
import { authorize } from "../middleware/auth/authorize.js";
const router = express.Router();

router.get("/", authenticate, authorize("Admin"), (req, res, next) => {
  const payload = {
    page: req.query.page?.toString() || "1",
    pageSize: req.query.pageSize?.toString() || "5",
  };

  getAllResponses(payload)
    .then((data) => {
      baseLogger.info(`all responses retrived`);
      res.status(200).send(data);
    })
    .catch((err) => {
      baseLogger.error(`somthing went wrong in all responses: ${err}`);
      res.status(500).send("somthing went wrong in all responses");
    });
});

export default router;
