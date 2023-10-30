import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAdmin1698221813286 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    //create permissions
    await queryRunner.query(`INSERT INTO Permission (name) VALUES("admin")`);
    await queryRunner.query(`INSERT INTO Permission (name) VALUES("POST_Subject")`);
    await queryRunner.query(`INSERT INTO Permission (name) VALUES("POST_Question")`);
    await queryRunner.query(`INSERT INTO Permission (name) VALUES("PUT_Question")`);
    await queryRunner.query(`INSERT INTO Permission (name) VALUES("GET_Question")`);
    await queryRunner.query(`INSERT INTO Permission (name) VALUES("DELETE_Question")`);
    await queryRunner.query(`INSERT INTO Permission (name) VALUES("POST_Enrollment")`);
    await queryRunner.query(`INSERT INTO Permission (name) VALUES("POST_Exam")`);
    await queryRunner.query(`INSERT INTO Permission (name) VALUES("GET_Exam")`);
    await queryRunner.query(`INSERT INTO Permission (name) VALUES("UPDATE_Exam")`);
    await queryRunner.query(`INSERT INTO Permission (name) VALUES("DELETE_Exam")`);
    await queryRunner.query(`INSERT INTO Permission (name) VALUES("GET_Exam_Analytics")`);
    await queryRunner.query(`INSERT INTO Permission (name) VALUES("GET_User_Analytics")`);
    await queryRunner.query(`INSERT INTO Permission (name) VALUES("Take_Exam")`);
    //create roles
    await queryRunner.query(`INSERT INTO Role (roleName) VALUES ("admin")`);
    await queryRunner.query(`INSERT INTO Role (roleName) VALUES ("student")`);
    await queryRunner.query(`INSERT INTO Role (roleName) VALUES ("instructor")`);
    //create admin user
    await queryRunner.query(`INSERT INTO User (username, name, email, password)
    VALUES ("root", "root", "201160@ppu.edu.ps", "123456789")`);
    
    
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
    await queryRunner.query(`DELETE FROM User WHERE username = "root`);
    
    
  }
}
