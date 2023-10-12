import "reflect-metadata";
import express from "express";
import "./config.js";
import dataSource from "./DB/dataSource.js";
import createAdminUser from "./controllers/admin.js";
import questionRouter from "./routes/question.router.js";
import questionTypeRotuer from './routes/questionType.router.js'
import subjectRouter from './routes/subject.js';
const app = express();

app.use(express.json());

const PORT = process.env.PORT || 5000;

app.use('/question',questionRouter);
app.use('/questionType',questionTypeRotuer);
app.use('/subject',subjectRouter);


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
