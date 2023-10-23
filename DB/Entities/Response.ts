import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Relation } from "typeorm";
import { Exam } from "./Exam.js";
import { User } from "./User.js";
import { Exam_answers } from "./Exam_answers.js";

@Entity()
export class Response extends BaseEntity{

@PrimaryGeneratedColumn('increment')
id :number

@Column({ type: 'enum',
enum: ['Assigned', 'inProgress', 'Done'],
default: 'Assigned'})
status : string;

@ManyToOne(()=>Exam,(exam)=>exam.responses)
exam:Relation<Exam>

@ManyToOne(()=>User,(user)=>user.responses)
user:Relation<User>

@OneToMany(()=>Exam_answers,(examAnswers)=>examAnswers.response)
exam_answers:Relation<Exam_answers[]>

@Column()
totalScore:number

@Column('simple-array', { nullable: true })
shuffledQuestionOrder: number[];

// @CreateDateColumn({
//     type: "timestamp",
//     default: () => "CURRENT_TIMESTAMP()",
//   })
//   createdAt: Date;
@CreateDateColumn()
createdAt: Date;

}