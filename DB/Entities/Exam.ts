import {
  BaseEntity,
  ManyToMany,
  Timestamp,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Relation,
  OneToMany,
} from "typeorm";
import { User } from "./User.js";
import { Question } from "./Question.js";
import { Enrollment } from "./Enrollment.js";
import { Exam_answers } from "./Exam_answers.js";
import { Response } from "./Response.js";

@Entity()
export class Exam extends BaseEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column()
  name: string;

  @Column({ type: "int", default: 0 })
  duration: number;

  @Column("timestamp", { default: () => "CURRENT_TIMESTAMP" })
  startTime: Date;

  @Column("timestamp", { default: () => "CURRENT_TIMESTAMP" })
  endTime: Date;

  @ManyToMany(() => Question, (question) => question.exams)
  questions: Relation<Question[]>;

  @ManyToMany(() => User, (user) => user.exams)
  users: Relation<User[]>;

  @OneToMany(() => Enrollment, (enrollment) => enrollment.exam)
  enrollments: Relation<Enrollment[]>;

  @OneToMany(() => Exam_answers, (exam_answer) => exam_answer.exam)
  answers: Relation<Exam_answers[]>;

  @OneToMany(() => Response, (response) => response.exam)
  responses: Relation<Exam[]>;
}
