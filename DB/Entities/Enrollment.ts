import { ManyToOne } from "typeorm/browser";
import { CreateDateColumn, PrimaryGeneratedColumn } from "typeorm/browser";
import { BaseEntity, Entity } from "typeorm/browser";
import { User } from "./User.js";
import { Exam } from "./Exam.js";

@Entity()

export class Enrollment extends BaseEntity{

    @PrimaryGeneratedColumn('increment')
    id: number;

    @ManyToOne(()=> User, (user)=> user.enrollments)
    user_id: User;

    @ManyToOne(()=> Exam, (exam)=> exam.enrollments)
    exam_id: Exam;

    @CreateDateColumn({
        type: "timestamp",
        default: () => "CURRENT_TIMESTAMP()",
      })
      createdAt: Date;
}
