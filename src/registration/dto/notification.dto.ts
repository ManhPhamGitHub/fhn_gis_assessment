import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

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

export class NotificationQueryDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsEmail()
  teacher: string;

  @ApiProperty({ required: false })
  @IsNotEmpty()
  page?: number;

  @ApiProperty({ required: false })
  @IsNotEmpty()
  size?: number;
}
