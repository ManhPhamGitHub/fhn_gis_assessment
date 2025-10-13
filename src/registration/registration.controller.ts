import { Body, Controller, Get, HttpCode, Post, Query } from '@nestjs/common';
import { NotificationDto } from './dto/notification.dto';
import { RegisterDto } from './dto/register.dto';
import { SuspendDto } from './dto/suspend.dto';
import { RegistrationService } from './registration.service';
import { ParseEmailsPipe } from '../common/pipes/parse-emails.pipe';
import { ParseTeacherQueryPipe } from '../common/pipes/parse-teacher-query.pipe';

@Controller()
export class RegistrationController {
  constructor(private readonly regService: RegistrationService) {}

  @Post('register')
  @HttpCode(204)
  async register(@Body(ParseEmailsPipe) body: RegisterDto) {
    await this.regService.register(body.teacher, body.students);
  }

  @Get('commonstudents')
  async commonstudents(
    @Query('teacher', ParseTeacherQueryPipe) teachers: string[],
  ) {
    const students = await this.regService.commonStudents(teachers);
    return { students };
  }

  @Post('suspend')
  @HttpCode(204)
  async suspend(@Body(ParseEmailsPipe) body: SuspendDto) {
    await this.regService.suspend(body.student);
  }

  @Post('retrievefornotifications')
  async retrieve(@Body(ParseEmailsPipe) body: NotificationDto) {
    const recipients = await this.regService.retrieveForNotifications(
      body.teacher,
      body.notification,
    );
    return { recipients };
  }
}
