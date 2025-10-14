import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class NotificationDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsEmail()
  teacher: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  notification: string;
}
