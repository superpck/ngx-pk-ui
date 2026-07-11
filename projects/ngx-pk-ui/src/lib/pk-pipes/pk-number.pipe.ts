import { Pipe, PipeTransform } from '@angular/core';

/**
 * Formats a number as a human-readable file size.
 *
 * ```html
 * {{ file.size | pkNumber }}          <!-- "1.4M" -->
 * {{ file.size | pkNumber: 2 }}       <!-- "1.37M" -->
 * ```
 */
@Pipe({ name: 'pkNumber', standalone: true, pure: true })
export class PkNumberPipe implements PipeTransform {
  private static readonly UNITS = ['', 'K', 'M', 'G', 'T'];

  transform(bytes: number | null | undefined, decimals = 1): string {
    if (bytes == null || isNaN(bytes as number)) return '';
    if (bytes === 0) return '0';
    const k = 1000;
    const i = Math.min(
      Math.floor(Math.log(Math.abs(bytes)) / Math.log(k)),
      PkNumberPipe.UNITS.length - 1,
    );
    return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + PkNumberPipe.UNITS[i];
  }
}
