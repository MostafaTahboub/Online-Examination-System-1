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
} from "typeorm";
import { Exam } from "./Exam.js";
import { QuestionType } from "./question_Types.js";
import { Exam_answers } from "./Exam_answers.js";
import { Subject } from "./Subject.js";

@Entity()
export class Question extends BaseEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column()
  question_text: string;

  @Column()
  weight: number;

  @Column('simple-json', { nullable: true })
  options: {
    op_1: string;
    op_2: string;
    op_3: string;
    op_4: string;
  };

  @Column()
  answer: string;

  @Column()
  order: number;

  @ManyToMany(() => Exam, (exam) => exam.questions)
  @JoinTable()
  exams: Relation<Exam[]>;

  @ManyToOne(() => Subject, (subject) => subject.question)
  subject_id: Relation<Subject>

  @ManyToOne(() => QuestionType, (questionType) => questionType.question)
  question_type_id: Relation<QuestionType[]>;

  @OneToMany(() => Exam_answers, (examAnswer) => examAnswer.question)
  answers: Relation<Exam_answers[]>;
}
