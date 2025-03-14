import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateColumnsInUserTable1741839373289
  implements MigrationInterface
{
  name = 'UpdateColumnsInUserTable1741839373289';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`room_type\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`description\` varchar(255) NULL, \`room_price\` decimal(10,2) NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` timestamp(6) NULL, UNIQUE INDEX \`IDX_0e04f7180c0010be1afdb24860\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`room\` (\`id\` varchar(36) NOT NULL, \`room_number\` varchar(255) NOT NULL, \`note\` text NULL, \`status\` enum ('available', 'occupied') NOT NULL DEFAULT 'available', \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` timestamp(6) NULL, \`room_type_id\` varchar(36) NULL, UNIQUE INDEX \`IDX_224248134ed3ac1fb6d2f87290\` (\`room_number\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`role\` ADD \`deleted_at\` timestamp(6) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_type\` ADD \`deleted_at\` timestamp(6) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD \`deleted_at\` timestamp(6) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_type\` CHANGE \`type_name\` \`type_name\` enum ('foreign', 'local') NOT NULL DEFAULT 'local'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`room\` ADD CONSTRAINT \`FK_55b383d0ec20230d193ca584a4a\` FOREIGN KEY (\`room_type_id\`) REFERENCES \`room_type\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`room\` DROP FOREIGN KEY \`FK_55b383d0ec20230d193ca584a4a\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_type\` CHANGE \`type_name\` \`type_name\` enum ('foreign', 'local') NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`deleted_at\``);
    await queryRunner.query(
      `ALTER TABLE \`user_type\` DROP COLUMN \`deleted_at\``,
    );
    await queryRunner.query(`ALTER TABLE \`role\` DROP COLUMN \`deleted_at\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_224248134ed3ac1fb6d2f87290\` ON \`room\``,
    );
    await queryRunner.query(`DROP TABLE \`room\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_0e04f7180c0010be1afdb24860\` ON \`room_type\``,
    );
    await queryRunner.query(`DROP TABLE \`room_type\``);
  }
}
