import { TestBed } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { describe, expect, it, beforeEach } from 'vitest';

import { PkTruncatePipe } from './pk-truncate.pipe';
import { PkTimeAgoPipe } from './pk-time-ago.pipe';
import { PkFileSizePipe } from './pk-file-size.pipe';
import { PkNumberPipe } from './pk-number.pipe';
import { PkHighlightPipe } from './pk-highlight.pipe';

// ---------------------------------------------------------------------------
// PkTruncatePipe
// ---------------------------------------------------------------------------

describe('PkTruncatePipe', () => {
  const pipe = new PkTruncatePipe();

  it('returns empty string for null', () => {
    expect(pipe.transform(null)).toBe('');
  });

  it('returns empty string for undefined', () => {
    expect(pipe.transform(undefined)).toBe('');
  });

  it('returns value unchanged when shorter than limit', () => {
    expect(pipe.transform('hello', 10)).toBe('hello');
  });

  it('returns value unchanged when exactly at limit', () => {
    expect(pipe.transform('hello', 5)).toBe('hello');
  });

  it('truncates and appends default ellipsis', () => {
    expect(pipe.transform('hello world', 5)).toBe('hello…');
  });

  it('uses custom ellipsis', () => {
    expect(pipe.transform('hello world', 5, '...')).toBe('hello...');
  });

  it('uses default limit of 100', () => {
    const long = 'a'.repeat(101);
    expect(pipe.transform(long)).toBe('a'.repeat(100) + '…');
  });
});

// ---------------------------------------------------------------------------
// PkTimeAgoPipe
// ---------------------------------------------------------------------------

describe('PkTimeAgoPipe', () => {
  const pipe = new PkTimeAgoPipe();

  function ago(seconds: number): Date {
    return new Date(Date.now() - seconds * 1000);
  }

  it('returns empty string for null', () => {
    expect(pipe.transform(null)).toBe('');
  });

  it('returns empty string for undefined', () => {
    expect(pipe.transform(undefined)).toBe('');
  });

  it('returns empty string for an invalid date string', () => {
    expect(pipe.transform('not-a-date')).toBe('');
  });

  it('returns "just now" for less than 5 seconds', () => {
    expect(pipe.transform(ago(2))).toBe('just now');
  });

  it('returns singular "second" for 1 second', () => {
    expect(pipe.transform(ago(1))).toBe('just now'); // < 5 s
  });

  it('returns seconds ago for 30s', () => {
    expect(pipe.transform(ago(30))).toBe('30 seconds ago');
  });

  it('returns "1 minute ago"', () => {
    expect(pipe.transform(ago(60))).toBe('1 minute ago');
  });

  it('returns minutes ago for 90s', () => {
    expect(pipe.transform(ago(90))).toBe('1 minute ago');
  });

  it('returns "1 hour ago"', () => {
    expect(pipe.transform(ago(3600))).toBe('1 hour ago');
  });

  it('returns "2 hours ago"', () => {
    expect(pipe.transform(ago(7200))).toBe('2 hours ago');
  });

  it('returns "1 day ago"', () => {
    expect(pipe.transform(ago(86400))).toBe('1 day ago');
  });

  it('returns "1 week ago"', () => {
    expect(pipe.transform(ago(7 * 86400))).toBe('1 week ago');
  });

  it('returns "1 month ago"', () => {
    expect(pipe.transform(ago(35 * 86400))).toBe('1 month ago');
  });

  it('returns "1 year ago"', () => {
    expect(pipe.transform(ago(366 * 86400))).toBe('1 year ago');
  });
});

// ---------------------------------------------------------------------------
// PkFileSizePipe
// ---------------------------------------------------------------------------

