import { IsEmail, IsNotEmpty } from 'class-validator';

export class SuspendDto {
  @IsNotEmpty()
  @IsEmail()
  student: string;
}
