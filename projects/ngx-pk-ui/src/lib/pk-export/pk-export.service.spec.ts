import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PkExportService } from './pk-export.service';
import { toCsv, toTsv, toJson, toXml, toHtml, toText } from './pk-export-encoders';
import { toXlsx } from './pk-export-xlsx';

// ─── Encoder unit tests ───────────────────────────────────────────────────────

describe('toCsv', () => {
  const data = [
    { name: 'Alice', age: 30, city: 'New York' },
    { name: 'Bob', age: 25, city: 'Los Angeles' },
  ];

  it('includes a UTF-8 BOM by default', () => {
    expect(toCsv(data).startsWith('\uFEFF')).toBe(true);
  });

  it('omits BOM when bom: false', () => {
    expect(toCsv(data, { bom: false }).startsWith('\uFEFF')).toBe(false);
  });

  it('generates correct header row', () => {
    const lines = toCsv(data, { bom: false }).split('\r\n');
    expect(lines[0]).toBe('name,age,city');
  });

  it('applies custom headers', () => {
    const lines = toCsv(data, {
      bom: false,
      headers: { name: 'Full Name', age: 'Age', city: 'City' },
    }).split('\r\n');
    expect(lines[0]).toBe('Full Name,Age,City');
  });

  it('generates correct data rows', () => {
    const lines = toCsv(data, { bom: false }).split('\r\n');
    expect(lines[1]).toBe('Alice,30,New York');
    expect(lines[2]).toBe('Bob,25,Los Angeles');
  });

  it('quotes values containing the delimiter', () => {
    const d = [{ val: 'hello, world' }];
    const lines = toCsv(d, { bom: false }).split('\r\n');
    expect(lines[1]).toBe('"hello, world"');
  });

  it('escapes double quotes inside values', () => {
    const d = [{ val: 'say "hi"' }];
    const lines = toCsv(d, { bom: false }).split('\r\n');
    expect(lines[1]).toBe('"say ""hi"""');
  });

  it('filters to specified columns', () => {
    const lines = toCsv(data, { bom: false, columns: ['name', 'age'] }).split('\r\n');
    expect(lines[0]).toBe('name,age');
    expect(lines[1]).toBe('Alice,30');
  });

  it('handles empty data (header row only)', () => {
    const lines = toCsv([], { bom: false, columns: ['a', 'b'] }).split('\r\n');
    expect(lines).toHaveLength(1);
    expect(lines[0]).toBe('a,b');
  });

  it('uses custom delimiter', () => {
    const lines = toCsv(data, { bom: false, delimiter: ';' }).split('\r\n');
    expect(lines[0]).toBe('name;age;city');
    expect(lines[1]).toBe('Alice;30;New York');
  });
});

describe('toTsv', () => {
  const data = [{ a: 'x', b: 'y' }];

  it('separates columns with tab', () => {
    const lines = toTsv(data).split('\r\n');
    expect(lines[0]).toBe('a\tb');
    expect(lines[1]).toBe('x\ty');
  });
});

describe('toJson', () => {
  const data = [{ id: 1, name: 'Alice' }];

  it('returns pretty-printed JSON by default', () => {
    const result = toJson(data);
    expect(result).toBe(JSON.stringify(data, null, 2));
  });

  it('respects indent option', () => {
    expect(toJson(data, { indent: 4 })).toBe(JSON.stringify(data, null, 4));
  });

  it('filters to specified columns', () => {
    const result = JSON.parse(toJson(data, { columns: ['id'] }));
    expect(result[0]).toEqual({ id: 1 });
    expect(result[0].name).toBeUndefined();
  });
});

describe('toXml', () => {
  const data = [{ id: 1, name: 'Alice & Bob' }];

  it('wraps output in root and item tags', () => {
    const xml = toXml(data);
    expect(xml).toContain('<root>');
    expect(xml).toContain('<item>');
    expect(xml).toContain('</root>');
  });

  it('uses custom root and item tags', () => {
    const xml = toXml(data, { rootTag: 'users', itemTag: 'user' });
    expect(xml).toContain('<users>');
    expect(xml).toContain('<user>');
  });

  it('escapes & in values', () => {
    expect(toXml(data)).toContain('Alice &amp; Bob');
  });

  it('escapes < and > in values', () => {
    const d = [{ val: '<script>' }];
    const xml = toXml(d);
    expect(xml).toContain('&lt;script&gt;');
    expect(xml).not.toContain('<script>');
  });

  it('starts with XML declaration', () => {
    expect(toXml(data).startsWith('<?xml version="1.0"')).toBe(true);
  });
});

