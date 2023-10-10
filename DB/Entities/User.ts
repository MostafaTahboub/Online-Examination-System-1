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
  } from "typeorm";
  import bcrypt from "bcrypt";
  import {Profile}  from "./Profile.js";
  import { Role } from "./Role.js";
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
  
    @CreateDateColumn({
          type: "timestamp",
          default: () => "CURRENT_TIMESTAMP()",
      })
      createdAt: Date;
  
    @ManyToMany(() => Role, (role) => role.users, { cascade: ['soft-remove'], eager: true })
      roles: Role[];
  
    @OneToOne(() => Profile, { eager: true })
      @JoinColumn()
      profile: Profile;
  }
  