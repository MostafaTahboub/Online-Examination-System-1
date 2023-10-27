import { MigrationInterface, QueryRunner } from "typeorm"

export class CreatePermissions1698265178685 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
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
    }
    
    public async down(queryRunner: QueryRunner): Promise<void> {
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
    }

}
