import {
  Component,
  HostListener,
  inject,
  input,
  output,
  signal,
  ChangeDetectionStrategy
} from '@angular/core';
import { NgStyle } from '@angular/common';
import { PkExportFormat, PkCsvOptions, PkJsonOptions, PkXlsxOptions, PkXmlOptions, PkTextOptions, PkHtmlOptions, PkTsvOptions } from './pk-export.model';
import { PkExportService } from './pk-export.service';

@Component({
  selector: 'pk-export-button',
  standalone: true,
  imports: [NgStyle],
  templateUrl: './pk-export-button.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './pk-export-button.css',
})
export class PkExportButton {
  data          = input.required<any[]>();
  formats       = input<PkExportFormat[]>(['csv', 'xlsx', 'json']);
  filename      = input<string>('export');
  label         = input<string>('Export');
  disabled      = input<boolean>(false);
  customClass   = input<string>('');
  customStyle   = input<Record<string, string>>({});
  csvOptions    = input<PkCsvOptions | undefined>(undefined);
  tsvOptions    = input<PkTsvOptions | undefined>(undefined);
  jsonOptions   = input<PkJsonOptions | undefined>(undefined);
  xmlOptions    = input<PkXmlOptions | undefined>(undefined);
  xlsxOptions   = input<PkXlsxOptions | undefined>(undefined);
  htmlOptions   = input<PkHtmlOptions | undefined>(undefined);
  textOptions   = input<PkTextOptions | undefined>(undefined);

  beforeExport = output<PkExportFormat>();
  afterExport  = output<PkExportFormat>();

  isOpen = signal(false);

  private readonly svc = inject(PkExportService);

  toggleDropdown(event: Event): void {
    event.stopPropagation();
    if (!this.disabled()) this.isOpen.update(v => !v);
  }

  doExport(format: PkExportFormat): void {
    this.isOpen.set(false);
    this.beforeExport.emit(format);

    const data = this.data();
    const name = this.filename();

    switch (format) {
      case 'csv':   this.svc.csv(data,  `${name}.csv`,  this.csvOptions());  break;
      case 'tsv':   this.svc.tsv(data,  `${name}.tsv`,  this.tsvOptions());  break;
      case 'json':  this.svc.json(data, `${name}.json`, this.jsonOptions()); break;
      case 'xml':   this.svc.xml(data,  `${name}.xml`,  this.xmlOptions());  break;
      case 'xlsx':  this.svc.xlsx(data, `${name}.xlsx`, this.xlsxOptions()); break;
      case 'html':  this.svc.html(data, `${name}.html`, this.htmlOptions()); break;
      case 'text':  this.svc.text(data, `${name}.txt`,  this.textOptions()); break;
    }

    this.afterExport.emit(format);
  }

  getFormatLabel(format: PkExportFormat): string {
    const labels: Record<PkExportFormat, string> = {
      csv:  'CSV',
      tsv:  'TSV',
      json: 'JSON',
      xml:  'XML',
      xlsx: 'Excel (XLSX)',
      html: 'HTML',
      text: 'Text',
    };
    return labels[format];
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.isOpen.set(false);
  }
}
