import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateBookingAndInvoiceTables1742995138596
  implements MigrationInterface
{
  name = 'CreateBookingAndInvoiceTables1742995138596';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`booking_details\` (\`id\` varchar(36) NOT NULL, \`total_price\` decimal(10,2) NOT NULL, \`guest_count\` int NOT NULL, \`start_date\` timestamp NOT NULL, \`end_date\` timestamp NOT NULL, \`booking_id\` varchar(36) NULL, \`room_id\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`invoice\` (\`id\` varchar(36) NOT NULL, \`base_price\` decimal(10,2) NOT NULL, \`total_price\` decimal(10,2) NOT NULL, \`day_rent\` int NOT NULL, \`status\` enum ('paid', 'unpaid', 'cancelled') NOT NULL DEFAULT 'unpaid', \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`booking_id\` varchar(36) NULL, UNIQUE INDEX \`REL_ee283c9adbadc5f1a2ff392eee\` (\`booking_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`booking\` (\`id\` varchar(36) NOT NULL, \`total_price\` decimal(10,2) NOT NULL, \`status\` enum ('pending', 'confirmed', 'cancelled') NOT NULL DEFAULT 'pending', \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`user_id\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`booking_details\` ADD CONSTRAINT \`FK_be5cd3c6d04d0ce156fcadd7e72\` FOREIGN KEY (\`booking_id\`) REFERENCES \`booking\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`booking_details\` ADD CONSTRAINT \`FK_57f3269d238d3af5420e6e4fe89\` FOREIGN KEY (\`room_id\`) REFERENCES \`room\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`invoice\` ADD CONSTRAINT \`FK_ee283c9adbadc5f1a2ff392eee5\` FOREIGN KEY (\`booking_id\`) REFERENCES \`booking\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`booking\` ADD CONSTRAINT \`FK_276896d1a1a30be6de9d7d43f53\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`booking\` DROP FOREIGN KEY \`FK_276896d1a1a30be6de9d7d43f53\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`invoice\` DROP FOREIGN KEY \`FK_ee283c9adbadc5f1a2ff392eee5\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`booking_details\` DROP FOREIGN KEY \`FK_57f3269d238d3af5420e6e4fe89\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`booking_details\` DROP FOREIGN KEY \`FK_be5cd3c6d04d0ce156fcadd7e72\``,
    );
    await queryRunner.query(`DROP TABLE \`booking\``);
    await queryRunner.query(
      `DROP INDEX \`REL_ee283c9adbadc5f1a2ff392eee\` ON \`invoice\``,
    );
    await queryRunner.query(`DROP TABLE \`invoice\``);
    await queryRunner.query(`DROP TABLE \`booking_details\``);
  }
}
