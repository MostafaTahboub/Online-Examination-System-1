import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from "typeorm";
import { Exam } from "./Exam.js";
import { User } from "./User.js";

@Entity()
export class Response extends BaseEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({
    type: "enum",
    enum: ["Assigned", "inProgress", "Done"],
    default: "Assigned",
  })
  status: string;

  @ManyToOne(() => Exam, (exam) => exam.responses)
  exam: Relation<Exam[]>;

  @ManyToOne(() => User, (user) => user.responses)
  user: Relation<User>;

  @Column()
  totalScore: number;
}
