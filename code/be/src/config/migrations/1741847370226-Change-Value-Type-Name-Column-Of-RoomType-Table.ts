import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeValueTypeNameColumnOfRoomTypeTable1741847370226
  implements MigrationInterface
{
  name = 'ChangeValueTypeNameColumnOfRoomTypeTable1741847370226';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_0e04f7180c0010be1afdb24860\` ON \`room_type\``,
    );
    await queryRunner.query(`ALTER TABLE \`room_type\` DROP COLUMN \`name\``);
    await queryRunner.query(
      `ALTER TABLE \`room_type\` ADD \`name\` enum ('A', 'B', 'C') NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`room_type\` DROP COLUMN \`name\``);
    await queryRunner.query(
      `ALTER TABLE \`room_type\` ADD \`name\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`IDX_0e04f7180c0010be1afdb24860\` ON \`room_type\` (\`name\`)`,
    );
  }
}
