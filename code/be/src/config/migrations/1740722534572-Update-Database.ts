import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateDatabase1740722534572 implements MigrationInterface {
  name = 'UpdateDatabase1740722534572';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`user\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`role\` enum ('admin', 'user') NOT NULL DEFAULT 'user', \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`nationality\` varchar(255) NOT NULL, \`user_type\` enum ('foreign', 'local') NOT NULL DEFAULT 'local', UNIQUE INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` ON \`user\``,
    );
    await queryRunner.query(`DROP TABLE \`user\``);
  }
}
