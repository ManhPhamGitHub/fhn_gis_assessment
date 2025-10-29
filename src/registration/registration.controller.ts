import { Body, Controller, Get, HttpCode, Post, Query } from '@nestjs/common';
import { NotificationDto } from './dto/notification.dto';
import { SuspendDto } from './dto/suspend.dto';
import { RegistrationService } from './registration.service';
import { CommonStudentsQueryDto } from './dto/common-students-query.dto';
import {
  RegisterClassDto,
  RegisterStudentsToClassDto,
} from './dto/register.dto';

@Controller()
export class RegistrationController {
  constructor(private readonly regService: RegistrationService) {}

  @Post('register-students')
  @HttpCode(204)
  async registerStudent(@Body() body: RegisterStudentsToClassDto) {
    await this.regService.registerStudentsToClass(body.students, body.className);
  }

  @Post('register-class')
  @HttpCode(204)
  async registerClass(@Body() body: RegisterClassDto) {
    await this.regService.registerClass(
      body.className,
      body.subjectName,
      body.teacherEmail,
    );
  }

  @Get('commonstudents')
  async commonstudents(@Query() query: CommonStudentsQueryDto) {
    const students = await this.regService.commonStudents(query.teacher || []);
    return { students };
  }

  @Post('suspend')
  @HttpCode(204)
  async suspend(@Body() body: SuspendDto) {
    await this.regService.suspend(body.student);
  }

  @Post('retrievefornotifications')
  async retrieve(@Body() body: NotificationDto) {
    const recipients = await this.regService.retrieveForNotifications(
      body.teacher,
      body.notification,
    );
    return { recipients };
  }
}
