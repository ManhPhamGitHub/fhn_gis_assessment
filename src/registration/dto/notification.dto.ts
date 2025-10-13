import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class NotificationDto {
  @IsNotEmpty()
  @IsEmail()
  teacher: string;

  @IsNotEmpty()
  @IsString()
  notification: string;
}
