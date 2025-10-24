import { Body, Controller, Get, HttpCode, Post, Query } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { SuspendDto } from './dto/suspend.dto';
import { RegistrationService } from './registration.service';
import { CommonStudentsQueryDto } from './dto/common-students-query.dto';
import { RegisterClassDto } from './dto/class.dto';

@Controller()
export class RegistrationController {
  constructor(private readonly regService: RegistrationService) {}

  @Post('register-student')
  @HttpCode(204)
  async registerStudent(@Body() body: RegisterDto) {
    await this.regService.registerStudent(body.className, body.students);
  }

  @Post('class')
  @HttpCode(204)
  async registerClass(@Body() body: RegisterClassDto) {
    await this.regService.registerClass(
      body.className,
      body.teacherEmail,
      body.capacity,
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
}
