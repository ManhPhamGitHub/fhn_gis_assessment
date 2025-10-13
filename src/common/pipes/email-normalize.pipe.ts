import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class EmailNormalizePipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (!value) return value;

    // normalize teacher and student emails in bodies/queries
    const normalize = (v: any) => {
      if (typeof v === 'string') return v.trim().toLowerCase();
      if (Array.isArray(v))
        return v.map((s) =>
          typeof s === 'string' ? s.trim().toLowerCase() : s,
        );
      if (typeof v === 'object') {
        const out: any = {};
        for (const k of Object.keys(v)) {
          const val = v[k];
          if (
            (typeof val === 'string' && k.toLowerCase().includes('email')) ||
            k.toLowerCase().includes('student') ||
            k.toLowerCase().includes('teacher')
          ) {
            out[k] = val.trim().toLowerCase();
          } else if (
            Array.isArray(val) &&
            val.every((it) => typeof it === 'string')
          ) {
            out[k] = val.map((it) => it.trim().toLowerCase());
          } else out[k] = val;
        }
        return out;
      }
      return value;
    };

    return normalize(value);
  }
}
