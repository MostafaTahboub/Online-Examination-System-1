import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
  Relation,
  OneToMany
} from "typeorm";
import { Exam } from "./Exam.js";

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
  exams: Relation<Exam[]>;

  // @ManyToOne(()=> Subject, (subject)=>subject.questions)
  // subject_id: Relation<Subject>

  // @ManyToOne(()=> QuestionType, (questionType)=>questionType.questions)
  // question_type_id: Relation<QusetionType>;

  // @OneToMany(()=>Exam_Answers, (examAnswer)=> examAnswer.answers)
  // answers: Relation<Exam_Answers[]>;
}
