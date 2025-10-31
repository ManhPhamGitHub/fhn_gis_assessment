import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Teacher } from './teacher.entity';
import { Notification } from './notification.entity';
@Entity({ name: 'students' })
export class Student {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ default: false })
  suspended: boolean;

  @ManyToMany(() => Teacher, (teacher) => teacher.students)
  teachers: Teacher[];

  @ManyToMany(() => Notification, (notification) => notification.students)
  notifications: Notification[];
}
