import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEmail, IsNotEmpty } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsEmail()
  teacher: string;

  @ApiProperty({ required: true })
  @IsArray()
  @IsEmail({}, { each: true })
  students: string[];
}
