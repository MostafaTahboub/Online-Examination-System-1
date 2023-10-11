import {
    Entity,
    BaseEntity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToMany,
    JoinTable,
    JoinColumn,
    OneToMany,
  } from "typeorm";
  import { Permission } from "./Permissions.js";
  import { User } from "./User.js";
  @Entity("role")
  export class Role extends BaseEntity {
    @PrimaryGeneratedColumn("increment")
    id: number;
  
    @Column()
    roleName: string;
  
    @OneToMany(() => User, (user) => user.role)
    users: User[];
  
    @ManyToMany(() => Permission, (permission) => permission.roles, { eager: true })
    @JoinTable()
    permissions: Permission[];
  
    @CreateDateColumn({
      type: "timestamp",
      default: () => "CURRENT_TIMESTAMP()",
    })
    createdAt: Date;
  }
  