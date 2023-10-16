import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from "typeorm";
import { Question } from "./Question.js";

@Entity()
export class Subject extends BaseEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ nullable: false })
  name: string;

  @OneToMany(() => Question, (question) => question.subject)
  question: Relation<Question[]>;
}
