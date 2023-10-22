import "reflect-metadata";
import express from "express";
import "./config.js";
import dataSource from "./DB/dataSource.js";
import createAdminUser from "./controllers/admin.js";
import home from "./routes/home.js";
import questionRouter from "./routes/question.router.js";
import subjectRouter from "./routes/subject.js";
import examRouter from "./routes/Exam.js";
import Permission from "./routes/Permission.js";
import role from "./routes/Role.js";
import response from "./routes/Response.js";
import enrollmentRouter from "./routes/enrollment.js";
import baseLogger from "./log.js";
import cookieParser from 'cookie-parser';
import analytics from './routes/Analytics.js'

const app = express();

app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 5000;

app.use("/Home", home);
app.use("/response", response)
app.use("/question", questionRouter);
app.use("/subject", subjectRouter);
app.use("/exam", examRouter);
app.use("/permission", Permission);
app.use("/role", role);
app.use("/enrollment", enrollmentRouter);
app.use('/analytics', analytics)

app.get("/", (req, res) => {
  baseLogger.info("app is running succefully");
  res.status(200).send("app is running succefully");
});

app.listen(PORT, async () => {
  console.log(`App is lestining to PORT  : ` + PORT);
  baseLogger.info(`App is lestining to PORT : ${PORT}`);

  dataSource
    .initialize()
    .then(() => {
      createAdminUser();
      baseLogger.info("connected to database :)");
      console.log("connected to database :)");
    })
    .catch((err) => {
      baseLogger.error(`failed to connect connect to db !! ${err}`);
      console.log("failed to connect to db !! " + err);
    });
});
