import {
    Entity,
    BaseEntity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    JoinTable,
    ManyToMany,
  } from "typeorm";
  import { Role } from "./Role.js";
  
  
  @Entity("permission")
  export class Permission extends BaseEntity {
    @PrimaryGeneratedColumn("increment")
    id: number;
  
    @Column()
    permissionName: string;
  
    @ManyToMany(() => Role, (role) => role.permissions)
    roles: Permission[];
    
    @CreateDateColumn({
      type: "timestamp",
      default: () => "CURRENT_TIMESTAMP()",
    })
    createdAt: Date;
  }
  