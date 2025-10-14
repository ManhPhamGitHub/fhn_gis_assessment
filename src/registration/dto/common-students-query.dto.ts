import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsEmail, ArrayNotEmpty, IsOptional } from 'class-validator';

export class CommonStudentsQueryDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsEmail({}, { each: true })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  teacher: string[];
}
