import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { DEFAULT_PAGE, DEFAULT_SIZE } from 'src/common/utils/constant';

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
  studentEmail: string;

  @ApiProperty({ required: false })
  @IsNotEmpty()
  page?: number = DEFAULT_PAGE;

  @ApiProperty({ required: false })
  @IsNotEmpty()
  size?: number = DEFAULT_SIZE;
}
