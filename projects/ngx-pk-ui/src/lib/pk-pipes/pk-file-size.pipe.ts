import { Pipe, PipeTransform } from '@angular/core';

/**
 * Formats a byte count as a human-readable file size.
 *
 * ```html
 * {{ file.size | pkFileSize }}          <!-- "1.4 MB" -->
 * {{ file.size | pkFileSize: 2 }}       <!-- "1.37 MB" -->
 * ```
 */
@Pipe({ name: 'pkFileSize', standalone: true, pure: true })
export class PkFileSizePipe implements PipeTransform {
  private static readonly UNITS = ['B', 'KB', 'MB', 'GB', 'TB'];

  transform(bytes: number | null | undefined, decimals = 1): string {
    if (bytes == null || isNaN(bytes as number)) return '';
    if (bytes === 0) return '0 B';
    const k = 1024;
    const i = Math.min(
      Math.floor(Math.log(Math.abs(bytes)) / Math.log(k)),
      PkFileSizePipe.UNITS.length - 1,
    );
    return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + PkFileSizePipe.UNITS[i];
  }
}
