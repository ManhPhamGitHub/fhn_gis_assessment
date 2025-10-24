import { Body, Controller, Get, HttpCode, Post, Query } from '@nestjs/common';
import { NotificationDto, NotificationQueryDto } from './dto/notification.dto';
import { RegisterDto } from './dto/register.dto';
import { SuspendDto } from './dto/suspend.dto';
import { RegistrationService } from './registration.service';
import { CommonStudentsQueryDto } from './dto/common-students-query.dto';

@Controller()
export class RegistrationController {
  constructor(private readonly regService: RegistrationService) {}

  @Post('register')
  @HttpCode(204)
  async register(@Body() body: RegisterDto) {
    await this.regService.register(body.teacher, body.students);
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

  @Get('notifications')
  async notifications(
    @Query() query: NotificationQueryDto,
  ) {
    const res = await this.regService.listNotifications(query);
    return res;
  }
}
