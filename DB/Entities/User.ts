import {
  BeforeInsert,
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  ManyToOne,
  OneToMany,
  Relation,
} from "typeorm";
import bcrypt from "bcrypt";
import { Role } from "./Role.js";
import { Exam } from "./Exam.js";
import { Enrollment } from "./Enrollment.js";
import { Exam_answers } from "./Exam_answers.js";
import { Response } from "./Response.js";

@Entity('user')
export class User extends BaseEntity {
  static findByPk(userId: any, arg1: { include: { model: typeof Exam; as: string; include: typeof Response; }; }) {
    throw new Error("Method not implemented.");
  }

  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({default:''})
  username: string;

  @Column({ nullable: false, length: 255 })
  name: string;

  @BeforeInsert()
  async hashPassword() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }
  @Column({ nullable: false })
  password: string;

  @Column({ nullable: false })
  email: string;

  @ManyToMany(() => Exam, (exam) => exam.users)
  @JoinTable()
  exams: Relation<Exam[]>;

  @ManyToOne(() => Role, (role) => role.users, { eager: true })
  role: Relation<Role>;

  @OneToMany(() => Enrollment, (enrollment) => enrollment.user)
  enrollments: Relation<Enrollment[]>;

  @OneToMany(() => Exam_answers, (examAnswer) => examAnswer.user)
  Answers: Relation<Exam_answers[]>;

  @OneToMany(() => Response, (response) => response.user)
  responses: Relation<Response[]>

}
