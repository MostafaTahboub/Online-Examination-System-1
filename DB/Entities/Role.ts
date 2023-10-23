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
  Relation,
} from "typeorm";
import { Permission } from "./Permissions.js";
import { User } from "./User.js";
@Entity()
export class Role extends BaseEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column()
  roleName: string;

  @OneToMany(() => User, (user) => user.role)
  users: Relation<User[]>;

  @ManyToMany(() => Permission, (permission) => permission.roles, {
    eager: true,
  })
  @JoinTable()
  permissions: Relation<Permission[]>;

  // @CreateDateColumn({
  //   type: "timestamp",
  //   default: () => "CURRENT_TIMESTAMP()",
  // })
  // createdAt: Date;
  @CreateDateColumn()
createdAt: Date;
}
