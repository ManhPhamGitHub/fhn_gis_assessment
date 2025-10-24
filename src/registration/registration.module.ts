import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegistrationController } from './registration.controller';
import { RegistrationService } from './registration.service';
import { Student } from '../db/entities/student.entity';
import { Teacher } from '../db/entities/teacher.entity';
import { WhitelistService } from '../whitelist/whitelist.service';
import { WhitelistDomain } from '../db/entities/whitelist.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Teacher, Student, WhitelistDomain])],
  controllers: [RegistrationController],
  providers: [RegistrationService, WhitelistService],
})
export class RegistrationModule {}