describe('PkFileSizePipe', () => {
  const pipe = new PkFileSizePipe();

  it('returns empty string for null', () => {
    expect(pipe.transform(null)).toBe('');
  });

  it('returns empty string for undefined', () => {
    expect(pipe.transform(undefined)).toBe('');
  });

  it('returns empty string for NaN', () => {
    expect(pipe.transform(NaN)).toBe('');
  });

  it('returns "0 B" for 0', () => {
    expect(pipe.transform(0)).toBe('0 B');
  });

  it('formats bytes', () => {
    expect(pipe.transform(512)).toBe('512 B');
  });

  it('formats kilobytes', () => {
    expect(pipe.transform(1024)).toBe('1 KB');
  });

  it('formats megabytes with default 1 decimal', () => {
    expect(pipe.transform(1_500_000)).toMatch(/^1\.\d MB$/);
  });

  it('formats with custom decimal places', () => {
    expect(pipe.transform(1024 * 1024, 2)).toBe('1 MB');
  });

  it('formats gigabytes', () => {
    expect(pipe.transform(1024 ** 3)).toBe('1 GB');
  });

  it('formats terabytes', () => {
    expect(pipe.transform(1024 ** 4)).toBe('1 TB');
  });
});

// ---------------------------------------------------------------------------
// PkNumberPipe
// ---------------------------------------------------------------------------
describe('PkNumberPipe', () => {
  const pipe = new PkNumberPipe();

  it('returns empty string for null', () => {
    expect(pipe.transform(null)).toBe('');
  });

  it('returns empty string for undefined', () => {
    expect(pipe.transform(undefined)).toBe('');
  });

  it('returns empty string for NaN', () => {
    expect(pipe.transform(NaN)).toBe('');
  });

  it('returns "0" for 0', () => {
    expect(pipe.transform(0)).toBe('0');
  });

  it('formats kilobytes', () => {
    expect(pipe.transform(1000)).toBe('1 K');
  });

  it('formats megabytes with default 1 decimal', () => {
    expect(pipe.transform(1_500_000)).toMatch(/^1\.\dM$/);
  });

  it('formats with custom decimal places', () => {
    expect(pipe.transform(1000 * 1000, 2)).toBe('1M');
  });

  it('formats gigabytes', () => {
    expect(pipe.transform(1000 ** 3)).toBe('1G');
  });

  it('formats terabytes', () => {
    expect(pipe.transform(1000 ** 4)).toBe('1T');
  });
});

// ---------------------------------------------------------------------------
// PkHighlightPipe
// ---------------------------------------------------------------------------

describe('PkHighlightPipe', () => {
  let pipe: PkHighlightPipe;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [BrowserModule] });
    pipe = TestBed.runInInjectionContext(() => new PkHighlightPipe());
  });

  function html(result: ReturnType<PkHighlightPipe['transform']>): string {
    // SafeHtml from bypassSecurityTrustHtml wraps value in an object
    if (typeof result === 'string') return result;
    return (result as unknown as { changingThisBreaksApplicationSecurity: string })
      .changingThisBreaksApplicationSecurity ?? String(result);
  }

  it('returns empty string for null value', () => {
    expect(html(pipe.transform(null, 'x'))).toBe('');
  });

  it('returns plain escaped text when search is empty', () => {
    const r = html(pipe.transform('hello', ''));
    expect(r).toContain('hello');
  });

  it('wraps a match in <mark>', () => {
    const r = html(pipe.transform('hello world', 'world'));
    expect(r).toContain('<mark class="pk-highlight">world</mark>');
  });

  it('is case-insensitive', () => {
    const r = html(pipe.transform('Hello World', 'world'));
    expect(r).toContain('<mark class="pk-highlight">World</mark>');
  });

  it('escapes HTML special chars in value to prevent XSS', () => {
    const r = html(pipe.transform('<script>alert(1)</script>', 'alert'));
    expect(r).not.toContain('<script>');
    expect(r).toContain('&lt;script&gt;');
  });

  it('escapes regex special chars in search term', () => {
    const r = html(pipe.transform('price: 1.00', '1.00'));
    expect(r).toContain('<mark class="pk-highlight">1.00</mark>');
  });

  it('highlights all occurrences', () => {
    const r = html(pipe.transform('cat and cat', 'cat'));
    const count = (r.match(/<mark/g) ?? []).length;
    expect(count).toBe(2);
  });
});
