import { BaseEntity, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ManyToMany } from "typeorm/browser";
import { Timestamp } from "typeorm/browser";
import { Column } from "typeorm/browser";
import { Quesion } from "./Question.js";
import { User } from "./User.js";

@Entity("exam")
  export class Exam extends BaseEntity {

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    name: string;

    @Column()
    duration: Timestamp;

    @Column()
    difficulty: string;

    @ManyToMany(() => Quesion, (question) => question.exams)
    questions: Quesion[];
    
    // @ManyToOne(()=>Subject,(subject)=> subject.exams)
    // subject : Subject ;

    @ManyToMany(()=>User, (user)=>user.exams)
    users: User[];
  }