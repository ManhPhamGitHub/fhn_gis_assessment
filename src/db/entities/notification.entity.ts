import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Teacher } from './teacher.entity';
import { Student } from './student.entity';

@Entity({ name: 'notifications' })
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Teacher, { nullable: false })
  teacher: Teacher;

  @ManyToMany(() => Student, { nullable: false })
  @JoinTable()
  students: Student[];

  @Column({ type: 'text' })
  text: string;

  @CreateDateColumn()
  createdAt: Date;
}
