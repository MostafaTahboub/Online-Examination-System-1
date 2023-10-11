import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn, Relation } from "typeorm";
import { Exam } from "./Exam.js";
import { User } from "./User.js";

@Entity()
export class Response extends BaseEntity{

@PrimaryGeneratedColumn('increment')
id :number

@ManyToOne(()=>Exam,(exam)=>exam.responses)
exam:Relation<Exam[]>

@ManyToOne(()=>User,(user)=>user.responses)
user:Relation<User>

@Column()
totalScore:number


}