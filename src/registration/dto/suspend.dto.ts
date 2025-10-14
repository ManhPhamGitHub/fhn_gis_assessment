import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class SuspendDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsEmail()
  student: string;
}
