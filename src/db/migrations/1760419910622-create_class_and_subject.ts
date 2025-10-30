import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateClassAndSubjectTables1760415910693 implements MigrationInterface {
    name = 'CreateClassAndSubjectTables1760415910693'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`subjects\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_5a1f7c4e3e3f3e3f3e3f3e3f3e\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`classes\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_5a1f7c4e3e3f3e3f3e3f3e3f3e\` (\`name\`),  \`subjectId\` int NULL, \`teacherId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }
    
    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`classes\``);
        await queryRunner.query(`DROP TABLE \`subjects\``);
    }
}
