import { IsArray, IsEmail, IsNotEmpty } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  @IsEmail()
  teacher: string;

  @IsArray()
  @IsEmail({}, { each: true })
  students: string[];
}
