import { BaseEntity,ManyToMany,Timestamp,Column ,Entity, PrimaryGeneratedColumn, Relation } from "typeorm";
import { User } from "./User.js";
import { OneToMany } from "typeorm";
import { Question } from "./Question.js";
import { Enrollment } from "./Enrollment.js";
import { Exam_answers } from "./Exam_answers.js";
import { Response } from "./Response.js";

@Entity()
  export class Exam extends BaseEntity {

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    name: string;

    @Column()
    duration: number;

    @Column()
    start_time: number;

    @Column()
    end_time: number;

    @ManyToMany(() => Question, (question) => question.exams)
    questions: Relation<Question[]>;

    @ManyToMany(()=>User, (user)=>user.exams)   
    users: Relation<User[]>;
    
    @OneToMany(()=> Enrollment, (enrollment)=> enrollment.exam_id)
    enrollments:Relation<Enrollment[]>;
    
    @OneToMany(()=> Exam_answers, (exam_answer)=> exam_answer.exam)
    answers: Relation<Exam_answers[]>;

    @OneToMany(()=> Response, (response)=> response.exam)
    responses:Relation<Exam[]>;

  }     