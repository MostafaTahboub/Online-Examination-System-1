import { BaseEntity, ManyToMany, Timestamp, Column, Entity, PrimaryGeneratedColumn, Relation, OneToMany } from "typeorm";
import { User } from "./User.js";
import { Question } from "./Question.js";
import { Enrollment } from "./Enrollment.js";
import { Exam_answers } from "./Exam_answers.js";
import { Response } from "./Response.js";

@Entity()
export class Exam extends BaseEntity {

  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  title: string;
  
  @Column({nullable:true})
  password:string
  
  @Column({ type: 'int' })
  duration: number;

  @Column({ type: 'datetime' })
  startTime: Date;
  
  @Column()
  score:number
  
  @Column({unique:true})
  code:string

  @Column()
  numberOfQuestions:number
  
  @ManyToMany(() => Question, (question) => question.exams)
  questions: Relation<Question[]>;

  @ManyToMany(() => User, (user) => user.exams)
  users: Relation<User[]>;

  @OneToMany(() => Enrollment, (enrollment) => enrollment.exam)
  enrollments: Relation<Enrollment[]>;

  @OneToMany(() => Exam_answers, (exam_answer) => exam_answer.exam)
  answers: Relation<Exam_answers[]>;

  @OneToMany(() => Response, (response) => response.exam)
  responses: Relation<Response[]>;
    
}     