describe('toHtml', () => {
  const data = [{ name: 'Alice', age: 30 }];

  it('contains a <table> element', () => {
    expect(toHtml(data)).toContain('<table>');
  });

  it('contains thead and tbody', () => {
    const html = toHtml(data);
    expect(html).toContain('<thead>');
    expect(html).toContain('<tbody>');
  });

  it('starts with DOCTYPE when standalone: true (default)', () => {
    expect(toHtml(data).startsWith('<!DOCTYPE html>')).toBe(true);
  });

  it('returns only table when standalone: false', () => {
    const html = toHtml(data, { standalone: false });
    expect(html.startsWith('<table>')).toBe(true);
    expect(html).not.toContain('<!DOCTYPE html>');
  });
});

describe('toText', () => {
  const data = [{ a: '1', b: '2' }];

  it('uses tab delimiter by default', () => {
    const lines = toText(data).split('\r\n');
    expect(lines[0]).toBe('a\tb');
    expect(lines[1]).toBe('1\t2');
  });

  it('uses custom delimiter', () => {
    const lines = toText(data, { delimiter: '|' }).split('\r\n');
    expect(lines[0]).toBe('a|b');
  });
});

describe('toXlsx', () => {
  it('returns a Uint8Array', () => {
    const result = toXlsx([{ name: 'Alice', age: 30 }]);
    expect(result).toBeInstanceOf(Uint8Array);
  });

  it('starts with ZIP magic bytes PK\\x03\\x04', () => {
    const result = toXlsx([{ x: 1 }]);
    expect(result[0]).toBe(0x50); // P
    expect(result[1]).toBe(0x4b); // K
    expect(result[2]).toBe(0x03);
    expect(result[3]).toBe(0x04);
  });

  it('handles empty data array', () => {
    const result = toXlsx([]);
    expect(result).toBeInstanceOf(Uint8Array);
    expect(result.length).toBeGreaterThan(0);
  });

  it('handles numeric and string values', () => {
    // Should not throw
    expect(() =>
      toXlsx([
        { label: 'Alice', score: 99.5 },
        { label: 'Bob', score: 87 },
      ])
    ).not.toThrow();
  });

  it('respects custom sheetName and headers', () => {
    const bytes = toXlsx([{ id: 1 }], { sheetName: 'Report', headers: { id: 'ID' } });
    expect(bytes).toBeInstanceOf(Uint8Array);
    // Decode ZIP contents to verify XML contains sheetName
    const text = new TextDecoder().decode(bytes);
    expect(text).toContain('Report');
    expect(text).toContain('ID');
  });
});

// ─── PkExportService integration tests ───────────────────────────────────────

describe('PkExportService', () => {
  let service: PkExportService;
  let createdUrl: string;
  let anchorEl: { href: string; download: string; click: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    service = new PkExportService();

    anchorEl = { href: '', download: '', click: vi.fn() };
    vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
      if (tag === 'a') return anchorEl as unknown as HTMLElement;
      return document.createElement(tag);
    });

    createdUrl = 'blob:mock-url';
    vi.spyOn(URL, 'createObjectURL').mockReturnValue(createdUrl);
    vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});
  });

  it('csv() sets correct filename and clicks the anchor', () => {
    service.csv([{ a: 1 }], 'test.csv');
    expect(anchorEl.download).toBe('test.csv');
    expect(anchorEl.click).toHaveBeenCalled();
  });

  it('json() sets correct filename', () => {
    service.json([{ a: 1 }], 'data.json');
    expect(anchorEl.download).toBe('data.json');
    expect(anchorEl.click).toHaveBeenCalled();
  });

  it('xml() sets correct filename', () => {
    service.xml([{ a: 1 }], 'data.xml');
    expect(anchorEl.download).toBe('data.xml');
    expect(anchorEl.click).toHaveBeenCalled();
  });

  it('tsv() sets correct filename', () => {
    service.tsv([{ a: 1 }], 'data.tsv');
    expect(anchorEl.download).toBe('data.tsv');
    expect(anchorEl.click).toHaveBeenCalled();
  });

  it('text() sets correct filename', () => {
    service.text([{ a: 1 }], 'data.txt');
    expect(anchorEl.download).toBe('data.txt');
    expect(anchorEl.click).toHaveBeenCalled();
  });

  it('html() sets correct filename', () => {
    service.html([{ a: 1 }], 'data.html');
    expect(anchorEl.download).toBe('data.html');
    expect(anchorEl.click).toHaveBeenCalled();
  });

  it('xlsx() sets correct filename', () => {
    service.xlsx([{ a: 1 }], 'data.xlsx');
    expect(anchorEl.download).toBe('data.xlsx');
    expect(anchorEl.click).toHaveBeenCalled();
  });
});
