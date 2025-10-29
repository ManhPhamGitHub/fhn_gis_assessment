import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Teacher } from './teacher.entity';
import { Class } from './class.entity';

@Entity({ name: 'students' })
export class Student {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ default: false })
  suspended: boolean;

  @ManyToMany(() => Class, (classEntity) => classEntity.students)
  classes: Class[];
}
