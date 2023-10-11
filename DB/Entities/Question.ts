import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { Exam } from "./Exam.js";
import { OneToMany } from "typeorm/browser";

@Entity("question")
export class Quesion extends BaseEntity {
  @PrimaryGeneratedColumn("rowid")
  id: number;

  @Column()
  question_text: string;

  @Column()
  weight: number;
  
  @Column()
  options: JSON;

  @Column()
  answer: string;
  
  @Column()
  order: number;

  @ManyToMany(() => Exam, (exam) => exam.questions)
  @JoinTable()
  exams: Exam[];

  // @ManyToOne(()=> Subject, (subject)=>subject.questions)
  // subject_id: Subject

  // @ManyToOne(()=> QuestionType, (questionType)=>questionType.questions)
  // question_type_id: QusetionType;

  // @OneToMany(()=>Exam_Answers, (examAnswer)=> examAnswer.answers)
  // answers: Exam_Answers[];
}
