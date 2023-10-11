import { ManyToOne, Relation, CreateDateColumn, PrimaryGeneratedColumn, BaseEntity, Entity } from "typeorm";
import { User } from "./User.js";
import { Exam } from "./Exam.js";

@Entity()

export class Enrollment extends BaseEntity{

    @PrimaryGeneratedColumn('increment')
    id: number;

    @ManyToOne(()=> User, (user)=> user.enrollments)
    user_id: Relation<User>;

    @ManyToOne(()=> Exam, (exam)=> exam.enrollments)
    exam_id: Relation<Exam>;

    @CreateDateColumn({
        type: "timestamp",
        default: () => "CURRENT_TIMESTAMP()",
      })
      createdAt: Date;
}
