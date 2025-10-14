import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1760415910693 implements MigrationInterface {
    name = 'Migrations1760415910693'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`students\` (\`id\` int NOT NULL AUTO_INCREMENT, \`email\` varchar(255) NOT NULL, \`suspended\` tinyint NOT NULL DEFAULT 0, UNIQUE INDEX \`IDX_25985d58c714a4a427ced57507\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`teachers\` (\`id\` int NOT NULL AUTO_INCREMENT, \`email\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_7568c49a630907119e4a665c60\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`teachers_students_students\` (\`teachersId\` int NOT NULL, \`studentsId\` int NOT NULL, INDEX \`IDX_f98a9117e1a254cde825f78593\` (\`teachersId\`), INDEX \`IDX_275f70179c41a336ba74c4007c\` (\`studentsId\`), PRIMARY KEY (\`teachersId\`, \`studentsId\`)) ENGINE=InnoDB`);
}

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_275f70179c41a336ba74c4007c\` ON \`teachers_students_students\``);
        await queryRunner.query(`DROP INDEX \`IDX_f98a9117e1a254cde825f78593\` ON \`teachers_students_students\``);
        await queryRunner.query(`DROP TABLE \`teachers_students_students\``);
        await queryRunner.query(`DROP INDEX \`IDX_7568c49a630907119e4a665c60\` ON \`teachers\``);
        await queryRunner.query(`DROP TABLE \`teachers\``);
        await queryRunner.query(`DROP INDEX \`IDX_25985d58c714a4a427ced57507\` ON \`students\``);
        await queryRunner.query(`DROP TABLE \`students\``);
    }

}
