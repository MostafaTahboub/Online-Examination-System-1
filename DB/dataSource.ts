import { DataSource } from "typeorm";
import { User } from "./Entities/User.js";
import { Permission } from "./Entities/Permissions.js";
import { Role } from "./Entities/Role.js";
import { Question } from "./Entities/Question.js";
import { Exam } from "./Entities/Exam.js";
import { Subject } from "./Entities/Subject.js";
import { Enrollment } from "./Entities/Enrollment.js";
import { Exam_answers } from "./Entities/Exam_answers.js";
import { Response } from "./Entities/Response.js";
import { CreateAdmin1698221813286 } from "../migration/1698221813286-CreateAdmin.js";
import dotenv from "dotenv";
dotenv.config();
// console.log(process.env);

const dataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [
    User,
    Role,
    Permission,
    Question,
    Exam,
    Subject,
    Enrollment,
    Exam_answers,
    Response,
  ],
  migrations: [CreateAdmin1698221813286],
  migrationsRun: false,
  synchronize: true,
  logging: false,
});

export default dataSource;
