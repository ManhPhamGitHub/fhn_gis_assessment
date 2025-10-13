import { MigrationInterface, QueryRunner } from "typeorm";

export class InitDb1734666320147 implements MigrationInterface {
    name = 'InitDb1734666320147'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`symptom\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_7cae634d3300e9f2c5e9f5ad6d\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`health_declaration\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`temperature\` decimal(4,2) NOT NULL, \`contactWithSuspected\` tinyint NOT NULL, \`additionalNotes\` varchar(255) NULL, \`submittedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`health_declaration_symptom\` (\`id\` int NOT NULL AUTO_INCREMENT, \`healthDeclarationId\` int NULL, \`symptomId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`health_declaration_symptom\` ADD CONSTRAINT \`FK_e944bf61e5b51fa72eb1cfc74a4\` FOREIGN KEY (\`healthDeclarationId\`) REFERENCES \`health_declaration\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`health_declaration_symptom\` ADD CONSTRAINT \`FK_2c8507a48dd11b2913418624e71\` FOREIGN KEY (\`symptomId\`) REFERENCES \`symptom\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`health_declaration_symptom\` DROP FOREIGN KEY \`FK_2c8507a48dd11b2913418624e71\``);
        await queryRunner.query(`ALTER TABLE \`health_declaration_symptom\` DROP FOREIGN KEY \`FK_e944bf61e5b51fa72eb1cfc74a4\``);
        await queryRunner.query(`DROP TABLE \`health_declaration_symptom\``);
        await queryRunner.query(`DROP TABLE \`health_declaration\``);
        await queryRunner.query(`DROP INDEX \`IDX_7cae634d3300e9f2c5e9f5ad6d\` ON \`symptom\``);
        await queryRunner.query(`DROP TABLE \`symptom\``);
    }

}
