import { Pipe, PipeTransform } from '@angular/core';

/**
 * Renders a past date/time as a human-readable relative string.
 * Pure is `false` so the output refreshes on each change-detection cycle.
 *
 * ```html
 * {{ createdAt | pkTimeAgo }}   <!-- "3 minutes ago" -->
 * ```
 */
@Pipe({ name: 'pkTimeAgo', standalone: true, pure: false })
export class PkTimeAgoPipe implements PipeTransform {
  transform(value: Date | string | number | null | undefined): string {
    if (value == null) return '';
    const seconds = Math.floor((Date.now() - new Date(value).getTime()) / 1000);
    if (isNaN(seconds)) return '';

    if (seconds < 5)   return 'just now';
    if (seconds < 60)  return `${seconds} second${seconds === 1 ? '' : 's'} ago`;

    const m = Math.floor(seconds / 60);
    if (m < 60)        return `${m} minute${m === 1 ? '' : 's'} ago`;

    const h = Math.floor(m / 60);
    if (h < 24)        return `${h} hour${h === 1 ? '' : 's'} ago`;

    const d = Math.floor(h / 24);
    if (d < 7)         return `${d} day${d === 1 ? '' : 's'} ago`;

    const w = Math.floor(d / 7);
    if (w < 5)         return `${w} week${w === 1 ? '' : 's'} ago`;

    const mo = Math.floor(d / 30);
    if (mo < 12)       return `${mo} month${mo === 1 ? '' : 's'} ago`;

    const y = Math.floor(d / 365);
    return `${y} year${y === 1 ? '' : 's'} ago`;
  }
}
