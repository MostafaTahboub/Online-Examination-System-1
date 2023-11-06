import { MigrationInterface, QueryRunner, getRepository } from "typeorm";
import { Role } from "../DB/Entities/Role.js";
import { User } from "../DB/Entities/User.js";
import { Permission } from "../DB/Entities/Permissions.js";

export class CreateAdmin1698221813286 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const permission = new Permission();
    permission.name = "Admin";
    await permission.save();
    const a = new Permission();
    a.name = "POST_Subject";
    await a.save();
    const b = new Permission();
    b.name = "POST_Question";
    await b.save();
    const c = new Permission();
    c.name = "PUT_Question";
    await c.save();
    const d = new Permission();
    d.name = "GET_Question";
    await d.save();
    const e = new Permission();
    e.name = "DELETE_Question";
    await e.save();
    const f = new Permission();
    f.name = "POST_Enrollment";
    await f.save();
    const g = new Permission();
    g.name = "POST_Exam";
    await g.save();
    const h = new Permission();
    h.name = "GET_Exam";
    await h.save();
    const i = new Permission();
    i.name = "UPDATE_Exam";
    await i.save();
    const j = new Permission();
    j.name = "DELETE_Exam";
    await j.save();
    const k = new Permission();
    k.name = "GET_Exam_Analytics";
    await k.save();
    const l = new Permission();
    l.name = "GET_User_Analytics";
    await l.save();
    const m = new Permission();
    m.name = "Take_Exam";
    await m.save();
   

    const role = new Role();
    role.roleName = "admin";
    role.permissions = [permission];
    await role.save();

    const student = new Role();
    student.roleName = "student";
    student.permissions = [b,d,h,m,l];
    await student.save();

    const instructor = new Role();
    instructor.roleName = "instructor";
    instructor.permissions = [a,b,c,d,e,f,g,h,i,j,k,l];
    await instructor.save();

    const user = new User();
    user.username = "admin";
    user.name = "Admin";
    user.email = "201160@ppu.edu.ps";
    user.password = process.env.ADMIN_PASSWORD || "";
    user.role = role;
    await user.save();
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    //delete permissions
    await queryRunner.query(`DELETE FROM Permission WHERE name = "admin`);
    await queryRunner.query(`DELETE FROM Permission (name) VALUES("POST_Subject")`);
    await queryRunner.query(`DELETE FROM Permission (name) VALUES("POST_Question")`);
    await queryRunner.query(`DELETE FROM Permission (name) VALUES("PUT_Question")`);
    await queryRunner.query(`DELETE FROM Permission (name) VALUES("GET_Question")`);
    await queryRunner.query(`DELETE FROM Permission (name) VALUES("DELETE_Question")`);
    await queryRunner.query(`DELETE FROM Permission (name) VALUES("POST_Enrollment")`);
    await queryRunner.query(`DELETE FROM Permission (name) VALUES("POST_Exam")`);
    await queryRunner.query(`DELETE FROM Permission (name) VALUES("GET_Exam")`);
    await queryRunner.query(`DELETE FROM Permission (name) VALUES("UPDATE_Exam")`);
    await queryRunner.query(`DELETE FROM Permission (name) VALUES("DELETE_Exam")`);
    await queryRunner.query(`DELETE FROM Permission (name) VALUES("GET_Exam_Analytics")`);
    await queryRunner.query(`DELETE FROM Permission (name) VALUES("GET_User_Analytics")`);
    await queryRunner.query(`DELETE FROM Permission (name) VALUES("Take_Exam")`);
    //delete roles
    await queryRunner.query(`DELETE FROM Role WHERE roleName = "admin`);
    await queryRunner.query(`DELETE FROM Role WHERE roleName = "student`);
    await queryRunner.query(`DELETE FROM Role WHERE roleName = "instructor`);
    //delete admin user
    await queryRunner.query(`DELETE FROM User WHERE name = "Admin`);
    
    
  }
}

