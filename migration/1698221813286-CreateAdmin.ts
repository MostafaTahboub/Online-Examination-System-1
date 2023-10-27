import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAdmin1698221813286 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`INSERT INTO User (username, name, email, password, roleId)
          VALUES ("root", "root", "201160@ppu.edu.ps", "123456789", "1")`);
    
    
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM User WHERE username = "root`);
    
    
  }
}
