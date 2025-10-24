import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Teacher } from './teacher.entity';
import { Student } from './student.entity';

@Entity({ name: 'classes' })
export class Class {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ default: 30 })
  capacity: number;

  @ManyToOne(() => Teacher, (teacher) => teacher.classes, { nullable: true })
  teacher: Teacher;

  @ManyToMany(() => Student, (student: any) => student.classes)
  @JoinTable({ name: 'class_students' })
  students: Student[];
}
