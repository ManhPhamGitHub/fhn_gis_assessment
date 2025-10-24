import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Student } from './student.entity';
import { Notification } from './notification.entity';

@Entity({ name: 'teachers' })
export class Teacher {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @ManyToMany(() => Student, (student) => student.teachers)
  @JoinTable()
  students: Student[];

  @OneToMany(() => Notification, (notification) => notification.teacher)
  notifications: Notification[];
}
