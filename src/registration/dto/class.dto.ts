import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEmail, IsNotEmpty, Max, Min } from 'class-validator';

export class RegisterClassDto {
  @ApiProperty({ required: true, description: 'Target class name' })
  @IsNotEmpty()
  className: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  teacherEmail: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @Min(1)
  @Max(20)
  capacity: number;
}
