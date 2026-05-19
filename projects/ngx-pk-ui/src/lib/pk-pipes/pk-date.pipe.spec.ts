import { describe, it, expect } from 'vitest';
import { PkDatePipe, parseBEDate } from './pk-date.pipe';

describe('PkDatePipe', () => {
  const pipe = new PkDatePipe();

  // ── Reference date: January 31, 2025 ──────────────────────────────────────
  // CE: 31 Jan 2025  |  BE: 31 มค. 2568 (2025 + 543 = 2568)
  const jan31_2025 = new Date(2025, 0, 31); // month 0 = January

  // ── numeric style ─────────────────────────────────────────────────────────
  describe('numeric style (default)', () => {
    it('formats d/m/yyyy', () => {
      expect(pipe.transform(jan31_2025, 'd/m/yyyy')).toBe('31/1/2025');
    });

    it('formats dd/mm/yyyy (padded)', () => {
      expect(pipe.transform(jan31_2025, 'dd/mm/yyyy', 'numeric')).toBe('31/01/2025');
    });

    it('formats dd-mm-yy (padded, 2-digit year)', () => {
      expect(pipe.transform(jan31_2025, 'dd-mm-yy', 'numeric')).toBe('31-01-25');
    });

    it('formats yyyy/mm/dd', () => {
      expect(pipe.transform(jan31_2025, 'yyyy/mm/dd', 'numeric')).toBe('2025/01/31');
    });

    it('formats m d yyyy (spaces)', () => {
      expect(pipe.transform(jan31_2025, 'm d yyyy')).toBe('1 31 2025');
    });

    it('uses a month with single digit correctly', () => {
      const mar5 = new Date(2025, 2, 5); // March 5
      expect(pipe.transform(mar5, 'd/m/yyyy')).toBe('5/3/2025');
      expect(pipe.transform(mar5, 'dd/mm/yyyy')).toBe('05/03/2025');
    });

    it('formats December correctly (double-digit month)', () => {
      const dec15 = new Date(2025, 11, 15); // December 15
      expect(pipe.transform(dec15, 'd/m/yyyy')).toBe('15/12/2025');
      expect(pipe.transform(dec15, 'dd/mm/yyyy')).toBe('15/12/2025');
    });

    it('accepts a timestamp (number)', () => {
      expect(pipe.transform(jan31_2025.getTime(), 'yyyy/mm/dd')).toBe('2025/01/31');
    });

    it('accepts an ISO string', () => {
      expect(pipe.transform('2025-01-31T00:00:00', 'd/m/yyyy')).toBe('31/1/2025');
    });
  });

  // ── abbr style ────────────────────────────────────────────────────────────
  describe('abbr style', () => {
    it('formats d m yyyy abbr en', () => {
      expect(pipe.transform(jan31_2025, 'd m yyyy', 'abbr', 'en')).toBe('31 Jan 2025');
    });

    it('formats d-m-yyyy abbr es', () => {
      expect(pipe.transform(jan31_2025, 'd-m-yyyy', 'abbr', 'es')).toBe('31-Ene-2025');
    });

    it('formats d m yyyy abbr th CE', () => {
      expect(pipe.transform(jan31_2025, 'd m yyyy', 'abbr', 'th')).toBe('31 ม.ค. 2025');
    });

    it('formats d m yyyy abbr th BE', () => {
      expect(pipe.transform(jan31_2025, 'd m yyyy', 'abbr', 'th', 'BE')).toBe('31 ม.ค. 2568');
    });

    it('formats d m yy abbr th BE (2-digit BE year)', () => {
      expect(pipe.transform(jan31_2025, 'd m yy', 'abbr', 'th', 'BE')).toBe('31 ม.ค. 68');
    });

    it('mm token in abbr style renders locale name (no padding)', () => {
      expect(pipe.transform(jan31_2025, 'dd/mm/yyyy', 'abbr', 'en')).toBe('31/Jan/2025');
    });

    it('formats with fr locale', () => {
      expect(pipe.transform(jan31_2025, 'd m yyyy', 'abbr', 'fr')).toBe('31 Jan 2025');
    });

    it('formats with de locale', () => {
      const mar1 = new Date(2025, 2, 1); // March
      expect(pipe.transform(mar1, 'd m yyyy', 'abbr', 'de')).toBe('1 Mär 2025');
    });

    it('formats with ar locale (Arabic abbreviations)', () => {
      expect(pipe.transform(jan31_2025, 'd m yyyy', 'abbr', 'ar')).toBe('31 ينا 2025');
    });

    it('formats lo locale', () => {
      expect(pipe.transform(jan31_2025, 'd/m/yyyy', 'abbr', 'lo')).toBe('31/ມ.ກ./2025');
    });
  });

  // ── full style ────────────────────────────────────────────────────────────
  describe('full style', () => {
    it('formats m, d yyyy full it', () => {
      expect(pipe.transform(jan31_2025, 'm, d yyyy', 'full', 'it')).toBe('Gennaio, 31 2025');
    });

    it('formats d m yyyy full en', () => {
      expect(pipe.transform(jan31_2025, 'd m yyyy', 'full', 'en')).toBe('31 January 2025');
    });

    it('formats d m yyyy full th BE', () => {
      expect(pipe.transform(jan31_2025, 'd m yyyy', 'full', 'th', 'BE')).toBe('31 มกราคม 2568');
    });

    it('formats d m yyyy full de', () => {
      const jun10 = new Date(2025, 5, 10); // June
      expect(pipe.transform(jun10, 'd m yyyy', 'full', 'de')).toBe('10 Juni 2025');
    });

    it('formats d m yyyy full ar (Arabic)', () => {
      expect(pipe.transform(jan31_2025, 'd m yyyy', 'full', 'ar')).toBe('31 يناير 2025');
    });

    it('formats d m yyyy full zh', () => {
      expect(pipe.transform(jan31_2025, 'd m yyyy', 'full', 'zh')).toBe('31 一月 2025');
    });
  });

  // ── Buddhist Era output ───────────────────────────────────────────────────
  describe('era = BE', () => {
    it('adds 543 to full year', () => {
      expect(pipe.transform(new Date(2026, 4, 19), 'd/m/yyyy', 'numeric', 'en', 'BE')).toBe('19/5/2569');
    });

    it('yy with BE wraps to 2 digits (padded)', () => {
      const yr2000 = new Date(2000, 0, 1); // BE = 2543
      expect(pipe.transform(yr2000, 'd/m/yy', 'numeric', 'en', 'BE')).toBe('1/1/43');
    });

    it('yy BE less than 10 is padded', () => {
      const yr1960 = new Date(1960, 0, 1); // BE = 2503
      expect(pipe.transform(yr1960, 'yy', 'numeric', 'en', 'BE')).toBe('03');
    });
  });

  // ── edge cases ────────────────────────────────────────────────────────────
  describe('edge cases', () => {
    it('returns empty string for null', () => {
      expect(pipe.transform(null, 'd/m/yyyy')).toBe('');
    });

    it('returns empty string for undefined', () => {
      expect(pipe.transform(undefined, 'd/m/yyyy')).toBe('');
    });

    it('returns empty string for empty string', () => {
      expect(pipe.transform('', 'd/m/yyyy')).toBe('');
    });

    it('returns empty string for invalid date string', () => {
      expect(pipe.transform('not-a-date', 'd/m/yyyy')).toBe('');
    });

    it('preserves literal text in format', () => {
      expect(pipe.transform(jan31_2025, 'yyyy年mm月dd日', 'numeric', 'zh')).toBe('2025年01月31日');
    });

    it('format with no separators', () => {
      expect(pipe.transform(jan31_2025, 'ddmmyyyy')).toBe('31012025');
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('parseBEDate', () => {
  it('parses standard 31/01/2568 → CE Date(2025, 0, 31)', () => {
    const d = parseBEDate('31/01/2568');
    expect(d.getFullYear()).toBe(2025);
    expect(d.getMonth()).toBe(0);
    expect(d.getDate()).toBe(31);
  });

  it('parses with dash separator', () => {
    const d = parseBEDate('31-01-2568', '-');
    expect(d.getFullYear()).toBe(2025);
    expect(d.getMonth()).toBe(0);
    expect(d.getDate()).toBe(31);
  });

  it('parses mdy order', () => {
    const d = parseBEDate('01/31/2568', '/', 'mdy');
    expect(d.getFullYear()).toBe(2025);
    expect(d.getMonth()).toBe(0);
    expect(d.getDate()).toBe(31);
  });

  it('parses ymd order', () => {
    const d = parseBEDate('2568/01/31', '/', 'ymd');
    expect(d.getFullYear()).toBe(2025);
    expect(d.getMonth()).toBe(0);
    expect(d.getDate()).toBe(31);
  });

  it('round-trips: parseBEDate then pkDate with BE gives back original string', () => {
    const pipe = new PkDatePipe();
    const date = parseBEDate('31/01/2568');
    expect(pipe.transform(date, 'dd/mm/yyyy', 'numeric', 'en', 'BE')).toBe('31/01/2568');
  });

  it('parseBEDate → pkDate abbr th BE', () => {
    const pipe = new PkDatePipe();
    const date = parseBEDate('31/01/2568');
    expect(pipe.transform(date, 'd m yyyy', 'abbr', 'th', 'BE')).toBe('31 ม.ค. 2568');
  });
});
