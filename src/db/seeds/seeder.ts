import { AppDataSource } from '../data-source';
import { Student } from '../entities/student.entity';
import { Teacher } from '../entities/teacher.entity';

const students = require('./data/students.json');
const teachers = require('./data/teachers.json');

const seed = async () => {
  const dataSource = await AppDataSource.initialize();

  const studentRepository = dataSource.getRepository(Student);
  const teacherRepository = dataSource.getRepository(Teacher);

  // Seed students first
  for (const student of students) {
    const exists = await studentRepository.findOneBy({ email: student.email });
    if (!exists) {
      const newStudent = studentRepository.create({
        email: student.email,
        suspended: !!student.suspended,
      });
      await studentRepository.save(newStudent);
    }
  }

  // Seed teachers and their student relationships
  for (const t of teachers) {
    let teacher = await teacherRepository.findOne({
      where: { email: t.email },
      relations: ['students'],
    });
    if (!teacher) {
      teacher = teacherRepository.create({ email: t.email });
    }

    await teacherRepository.save(teacher);
  }

  console.log('Seed data inserted successfully');
  await dataSource.destroy();
};

seed().catch((err) => {
  console.error('Error seeding data:', err);
});
