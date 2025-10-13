import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { isEmail } from 'class-validator';

@Injectable()
export class ParseTeacherQueryPipe implements PipeTransform {
  transform(value: any) {
    // value can be a string, array of strings, or undefined
    if (!value) {
      throw new BadRequestException('teacher query parameter is required');
    }

    const arr = Array.isArray(value) ? value : [value];
    if (arr.length === 0)
      throw new BadRequestException('teacher query parameter is required');

    const normalized = arr.map((s) => {
      if (typeof s !== 'string')
        throw new BadRequestException('teacher must be a valid email');
      const e = s.trim().toLowerCase();
      if (!isEmail(e))
        throw new BadRequestException(`invalid teacher email: ${s}`);
      return e;
    });

    // dedupe
    return Array.from(new Set(normalized));
  }
}
