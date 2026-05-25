export type PkExportFormat = 'csv' | 'tsv' | 'json' | 'xml' | 'text' | 'html' | 'xlsx';

export interface PkCsvOptions {
  /** Fields to include — default: all keys from the first row */
  columns?: string[];
  /** Map field key → display header label */
  headers?: Record<string, string>;
  /** Column delimiter — default ',' */
  delimiter?: string;
  /** Prepend UTF-8 BOM so Excel opens the file with correct encoding — default true */
  bom?: boolean;
}

export interface PkTsvOptions {
  columns?: string[];
  headers?: Record<string, string>;
}

export interface PkJsonOptions {
  /** Pretty-print indent spaces — default 2 */
  indent?: number;
  columns?: string[];
}

export interface PkXmlOptions {
  /** Root element tag name — default 'root' */
  rootTag?: string;
  /** Per-row element tag name — default 'item' */
  itemTag?: string;
  columns?: string[];
}

export interface PkHtmlOptions {
  /** Document title used in <title> and <h2> */
  title?: string;
  columns?: string[];
  headers?: Record<string, string>;
  /** Wrap table in a full <!DOCTYPE html> document — default true */
  standalone?: boolean;
}

export interface PkTextOptions {
  /** Column delimiter — default '\t' */
  delimiter?: string;
  columns?: string[];
  headers?: Record<string, string>;
}

export interface PkXlsxOptions {
  /** Worksheet tab name — default 'Sheet1' */
  sheetName?: string;
  columns?: string[];
  headers?: Record<string, string>;
}

export interface PkExportButtonItem {
  format: PkExportFormat;
  /** Override the label shown in the dropdown (default: uppercase format name) */
  label?: string;
}
