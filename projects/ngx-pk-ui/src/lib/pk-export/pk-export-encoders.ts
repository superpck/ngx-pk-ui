import {
  PkCsvOptions,
  PkHtmlOptions,
  PkJsonOptions,
  PkTextOptions,
  PkTsvOptions,
  PkXmlOptions,
} from './pk-export.model';

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Extract ordered column keys from options or the first row of data. */
function getColumns(data: any[], columns?: string[]): string[] {
  if (columns && columns.length > 0) return columns;
  if (data.length === 0) return [];
  return Object.keys(data[0]);
}

/** Resolve display header for a field key. */
function getHeader(key: string, headers?: Record<string, string>): string {
  return headers?.[key] ?? key;
}

/** Stringify a cell value to a plain string. */
function cellString(value: unknown): string {
  if (value === null || value === undefined) return '';
  if (value instanceof Date) return value.toISOString();
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

/** Escape a value for XML text content. */
function xmlEscape(value: unknown): string {
  return cellString(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/** Sanitize a string for use as an XML tag name. */
function xmlTag(name: string): string {
  // Replace spaces/special chars with underscores; ensure starts with letter or _
  const safe = name.replace(/[^a-zA-Z0-9_.-]/g, '_');
  return /^[a-zA-Z_]/.test(safe) ? safe : `_${safe}`;
}

// ─── CSV ────────────────────────────────────────────────────────────────────

/**
 * Convert an array of objects to a CSV string.
 * Includes UTF-8 BOM by default so Excel opens the file with correct encoding.
 */
export function toCsv(data: any[], options?: PkCsvOptions): string {
  const delimiter = options?.delimiter ?? ',';
  const bom = options?.bom !== false;
  const cols = getColumns(data, options?.columns);

  const escapeCell = (value: unknown): string => {
    const str = cellString(value);
    const needsQuotes =
      str.includes(delimiter) || str.includes('"') || str.includes('\n') || str.includes('\r');
    if (!needsQuotes) return str;
    return `"${str.replace(/"/g, '""')}"`;
  };

  const headerRow = cols.map(k => escapeCell(getHeader(k, options?.headers))).join(delimiter);
  const dataRows = data.map(row => cols.map(k => escapeCell(row[k])).join(delimiter));

  const csv = [headerRow, ...dataRows].join('\r\n');
  return bom ? '\uFEFF' + csv : csv;
}

// ─── TSV ────────────────────────────────────────────────────────────────────

/**
 * Convert an array of objects to a TSV (tab-separated values) string.
 */
export function toTsv(data: any[], options?: PkTsvOptions): string {
  const cols = getColumns(data, options?.columns);

  const headerRow = cols.map(k => getHeader(k, options?.headers)).join('\t');
  const dataRows = data.map(row => cols.map(k => cellString(row[k])).join('\t'));

  return [headerRow, ...dataRows].join('\r\n');
}

// ─── JSON ────────────────────────────────────────────────────────────────────

/**
 * Convert an array of objects to a formatted JSON string.
 */
export function toJson(data: any[], options?: PkJsonOptions): string {
  const indent = options?.indent ?? 2;
  if (!options?.columns) return JSON.stringify(data, null, indent);

  const cols = options.columns;
  const filtered = data.map(row => {
    const obj: Record<string, unknown> = {};
    cols.forEach(k => { obj[k] = row[k]; });
    return obj;
  });
  return JSON.stringify(filtered, null, indent);
}

// ─── XML ─────────────────────────────────────────────────────────────────────

/**
 * Convert an array of objects to an XML string.
 */
export function toXml(data: any[], options?: PkXmlOptions): string {
  const rootTag = xmlTag(options?.rootTag ?? 'root');
  const itemTag = xmlTag(options?.itemTag ?? 'item');
  const cols = getColumns(data, options?.columns);

  const rows = data.map(row => {
    const children = cols
      .map(k => `    <${xmlTag(k)}>${xmlEscape(row[k])}</${xmlTag(k)}>`)
      .join('\n');
    return `  <${itemTag}>\n${children}\n  </${itemTag}>`;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>\n<${rootTag}>\n${rows.join('\n')}\n</${rootTag}>`;
}

// ─── HTML ─────────────────────────────────────────────────────────────────────

/**
 * Convert an array of objects to an HTML table string.
 * By default wraps in a full self-contained <!DOCTYPE html> document.
 */
export function toHtml(data: any[], options?: PkHtmlOptions): string {
  const cols = getColumns(data, options?.columns);
  const title = options?.title ?? 'Export';
  const standalone = options?.standalone !== false;

  const thCells = cols
    .map(k => `<th>${getHeader(k, options?.headers)}</th>`)
    .join('');

  const trRows = data
    .map(row => {
      const tds = cols.map(k => `<td>${cellString(row[k])}</td>`).join('');
      return `<tr>${tds}</tr>`;
    })
    .join('\n      ');

  const table = `<table>
    <thead><tr>${thCells}</tr></thead>
    <tbody>
      ${trRows}
    </tbody>
  </table>`;

  if (!standalone) return table;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <style>
    body { font-family: system-ui, sans-serif; padding: 24px; color: #1e293b; }
    h2 { margin-bottom: 16px; }
    table { border-collapse: collapse; width: 100%; font-size: 14px; }
    th { background: #1976d2; color: #fff; padding: 8px 12px; text-align: left; }
    td { padding: 7px 12px; border-bottom: 1px solid #e2e8f0; }
    tr:hover td { background: #f8fafc; }
  </style>
</head>
<body>
  <h2>${title}</h2>
  ${table}
</body>
</html>`;
}

// ─── Text ─────────────────────────────────────────────────────────────────────

/**
 * Convert an array of objects to a plain delimited text string (default: tab).
 */
export function toText(data: any[], options?: PkTextOptions): string {
  const delimiter = options?.delimiter ?? '\t';
  const cols = getColumns(data, options?.columns);

  const headerRow = cols.map(k => getHeader(k, options?.headers)).join(delimiter);
  const dataRows = data.map(row => cols.map(k => cellString(row[k])).join(delimiter));

  return [headerRow, ...dataRows].join('\r\n');
}
