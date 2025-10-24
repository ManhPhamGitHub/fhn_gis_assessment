import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEmail, IsNotEmpty } from 'class-validator';

export class RegisterClassDto {
  @ApiProperty({ required: true, description: 'Target class name' })
  @IsNotEmpty()
  className: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  teacherEmail: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  capacity: number;
}
