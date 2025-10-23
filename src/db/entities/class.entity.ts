import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Teacher } from './teacher.entity';
import { Subject } from './subject.entity';

@Entity({ name: 'classes' })
export class Class {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @ManyToOne(() => Subject, (subject) => subject.classes, { nullable: true })
  subject: Subject;

  @ManyToOne(() => Teacher, (teacher) => teacher.classes, { nullable: true })
  teacher: Teacher;

  @ManyToMany(
    () => require('./student.entity').Student,
    (student: any) => student.classes,
  )
  @JoinTable({ name: 'class_students' })
  students: any[];
}
