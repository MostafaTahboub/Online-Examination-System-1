import { MigrationInterface, QueryRunner } from "typeorm"

export class PostRefactoring1697366244346 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        let adminPermission = await queryRunner.query(`INSERT INTO Permission (name) VALUES("admin")`,);
        let adminRole = await queryRunner.query(`INSERT INTO Role (roleName, permissions) VALUES ("admin", [${adminPermission}])`,);
        let user = await queryRunner.query(`INSERT INTO User (username, name, password, role) 
        VALUES ("root", "root","123456789", ${adminRole})`,);
         await queryRunner.query(`INSERT INTO Role (roleName) VALUES ("student")`,);
         await queryRunner.query(`INSERT INTO Role (roleName) VALUES ("instructor")`);
        
    }

    public async down(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query(`DELETE FROM Role WHERE roleName = "instructor`,);
        await queryRunner.query(`DELETE FROM Role WHERE roleName = "student`,);
        await queryRunner.query(`DELETE FROM Permission WHERE name = "admin`,);
        await queryRunner.query(`DELETE FROM Role WHERE roleName = "admin`,);
        await queryRunner.query(`DELETE FROM User WHERE username = "root`,);
        
    }

}
