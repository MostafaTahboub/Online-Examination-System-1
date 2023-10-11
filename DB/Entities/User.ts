import {
    BeforeInsert,
    BaseEntity,
    Column,
    Entity,
    CreateDateColumn,
    PrimaryGeneratedColumn,
    JoinColumn,
    OneToOne,
    ManyToMany,
    JoinTable,
    ManyToOne,
    OneToMany,
  } from "typeorm";
  import bcrypt from "bcrypt";
  import { Role } from "./Role.js";
import { Exam } from "./Exam.js";
import { Enrollment } from "./Enrollment.js";
  @Entity('user')
  export class User extends BaseEntity {
    @PrimaryGeneratedColumn("increment")
      id: number;
  
    @Column({ nullable: false, length: 255 })
      username: string;
  
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
  
      @ManyToMany(()=> Exam, (exam)=> exam.users)
      @JoinTable()
      exams: Exam[];

      @ManyToOne(() => Role, (role) => role.users, {eager: true })
        role: Role;
      
      @OneToMany(()=>Enrollment, (enrollment)=> enrollment.user_id)
      enrollments: Enrollment[];
      
      // @OneToMany(()=>ExamAnswer, (examAnswer)=> examAnswer.users)
      // Answers: ExamAnwer[];

  }
  