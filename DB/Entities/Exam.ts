import { BaseEntity, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ManyToMany } from "typeorm/browser";
import { Timestamp } from "typeorm/browser";
import { Column } from "typeorm/browser";
import { Quesion } from "./Question.js";
import { User } from "./User.js";
import { OneToMany } from "typeorm/browser";
import { Enrollment } from "./Enrollment.js";

@Entity("exam")
  export class Exam extends BaseEntity {

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    name: string;

    @Column()
    duration: Timestamp;

    @Column()
    start_time: Timestamp;

    @Column()
    end_time: Timestamp;

    @ManyToMany(() => Quesion, (question) => question.exams)
    questions: Quesion[];

    @ManyToMany(()=>User, (user)=>user.exams)
    users: User[];
    
    @OneToMany(()=> Enrollment, (enrollment)=> enrollment.exam_id)
    enrollments:Enrollment[];
    
    // @OneToMany(()=> Exam_Answers, (exam_answer)=> exam_answer.answer)
    // answers: Exam_Answers[];

    // @OneToMany(()=> Response, (response)=> response.exam)
    // responses:Response[];

  }