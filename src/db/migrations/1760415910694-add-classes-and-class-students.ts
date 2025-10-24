import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddClassesAndClassStudents1760415910694
  implements MigrationInterface
{
  name = 'AddClassesAndClassStudents1760415910694';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`classes\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`capacity\` int NOT NULL DEFAULT 30, \`teacherId\` int NULL, UNIQUE INDEX \`IDX_classes_name\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`classes\` ADD CONSTRAINT \`FK_classes_teacher\` FOREIGN KEY (\`teacherId\`) REFERENCES \`teachers\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `CREATE TABLE \`class_students\` (\`classId\` int NOT NULL, \`studentId\` int NOT NULL, INDEX \`IDX_class_students_class\` (\`classId\`), INDEX \`IDX_class_students_student\` (\`studentId\`), PRIMARY KEY (\`classId\`, \`studentId\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS \`teachers_students_students\` (\`teachersId\` int NOT NULL, \`studentsId\` int NOT NULL, PRIMARY KEY (\`teachersId\`, \`studentsId\`)) ENGINE=InnoDB`,
    
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_class_students_student\` ON \`class_students\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_class_students_class\` ON \`class_students\``,
    );
    await queryRunner.query(`DROP TABLE \`class_students\``);
    await queryRunner.query(`DROP INDEX \`IDX_classes_name\` ON \`classes\``);
    await queryRunner.query(`DROP TABLE \`classes\``);
  }
}
