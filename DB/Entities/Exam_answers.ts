import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from "typeorm";
import { User } from "./User.js";
import { Question } from "./Question.js";
import { Response } from "./Response.js";
import { Exam } from "./Exam.js";

@Entity()
export class Exam_answers extends BaseEntity {

  @PrimaryGeneratedColumn('increment')
  id:number   
  
  @Column()
  answer:string
  
  @ManyToOne(()=>Response,(response)=>response.exam_answers)
  response:Relation<Response>
  
  @ManyToOne(()=>Exam,(exam)=>exam.answers)
  exam:Relation<Exam>
  
  @ManyToOne(()=>User,(user)=>user.Answers)
  user:Relation<User>
  
  @ManyToOne(()=>Question,(question)=>question.answers)
  question:Relation<Question>
  
  
}
