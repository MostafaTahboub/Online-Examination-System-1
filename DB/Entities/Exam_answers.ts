import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn, Relation } from "typeorm";
import { Exam } from "./Exam.js";
import { User } from "./User.js";
import { Question } from "./Question.js";

@Entity()
export class Exam_answers extends BaseEntity{

@PrimaryGeneratedColumn('increment')
id:number   

// relation with response 

@ManyToOne(()=>Exam,(exam)=>exam.answers)
exam:Relation<Exam>

@ManyToOne(()=>User,(user)=>user.Answers)
user:Relation<User>

@ManyToOne(()=>Question,(question)=>question.answers)
question:Relation<Question>




}