import { Injectable } from '@angular/core';
import {
  PkCsvOptions,
  PkHtmlOptions,
  PkJsonOptions,
  PkTextOptions,
  PkTsvOptions,
  PkXlsxOptions,
  PkXmlOptions,
} from './pk-export.model';
import { toCsv, toHtml, toJson, toText, toTsv, toXml } from './pk-export-encoders';
import { toXlsx } from './pk-export-xlsx';
import { downloadFile } from './pk-export-download';

@Injectable({ providedIn: 'root' })
export class PkExportService {
  /** Export data as CSV and trigger a browser download. */
  csv(data: any[], filename = 'export.csv', options?: PkCsvOptions): void {
    downloadFile(toCsv(data, options), filename, 'text/csv;charset=utf-8');
  }

  /** Export data as TSV and trigger a browser download. */
  tsv(data: any[], filename = 'export.tsv', options?: PkTsvOptions): void {
    downloadFile(toTsv(data, options), filename, 'text/tab-separated-values;charset=utf-8');
  }

  /** Export data as JSON and trigger a browser download. */
  json(data: any[], filename = 'export.json', options?: PkJsonOptions): void {
    downloadFile(toJson(data, options), filename, 'application/json;charset=utf-8');
  }

  /** Export data as XML and trigger a browser download. */
  xml(data: any[], filename = 'export.xml', options?: PkXmlOptions): void {
    downloadFile(toXml(data, options), filename, 'application/xml;charset=utf-8');
  }

  /** Export data as plain text and trigger a browser download. */
  text(data: any[], filename = 'export.txt', options?: PkTextOptions): void {
    downloadFile(toText(data, options), filename, 'text/plain;charset=utf-8');
  }

  /** Export data as a self-contained HTML document and trigger a browser download. */
  html(data: any[], filename = 'export.html', options?: PkHtmlOptions): void {
    downloadFile(toHtml(data, options), filename, 'text/html;charset=utf-8');
  }

  /** Export data as an XLSX file (basic, no styling) and trigger a browser download. */
  xlsx(data: any[], filename = 'export.xlsx', options?: PkXlsxOptions): void {
    downloadFile(
      toXlsx(data, options),
      filename,
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
  }
}
