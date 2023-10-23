import { ManyToOne, Relation, BaseEntity, Entity, CreateDateColumn, PrimaryGeneratedColumn, Column } from "typeorm";
import { User } from "./User.js";
import { Exam } from "./Exam.js";

@Entity()

export class Enrollment extends BaseEntity {

  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => User, (user) => user.enrollments)
  user: Relation<User>;

  @ManyToOne(()=> Exam, (exam)=> exam.enrollments)
  exam: Relation<Exam>;

  // @CreateDateColumn({
  //   type: "timestamp",
  //   default: () => "CURRENT_TIMESTAMP()",
  // })
  // createdAt: Date;

  @CreateDateColumn()
createdAt: Date;

  @Column({ type: 'datetime' })
  endTime: Date;
}
