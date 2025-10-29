import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Teacher } from '../db/entities/teacher.entity';
import { Student } from '../db/entities/student.entity';
import { Class } from '../db/entities/class.entity';
import { MENTION_REGEX } from 'src/common/utils/constant';

@Injectable()
export class RegistrationService {
  constructor(
    @InjectRepository(Teacher)
    private readonly teacherRepo: Repository<Teacher>,
    @InjectRepository(Student)
    private readonly studentRepo: Repository<Student>,
    @InjectRepository(Class)
    private readonly classRepo: Repository<Class>,
  ) {}

  async registerClass(
    className: string,
    teacherEmail: string,
    capacity: number,
  ) {
    let teacher = await this.teacherRepo.findOne({
      where: { email: teacherEmail },
    });
    if (!teacher) {
      throw new NotFoundException('teacher not found');
    }

    let existingClass = await this.classRepo.findOne({
      where: { name: className },
    });
    if (existingClass) {
      throw new BadRequestException('class already exists');
    }

    const newClass = this.classRepo.create({
      name: className,
      teacher: teacher,
      capacity: capacity,
    });
    await this.classRepo.save(newClass);
  }

  // register students into an existing class. Class and teacher must already exist.
  async registerStudents(className: string, studentEmails: string[]) {
    const cls = await this.classRepo.findOne({
      where: { name: className },
      relations: ['students', 'teacher'],
    });
    if (!cls) throw new NotFoundException('class not found');
    if (!cls.teacher)
      throw new NotFoundException('class has no assigned teacher');
    const studentsToAdd = [...cls.students];
    let studentsNotRegistered: string[] = [];
    let totalStudent = studentsToAdd.length || 0;
    for (const [index, email] of studentEmails.entries()) {
      let student = await this.studentRepo.findOne({ where: { email } });
      if (!student) {
        student = this.studentRepo.create({ email, suspended: false });
        await this.studentRepo.save(student);
      }
      if (!studentsToAdd.find((s) => s.email === email)) {
        studentsToAdd.push(student);
        totalStudent++;
        if (totalStudent >= cls.capacity) {
          studentsNotRegistered = studentEmails.slice(index);
          break;
        }
      }
    }

    cls.students = studentsToAdd;
    await this.classRepo.save(cls);
    if (studentsNotRegistered.length > 0) {
      return {
        message: `Class ${className} is full. Some students were not registered.`,
        studentsNotRegistered,
      };
    }
    return { message: 'All students registered successfully' };
  }

  // Return students common to all teachers passed in. Teachers are linked to classes they teach.
  async commonStudents(teacherEmails: string[]): Promise<string[]> {
    if (!teacherEmails || teacherEmails.length === 0) return [];

    // load classes for eac h teacher including students
    const teachers = await this.teacherRepo.find({
      where: teacherEmails.map((email) => ({ email })),
      relations: ['classes', 'classes.students'],
    });

    if (!teachers || teachers.length === 0) return [];

    const counts = new Map<string, Set<string>>();
    for (const teacher of teachers) {
      for (const cls of teacher.classes || []) {
        for (const s of cls.students || []) {
          if (!counts.has(s.email)) {
            counts.set(s.email, new Set());
          }
          counts.get(s.email).add(teacher.email);
        }
      }
    }

    const common: string[] = [];
    for (const [email, teacherEmails] of counts.entries()) {
      if (teacherEmails.size >= teachers.length) common.push(email);
    }
    return common.sort();
  }

  async suspend(studentEmail: string) {
    const student = await this.studentRepo.findOne({
      where: { email: studentEmail },
    });
    if (!student) {
      throw new NotFoundException('student not found');
    }
    student.suspended = true;
    await this.studentRepo.save(student);
  }

  async retrieveForNotifications(teacherEmail: string, notification: string) {
    const teacher = await this.teacherRepo.findOne({
      where: { email: teacherEmail },
      relations: ['students'],
    });

    const recipients = new Set<string>();

    // extract mentions (use a fresh RegExp instance to avoid shared state)
    const mentionRegex = new RegExp(MENTION_REGEX);
    let match;
    while ((match = mentionRegex.exec(notification)) !== null) {
      const email = match[1];
      const student = await this.studentRepo.findOne({ where: { email } });
      if (student && !student.suspended) recipients.add(email);
    }

    return Array.from(recipients);
  }
}
