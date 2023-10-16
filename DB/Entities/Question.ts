import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  ManyToOne,
  Relation,
  OneToMany,
  CreateDateColumn,
} from "typeorm";
import { Exam } from "./Exam.js";
import { QuestionType } from "./question_Types.js";
import { Exam_answers } from "./Exam_answers.js";
import { Subject } from "./Subject.js";

@Entity()
export class Question extends BaseEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column()
  text: string;

  @Column()
  weight: number;

  @Column("simple-json", { nullable: true })
  options: {
    op_1: string;
    op_2: string;
    op_3: string;
    op_4: string;
  };

  @Column({ nullable: false })
  answer: string;

  @Column({ nullable: false })
  order: number;

  @CreateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP()",
  })
  createdAt: Date;

  @ManyToMany(() => Exam, (exam) => exam.questions)
  @JoinTable()
  exams: Relation<Exam[]>;

  @ManyToOne(() => Subject, (subject) => subject.question)
  subject: Relation<Subject>;

  @ManyToOne(() => QuestionType, (questionType) => questionType.question)
  type: Relation<QuestionType>;

  @OneToMany(() => Exam_answers, (examAnswer) => examAnswer.question)
  answers: Relation<Exam_answers[]>;
}
