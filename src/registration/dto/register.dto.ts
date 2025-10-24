import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEmail, IsNotEmpty } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ required: true, description: 'Target class name' })
  @IsNotEmpty()
  readonly class: string;

  @ApiProperty({ required: true })
  @IsArray()
  @IsEmail({}, { each: true })
  students: string[];
}
