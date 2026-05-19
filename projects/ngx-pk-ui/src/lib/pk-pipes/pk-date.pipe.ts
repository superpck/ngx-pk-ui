import { Pipe, PipeTransform } from '@angular/core';
import type { PkLocale } from '../pk-locale/pk-locale.model';
import { getPkLocaleData } from '../pk-locale/pk-locale.model';

/**
 * Parses a **Buddhist Era** date string (e.g. "31/01/2568") into a CE `Date`.
 *
 * @param value     The date string to parse (e.g. `"31/01/2568"`)
 * @param separator Character(s) splitting the parts (default `"/"`)
 * @param order     Token order — `'dmy'` | `'mdy'` | `'ymd'` (default `'dmy'`)
 * @returns         A JavaScript `Date` with the equivalent CE year (BE year − 543)
 */
export function parseBEDate(
  value: string,
  separator = '/',
  order: 'dmy' | 'mdy' | 'ymd' = 'dmy',
): Date {
  const parts = value.split(separator);
  const idx: Record<string, number> = {};
  [...order].forEach((token, i) => { idx[token] = i; });

  const day    = parseInt(parts[idx['d']] ?? '1', 10);
  const month  = parseInt(parts[idx['m']] ?? '1', 10) - 1; // 0-based
  const yearBE = parseInt(parts[idx['y']] ?? '2568', 10);
  const yearCE = yearBE - 543;

  return new Date(yearCE, month, day);
}

/**
 * `pkDate` — locale-aware date formatting pipe with Buddhist Era support.
 *
 * ## Format tokens
 * | Token | Output |
 * |-------|--------|
 * | `d`   | Day without padding (1–31) |
 * | `dd`  | Day zero-padded (01–31) |
 * | `m`   | Month — number or locale name (driven by `style`) |
 * | `mm`  | Month padded (numeric) / locale name (abbr / full) |
 * | `yyyy`| 4-digit year |
 * | `yy`  | 2-digit year (`year % 100`, zero-padded) |
 *
 * All other characters in the format string are treated as literal separators.
 *
 * ## Usage
 * ```html
 * {{ date | pkDate:'d/m/yyyy' }}                        <!-- 31/1/2026 -->
 * {{ date | pkDate:'dd-mm-yyyy':'numeric' }}             <!-- 31-01-2026 -->
 * {{ date | pkDate:'d m yyyy':'abbr':'th':'BE' }}        <!-- 31 มค. 2568 -->
 * {{ date | pkDate:'d m yy':'abbr':'th':'BE' }}          <!-- 31 มค. 68  -->
 * {{ date | pkDate:'d-m-yyyy':'abbr':'es' }}             <!-- 31-Ene-2026 -->
 * {{ date | pkDate:'m, d yyyy':'full':'it' }}            <!-- Gennaio, 31 2026 -->
 * ```
 *
 * ## Buddhist Era input
 * Use `parseBEDate()` to convert a BE string to a CE `Date` before piping:
 * ```ts
 * const date = parseBEDate('31/01/2568'); // → new Date(2025, 0, 31)
 * ```
 */
@Pipe({ name: 'pkDate', standalone: true, pure: true })
export class PkDatePipe implements PipeTransform {
  transform(
    value: Date | number | string | null | undefined,
    format: string,
    style: 'numeric' | 'abbr' | 'full' = 'numeric',
    locale: PkLocale = 'en',
    era: 'CE' | 'BE' = 'CE',
  ): string {
    if (value == null || value === '') return '';

    const date = value instanceof Date ? value : new Date(value as string | number);
    if (isNaN(date.getTime())) return '';

    const localeData = getPkLocaleData(locale);
    const day        = date.getDate();
    const monthIndex = date.getMonth(); // 0-based
    const year       = date.getFullYear() + (era === 'BE' ? 543 : 0);

    // Resolve month string based on style
    const monthName =
      style === 'abbr' ? localeData.monthNamesShort[monthIndex] :
      style === 'full' ? localeData.monthNamesFull[monthIndex]  :
      null;

    // Replace tokens longest-first (yyyy|yy|dd|d|mm|m)
    return format.replace(/yyyy|yy|dd|d|mm|m/g, (token) => {
      switch (token) {
        case 'yyyy': return String(year);
        case 'yy':   return String(year % 100).padStart(2, '0');
        case 'dd':   return String(day).padStart(2, '0');
        case 'd':    return String(day);
        case 'mm':   return monthName ?? String(monthIndex + 1).padStart(2, '0');
        case 'm':    return monthName ?? String(monthIndex + 1);
        default:     return token;
      }
    });
  }
}
