import {
    Entity,
    BaseEntity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    OneToOne,
    JoinColumn,
  } from "typeorm";
  import { User } from "./User.js";
  
  @Entity("profile")
  export class Profile extends BaseEntity {
    @PrimaryGeneratedColumn("increment")
    id: number;
  
    @Column()
    firstName: string;
  
    @Column()
    lastName: string;
  
  
    @Column({ type: "date" })
    dateOfBirth: Date;


    
  }
  