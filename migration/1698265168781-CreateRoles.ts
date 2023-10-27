import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateRoles1698265168781 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`INSERT INTO Role (roleName) VALUES ("admin")`);
    await queryRunner.query(`INSERT INTO Role (roleName) VALUES ("student")`);
    await queryRunner.query(`INSERT INTO Role (roleName) VALUES ("instructor")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM Role WHERE roleName = "admin`);
    await queryRunner.query(`DELETE FROM Role WHERE roleName = "student`);
    await queryRunner.query(`DELETE FROM Role WHERE roleName = "instructor`);
  }
}
