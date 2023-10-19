import "reflect-metadata";
import express from "express";
import "./config.js";
import dataSource from "./DB/dataSource.js";
import createAdminUser from "./controllers/admin.js";
import home from "./routes/home.js";
import questionRouter from "./routes/question.router.js";
import questionTypeRotuer from "./routes/questionType.router.js";
import subjectRouter from "./routes/subject.js";
import examRouter from "./routes/Exam.js";
import Permission from "./routes/Permission.js";
import role from "./routes/Role.js";
import response from "./routes/Response.js";
import enrollmentRouter from "./routes/enrollment.js";
import baseLogger from "./log.js";

const app = express();

app.use(express.json());
app.use("/Home", home);

const PORT = process.env.PORT || 5000;

app.use("/response", response);
app.use("/question", questionRouter);
app.use("/questionType", questionTypeRotuer);
app.use("/subject", subjectRouter);
app.use("/exam", examRouter);
app.use("/permission", Permission);
app.use("/role", role);
app.use("/enrollment", enrollmentRouter);

app.get("/", (req, res) => {
  res.status(200).send("app is running succefully");
});

app.listen(PORT, async () => {
  console.log(`App is lestining to PORT  : ` + PORT);

  dataSource
    .initialize()
    .then(() => {
      createAdminUser();
      console.log("connected to database :)");
    })
    .catch((err) => {
      console.log("failed to connect to db !! " + err);
    });
});
