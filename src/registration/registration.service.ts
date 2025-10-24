import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Teacher } from '../db/entities/teacher.entity';
import { Student } from '../db/entities/student.entity';
import { MENTION_REGEX } from '../common/utils/constant';
import { Notification } from '../db/entities/notification.entity';
import { NotificationQueryDto } from './dto/notification.dto';

@Injectable()
export class RegistrationService {
  constructor(
    @InjectRepository(Teacher)
    private readonly teacherRepo: Repository<Teacher>,
    @InjectRepository(Student)
    private readonly studentRepo: Repository<Student>,
    @InjectRepository(Notification)
    private readonly notificationRepo: Repository<Notification>,
  ) {}

  async register(teacherEmail: string, studentEmails: string[]) {
    if (!studentEmails || studentEmails.length === 0) return;

    let teacher = await this.teacherRepo.findOne({
      where: { email: teacherEmail },
      relations: ['students'],
    });
    if (!teacher) {
      teacher = this.teacherRepo.create({ email: teacherEmail });
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

    teacher.students = Array.from(
      new Set([...(teacher.students || []), ...students]),
    );
    await this.teacherRepo.save(teacher);
  }

  async commonStudents(teacherEmails: string[]): Promise<string[]> {
    const teachers = await this.teacherRepo.find({
      where: teacherEmails.map((email) => ({ email })),
      relations: ['students'],
    });

    if (!teachers || teachers.length === 0) return [];

    // Map student email to count
    const counts = new Map<string, number>();
    for (const teacher of teachers) {
      for (const s of teacher.students || []) {
        counts.set(s.email, (counts.get(s.email) || 0) + 1);
      }
    }

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

    if (teacher) {
      for (const s of teacher.students || []) {
        if (!s.suspended) recipients.add(s.email);
      }
    }

    // extract mentions (use a fresh RegExp instance to avoid shared state)
    const mentionRegex = new RegExp(MENTION_REGEX);
    let match;
    while ((match = mentionRegex.exec(notification)) !== null) {
      const email = match[1];
      const student = await this.studentRepo.findOne({ where: { email } });
      if (student && !student.suspended) recipients.add(email);
    }

    const finalRecipients = Array.from(recipients);

    const notif = this.notificationRepo.create({
      teacher: teacher,
      recipients: finalRecipients,
      text: notification,
    });
    await this.notificationRepo.save(notif);

    return finalRecipients;
  }

  async listNotifications(notificationQueryDto: NotificationQueryDto) {
    const { teacher, page = 1, size = 20 } = notificationQueryDto;

    const qb = this.notificationRepo
      .createQueryBuilder('n')
      .leftJoinAndSelect('n.teacher', 'teacher')
      .where('teacher.email = :email', { email: teacher })
      .orderBy('n.createdAt', 'DESC');

    const total = await qb.getCount();
    const items = await qb
      .skip((page - 1) * size)
      .take(size)
      .getMany();

    return {
      items: items.map((i) => ({
        id: i.id,
        text: i.text,
        recipients: i.recipients,
        createdAt: i.createdAt,
      })),
      total,
      page,
      size,
    };
  }
}
