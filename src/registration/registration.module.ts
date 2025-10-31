import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegistrationController } from './registration.controller';
import { RegistrationService } from './registration.service';
import { Student } from '../db/entities/student.entity';
import { Teacher } from '../db/entities/teacher.entity';
import { Notification } from '../db/entities/notification.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Teacher, Student, Notification])],
  controllers: [RegistrationController],
  providers: [RegistrationService],
})
export class RegistrationModule {}
