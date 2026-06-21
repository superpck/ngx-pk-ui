import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import {
  PkExportButton,
  PkExportService,
  PkToastrService,
} from 'ngx-pk-ui';
import type { PkExportFormat } from 'ngx-pk-ui';

interface DemoRow {
  id: number;
  name: string;
  department: string;
  salary: number;
  active: boolean;
  joinDate: string;
}

@Component({
  selector: 'app-pk-export-page',
  standalone: true,
  imports: [PkExportButton, DecimalPipe],
  templateUrl: './pk-export-page.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './pk-export-page.css',
})
export class PkExportPage {
  private toastr = inject(PkToastrService);
  private svc    = inject(PkExportService);

  lastExport = signal<string>('—');

  readonly rows: DemoRow[] = [
    { id: 1, name: 'Alice Johnson',  department: 'Engineering', salary: 95000, active: true,  joinDate: '2021-03-15' },
    { id: 2, name: 'Bob Smith',      department: 'Marketing',   salary: 72000, active: true,  joinDate: '2020-07-01' },
    { id: 3, name: 'Carol Davis',    department: 'Engineering', salary: 88000, active: false, joinDate: '2019-11-20' },
    { id: 4, name: 'David Lee',      department: 'Design',      salary: 80000, active: true,  joinDate: '2022-01-10' },
    { id: 5, name: 'Eva Martinez',   department: 'HR',          salary: 67000, active: true,  joinDate: '2023-05-03' },
    { id: 6, name: 'Frank Wilson',   department: 'Finance',     salary: 91000, active: false, joinDate: '2018-09-14' },
    { id: 7, name: 'Grace Chen',     department: 'Engineering', salary: 98000, active: true,  joinDate: '2022-08-22' },
    { id: 8, name: 'Henry Brown',    department: 'Marketing',   salary: 76000, active: true,  joinDate: '2021-12-01' },
  ];

  readonly allFormats: PkExportFormat[] = ['csv', 'tsv', 'json', 'xml', 'xlsx', 'html', 'text'];

  readonly customHeaders = { id: 'ID', name: 'Full Name', department: 'Department', salary: 'Salary (USD)', active: 'Active', joinDate: 'Join Date' };

  onBeforeExport(fmt: PkExportFormat): void {
    this.lastExport.set(fmt.toUpperCase());
    this.toastr.success(`Exported as ${fmt.toUpperCase()}`, 'Export');
  }

  exportCsv():  void { this.svc.csv(this.rows,  'employees.csv',  { headers: this.customHeaders }); }
  exportTsv():  void { this.svc.tsv(this.rows,  'employees.tsv',  { headers: this.customHeaders }); }
  exportJson(): void { this.svc.json(this.rows, 'employees.json'); }
  exportXml():  void { this.svc.xml(this.rows,  'employees.xml',  { rootTag: 'employees', itemTag: 'employee' }); }
  exportXlsx(): void { this.svc.xlsx(this.rows, 'employees.xlsx', { headers: this.customHeaders }); }
  exportHtml(): void { this.svc.html(this.rows, 'employees.html', { title: 'Employee List', headers: this.customHeaders }); }
  exportText(): void { this.svc.text(this.rows, 'employees.txt',  { headers: this.customHeaders }); }

  // Code snippet strings
  readonly codeService = `// Inject the service
export class MyComponent {
  private svc = inject(PkExportService);

  exportCsv() {
    this.svc.csv(this.rows, 'report.csv', {
      headers: { name: 'Full Name', salary: 'Salary (USD)' },
    });
  }

  exportXlsx() { this.svc.xlsx(this.rows, 'report.xlsx'); }
  exportJson() { this.svc.json(this.rows, 'report.json', { indent: 4 }); }
  exportXml()  { this.svc.xml(this.rows,  'report.xml',  { rootTag: 'users', itemTag: 'user' }); }
}`;

  readonly codeButton = `<pk-export-button
  [data]="rows"
  [formats]="['csv', 'xlsx', 'json', 'xml']"
  filename="report"
  label="Export"
  [csvOptions]="{ headers: { name: 'Full Name' } }"
  (beforeExport)="onBeforeExport($event)"
/>`;

  readonly codeEncoders = `import { toCsv, toXlsx, downloadFile } from 'ngx-pk-ui';

// Use encoder directly (for preview, server upload, etc.)
const csvString = toCsv(rows, { bom: true });
const xlsxBytes = toXlsx(rows, { sheetName: 'Report' });

// Download manually
downloadFile(xlsxBytes, 'report.xlsx',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');`;
}
