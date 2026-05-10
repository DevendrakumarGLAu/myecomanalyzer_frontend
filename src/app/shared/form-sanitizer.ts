import { DomSanitizer } from '@angular/platform-browser';
import { SecurityContext } from '@angular/core';

export function sanitizeFormValues<T>(data: T, sanitizer: DomSanitizer): T {
  if (data === null || data === undefined) {
    return data;
  }

  if (typeof data === 'string') {
    const sanitized = sanitizer.sanitize(SecurityContext.HTML, data);
    return (sanitized ?? '') as unknown as T;
  }

  if (Array.isArray(data)) {
    return data.map(item => sanitizeFormValues(item, sanitizer)) as unknown as T;
  }

  if (typeof data === 'object') {
    const cleaned: any = {};
    for (const [key, value] of Object.entries(data as any)) {
      cleaned[key] = sanitizeFormValues(value as any, sanitizer);
    }
    return cleaned as T;
  }

  return data;
}
