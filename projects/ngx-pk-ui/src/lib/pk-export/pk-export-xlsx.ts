import { PkXlsxOptions } from './pk-export.model';

// ─── CRC-32 ──────────────────────────────────────────────────────────────────

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[i] = c;
  }
  return table;
})();

function crc32(data: Uint8Array): number {
  let crc = 0xffffffff;
  for (let i = 0; i < data.length; i++) {
    crc = CRC_TABLE[(crc ^ data[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const encoder = new TextEncoder();

function encode(str: string): Uint8Array {
  return encoder.encode(str);
}

function writeUint16LE(view: DataView, offset: number, value: number): void {
  view.setUint16(offset, value, true);
}

function writeUint32LE(view: DataView, offset: number, value: number): void {
  view.setUint32(offset, value, true);
}

function concatBytes(...arrays: Uint8Array[]): Uint8Array {
  const total = arrays.reduce((sum, a) => sum + a.length, 0);
  const out = new Uint8Array(total);
  let offset = 0;
  for (const a of arrays) {
    out.set(a, offset);
    offset += a.length;
  }
  return out;
}

/** Convert 0-based column index to spreadsheet letter(s): 0→A, 25→Z, 26→AA … */
function colLetter(index: number): string {
  let letter = '';
  let n = index;
  do {
    letter = String.fromCharCode(65 + (n % 26)) + letter;
    n = Math.floor(n / 26) - 1;
  } while (n >= 0);
  return letter;
}

function cellRef(col: number, row: number): string {
  return `${colLetter(col)}${row}`;
}

/** Detect whether a value should be stored as a number cell. */
function isNumeric(v: unknown): v is number {
  return typeof v === 'number' && isFinite(v);
}

function cellStr(value: unknown): string {
  if (value === null || value === undefined) return '';
  if (value instanceof Date) return value.toISOString();
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

// ─── SpreadsheetML XML builders ──────────────────────────────────────────────

function buildWorksheetXml(
  data: any[],
  cols: string[],
  headers: Record<string, string>,
  ssMap: Map<string, number>
): string {
  const rows: string[] = [];

  // Header row (row 1)
  const headerCells = cols
    .map((k, ci) => {
      const label = headers[k] ?? k;
      const idx = ssMap.get(label)!;
      return `<c r="${cellRef(ci, 1)}" t="s"><v>${idx}</v></c>`;
    })
    .join('');
  rows.push(`<row r="1">${headerCells}</row>`);

  // Data rows (rows 2+)
  data.forEach((row, ri) => {
    const cells = cols
      .map((k, ci) => {
        const v = row[k];
        if (isNumeric(v)) {
          return `<c r="${cellRef(ci, ri + 2)}"><v>${v}</v></c>`;
        }
        const str = cellStr(v);
        const idx = ssMap.get(str)!;
        return `<c r="${cellRef(ci, ri + 2)}" t="s"><v>${idx}</v></c>`;
      })
      .join('');
    rows.push(`<row r="${ri + 2}">${cells}</row>`);
  });

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <sheetData>${rows.join('')}</sheetData>
</worksheet>`;
}

function buildSharedStringsXml(strings: string[]): string {
  const items = strings
    .map(s => `<si><t xml:space="preserve">${escapeXml(s)}</t></si>`)
    .join('');
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<sst xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" count="${strings.length}" uniqueCount="${strings.length}">${items}</sst>`;
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// ─── ZIP STORE writer ─────────────────────────────────────────────────────────

interface ZipEntry {
  name: Uint8Array;
  data: Uint8Array;
  crc: number;
  offset: number;
}

function makeLocalHeader(entry: ZipEntry): Uint8Array {
  const buf = new ArrayBuffer(30 + entry.name.length);
  const view = new DataView(buf);
  writeUint32LE(view, 0, 0x04034b50); // Local file header signature
  writeUint16LE(view, 4, 20);         // Version needed: 2.0
  writeUint16LE(view, 6, 0);          // General purpose flags
  writeUint16LE(view, 8, 0);          // Compression method: STORE
  writeUint16LE(view, 10, 0);         // Last mod time
  writeUint16LE(view, 12, 0);         // Last mod date
  writeUint32LE(view, 14, entry.crc);
  writeUint32LE(view, 18, entry.data.length); // Compressed size
  writeUint32LE(view, 22, entry.data.length); // Uncompressed size
  writeUint16LE(view, 26, entry.name.length); // Filename length
  writeUint16LE(view, 28, 0);         // Extra field length
  const out = new Uint8Array(buf);
  out.set(entry.name, 30);
  return out;
}

function makeCentralDirEntry(entry: ZipEntry): Uint8Array {
  const buf = new ArrayBuffer(46 + entry.name.length);
  const view = new DataView(buf);
  writeUint32LE(view, 0, 0x02014b50); // Central directory signature
  writeUint16LE(view, 4, 20);         // Version made by
  writeUint16LE(view, 6, 20);         // Version needed
  writeUint16LE(view, 8, 0);          // General purpose flags
  writeUint16LE(view, 10, 0);         // Compression method: STORE
  writeUint16LE(view, 12, 0);         // Last mod time
  writeUint16LE(view, 14, 0);         // Last mod date
  writeUint32LE(view, 16, entry.crc);
  writeUint32LE(view, 20, entry.data.length); // Compressed size
  writeUint32LE(view, 24, entry.data.length); // Uncompressed size
  writeUint16LE(view, 28, entry.name.length); // Filename length
  writeUint16LE(view, 30, 0);         // Extra field length
  writeUint16LE(view, 32, 0);         // File comment length
  writeUint16LE(view, 34, 0);         // Disk number start
  writeUint16LE(view, 36, 0);         // Internal attributes
  writeUint32LE(view, 38, 0);         // External attributes
  writeUint32LE(view, 42, entry.offset); // Relative offset of local header
  const out = new Uint8Array(buf);
  out.set(entry.name, 46);
  return out;
}

function makeEocd(cdOffset: number, cdSize: number, count: number): Uint8Array {
  const buf = new ArrayBuffer(22);
  const view = new DataView(buf);
  writeUint32LE(view, 0, 0x06054b50); // EOCD signature
  writeUint16LE(view, 4, 0);          // Disk number
  writeUint16LE(view, 6, 0);          // Disk with CD start
  writeUint16LE(view, 8, count);      // Entries on this disk
  writeUint16LE(view, 10, count);     // Total entries
  writeUint32LE(view, 12, cdSize);    // CD size
  writeUint32LE(view, 16, cdOffset);  // CD offset
  writeUint16LE(view, 20, 0);         // Comment length
  return new Uint8Array(buf);
}

function packZip(files: Map<string, string>): Uint8Array {
  const entries: ZipEntry[] = [];
  const localParts: Uint8Array[] = [];
  let offset = 0;

  for (const [name, content] of files) {
    const nameBytes = encode(name);
    const data = encode(content);
    const crc = crc32(data);
    const entry: ZipEntry = { name: nameBytes, data, crc, offset };
    entries.push(entry);

    const localHeader = makeLocalHeader(entry);
    localParts.push(localHeader, data);
    offset += localHeader.length + data.length;
  }

  const cdOffset = offset;
  const cdParts = entries.map(e => makeCentralDirEntry(e));
  const cdSize = cdParts.reduce((sum, p) => sum + p.length, 0);
  const eocd = makeEocd(cdOffset, cdSize, entries.length);

  return concatBytes(...localParts, ...cdParts, eocd);
}

// ─── XLSX files ───────────────────────────────────────────────────────────────

const CONTENT_TYPES = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
  <Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
  <Override PartName="/xl/sharedStrings.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sharedStrings+xml"/>
</Types>`;

const ROOT_RELS = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>`;

function buildWorkbookXml(sheetName: string): string {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"
          xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <sheets>
    <sheet name="${escapeXml(sheetName)}" sheetId="1" r:id="rId1"/>
  </sheets>
</workbook>`;
}

const WORKBOOK_RELS = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/sharedStrings" Target="sharedStrings.xml"/>
</Relationships>`;

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Encode an array of objects as a binary XLSX file (Uint8Array).
 * Uses ZIP STORE method — no external dependencies, works in all browsers.
 */
export function toXlsx(data: any[], options?: PkXlsxOptions): Uint8Array {
  const sheetName = options?.sheetName ?? 'Sheet1';

  // Determine columns
  const cols =
    options?.columns && options.columns.length > 0
      ? options.columns
      : data.length > 0
        ? Object.keys(data[0])
        : [];

  const hdrs: Record<string, string> = options?.headers ?? {};

  // Build shared strings table — deduplicate all string values
  const ssArray: string[] = [];
  const ssMap = new Map<string, number>();

  const addString = (s: string): void => {
    if (!ssMap.has(s)) {
      ssMap.set(s, ssArray.length);
      ssArray.push(s);
    }
  };

  // Header labels
  cols.forEach(k => addString(hdrs[k] ?? k));

  // Data cell strings (only non-numeric values go into shared strings)
  data.forEach(row => {
    cols.forEach(k => {
      const v = row[k];
      if (!isNumeric(v)) addString(cellStr(v));
    });
  });

  const worksheetXml = buildWorksheetXml(data, cols, hdrs, ssMap);
  const sharedStringsXml = buildSharedStringsXml(ssArray);

  const files = new Map<string, string>([
    ['[Content_Types].xml', CONTENT_TYPES],
    ['_rels/.rels', ROOT_RELS],
    ['xl/workbook.xml', buildWorkbookXml(sheetName)],
    ['xl/_rels/workbook.xml.rels', WORKBOOK_RELS],
    ['xl/sharedStrings.xml', sharedStringsXml],
    ['xl/worksheets/sheet1.xml', worksheetXml],
  ]);

  return packZip(files);
}
