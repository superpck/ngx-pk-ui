import { Pipe, PipeTransform } from '@angular/core';

/**
 * Truncates a string to `limit` characters and appends `ellipsis` when truncated.
 *
 * ```html
 * {{ longText | pkTruncate: 80 }}
 * {{ longText | pkTruncate: 40 : ' ...' }}
 * ```
 */
@Pipe({ name: 'pkTruncate', standalone: true, pure: true })
export class PkTruncatePipe implements PipeTransform {
  transform(value: string | null | undefined, limit = 100, ellipsis = '…'): string {
    if (value == null) return '';
    if (value.length <= limit) return value;
    return value.slice(0, limit) + ellipsis;
  }
}
