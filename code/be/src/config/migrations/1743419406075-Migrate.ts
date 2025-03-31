import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrate1743419406075 implements MigrationInterface {
    name = 'Migrate1743419406075'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`booking_detail\` DROP COLUMN \`total_price\``);
        await queryRunner.query(`ALTER TABLE \`booking\` DROP COLUMN \`total_price\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`booking\` ADD \`total_price\` decimal NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`booking_detail\` ADD \`total_price\` decimal NOT NULL`);
    }

}
