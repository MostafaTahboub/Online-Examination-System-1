import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ManyToMany } from "typeorm/browser";
import { Exam } from "./Exam.js";
import { JoinTable } from "typeorm/browser";
import { ManyToOne } from "typeorm/browser";
import { Subject } from "typeorm/browser/persistence/Subject.js";

@Entity("question")
export class Quesion extends BaseEntity {
    @PrimaryGeneratedColumn('rowid')
    id : number;

    @Column()
    question_text : string;

    @Column()
    choice1:string ;
    @Column()
    choice2:string ;
    @Column()
    choice3:string ;
    @Column()
    choice4:string ;

    @Column()
    answer:string

    @ManyToMany(()=> Exam, (exam) => exam.questions)
    @JoinTable()
    exams: Exam[];

    // @ManyToOne(()=> Subject, (subject)=>subject.questions)
    // subject: Subject

    
}