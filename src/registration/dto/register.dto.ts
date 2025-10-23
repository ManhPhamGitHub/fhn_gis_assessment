import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEmail, IsNotEmpty } from 'class-validator';

export class RegisterStudentToClassDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  className: string;

  @ApiProperty({ required: true })
  @IsArray()
  @IsEmail({}, { each: true })
  students: string[];
}

export class RegisterClassDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  className: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  subjectName: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  teacherEmail: string;
}
