import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Student } from './student.entity';
import { Class } from './class.entity';

@Entity({ name: 'teachers' })
export class Teacher {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @OneToMany(() => Class, (cls) => cls.teacher, { nullable: true })
  classes: Class[];
}
