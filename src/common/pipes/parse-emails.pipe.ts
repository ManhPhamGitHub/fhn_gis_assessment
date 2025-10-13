import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { isEmail } from 'class-validator';

@Injectable()
export class ParseEmailsPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (!value) return value;

    // normalize teacher email
    if (value.teacher && typeof value.teacher === 'string') {
      const e = value.teacher.trim().toLowerCase();
      if (!isEmail(e))
        throw new BadRequestException('teacher must be a valid email');
      value.teacher = e;
    }

    // normalize single student field (suspend)
    if (value.student && typeof value.student === 'string') {
      const e = value.student.trim().toLowerCase();
      if (!isEmail(e))
        throw new BadRequestException('student must be a valid email');
      value.student = e;
    }

    // normalize students array
    if (value.students && Array.isArray(value.students)) {
      const normalized = value.students.map((s) => {
        if (typeof s !== 'string')
          throw new BadRequestException('students must be an array of emails');
        const e = s.trim().toLowerCase();
        if (!isEmail(e))
          throw new BadRequestException('students must contain valid emails');
        return e;
      });
      value.students = Array.from(new Set(normalized));
    }

    return value;
  }
}
