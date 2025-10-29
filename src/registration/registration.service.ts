import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Teacher } from '../db/entities/teacher.entity';
import { Student } from '../db/entities/student.entity';
import { Subject } from '../db/entities/subject.entity';
import { Class } from '../db/entities/class.entity';
import { MENTION_REGEX } from '../common/utils/constant';

@Injectable()
export class RegistrationService {
  constructor(
    @InjectRepository(Teacher)
    private readonly teacherRepo: Repository<Teacher>,
    @InjectRepository(Student)
    private readonly studentRepo: Repository<Student>,
    @InjectRepository(Subject)
    private readonly subjectRepo: Repository<Subject>,
    @InjectRepository(Class)
    private readonly classRepo: Repository<Class>,
  ) {}

  async registerClass(
    className: string,
    subjectName: string,
    teacherEmail: string,
  ) {
    let subject = await this.subjectRepo.findOne({
      where: { name: subjectName },
    });
    if (!subject) {
      subject = this.subjectRepo.create({ name: subjectName });
      await this.subjectRepo.save(subject);
    }

    let teacher = await this.teacherRepo.findOne({
      where: { email: teacherEmail },
    });
    if (!teacher) {
      teacher = this.teacherRepo.create({ email: teacherEmail });
      await this.teacherRepo.save(teacher);
    }

    let cls = await this.classRepo.findOne({ where: { name: className } });
    if (!cls) {
      cls = this.classRepo.create({ name: className, subject, teacher });
      await this.classRepo.save(cls);
    } else {
      cls.subject = subject;
      cls.teacher = teacher;
      await this.classRepo.save(cls);
    }

    return;
  }

  async registerStudentsToClass(studentEmails: string[], className: string) {
    let cls = await this.classRepo.findOne({
      where: { name: className },
      relations: ['students'],
    });

    if (!cls) {
      throw new NotFoundException('class not found');
    }
    const students: Student[] = [];
    for (const email of studentEmails) {
      let student = await this.studentRepo.findOne({ where: { email } });
      if (!student) {
        student = this.studentRepo.create({ email });
        await this.studentRepo.save(student);
      }
      students.push(student);
    }

    if (students.length > 0) {
      cls.students = [...(cls.students || []), ...students];
      await this.classRepo.save(cls);
    }

    return;
  }

  async commonStudents(teacherEmails: string[]): Promise<string[]> {
    const teachers = await this.teacherRepo.find({
      where: teacherEmails.map((email) => ({ email })),
      relations: ['students'],
    });

    if (!teachers || teachers.length === 0) return [];

    // Map student email to count
    const counts = new Map<string, number>();

    const common: string[] = [];
    for (const [email, cnt] of counts.entries()) {
      if (cnt === teachers.length) common.push(email);
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
