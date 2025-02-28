import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserTable1740678809624 implements MigrationInterface {
  name = 'CreateUserTable1740678809624';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`user\` (\`id\` varchar(36) NOT NULL, \`name\` text NOT NULL, \`role\` enum ('admin', 'user') NOT NULL DEFAULT 'user', \`email\` text NOT NULL, \`password\` text NOT NULL, \`nationality\` text NOT NULL, \`user_type\` enum ('foreign', 'local') NOT NULL DEFAULT 'local', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`user\``);
  }
}
