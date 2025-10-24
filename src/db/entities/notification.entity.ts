import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Teacher } from './teacher.entity';

@Entity({ name: 'notifications' })
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Teacher, { nullable: false })
  teacher: Teacher;

  @Column({ type: 'text' })
  recipients: string;

  @Column({ type: 'text' })
  text: string;

  @CreateDateColumn()
  createdAt: Date;
}
