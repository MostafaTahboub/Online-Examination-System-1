import {
  BaseEntity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  ManyToOne,
  Relation,
  OneToMany,
  CreateDateColumn,
  Entity,
  TableInheritance,
} from "typeorm";
import { Exam } from "./Exam.js";
import { Exam_answers } from "./Exam_answers.js";
import { Subject } from "./Subject.js";

enum QuestionType {
   "TrueFalse",
  "MultipleChoice",
  "FillInTheBlank",
}
@Entity()
export class Question extends BaseEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column()
  text: string;

  @Column()
  weight: number;

  @Column()
  type:"TrueFalse"|"MultipleChoice"|"FillInTheBlank";

  @Column({ type:'simple-array', nullable: true })
  options: string[]; // Array of multiple choice options

  // Fields specific to the True/False question type
  @Column({ nullable: true })
  answer: 'True'|'False'; 

  @Column({ nullable: true })
  correctAnswer: number; // Index of the correct option

  // Fields specific to the Fill in the Blank question type
  @Column({ type: 'json', nullable: true })
  blank: string; // Array of blank placeholders

  @Column({ type: 'json', nullable: true })
  blankAnswer: string ; // Array of correct answers
  
  // @Column({ nullable: false })
  // order: number;
  
  // @CreateDateColumn({
  //   type: 'timestamp',
  //   default: () => "CURRENT_TIMESTAMP()"
  // })
  // createdAt: Date;

  @CreateDateColumn()
createdAt: Date;
  
  @ManyToMany(() => Exam, (exam) => exam.questions)
  @JoinTable()
  exams: Relation<Exam[]>;
  
  @ManyToOne(() => Subject, (subject) => subject.question)
  subject: Relation<Subject>
  
  
  @OneToMany(() => Exam_answers, (examAnswer) => examAnswer.question)
  answers: Relation<Exam_answers[]>;
}

