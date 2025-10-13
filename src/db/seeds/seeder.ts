import { Connection, IsNull } from 'typeorm';
import { AppDataSource } from '../data-source';
import { Student } from '../entities/student.entity';
const students = require('./data/students.json');

const seed = async () => {
  const dataSource = await AppDataSource.initialize();

  const studentRepository = dataSource.getRepository(Student);

  for (const student of students) {
    const exists = await studentRepository.findOneBy({ email: student.email });
    if (!exists) {
      const newStudent = studentRepository.create(student);
      await studentRepository.save(newStudent);
    }
  }

  console.log('Seed data inserted successfully');
  await dataSource.destroy();
};

seed().catch((err) => {
  console.error('Error seeding data:', err);
});
