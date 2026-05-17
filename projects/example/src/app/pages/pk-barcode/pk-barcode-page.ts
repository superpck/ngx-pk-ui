import { Component, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PkBarcode } from 'ngx-pk-ui';
import type { PkBarcodeFormat } from 'ngx-pk-ui';

@Component({
  selector: 'pk-barcode-page',
  standalone: true,
  imports: [PkBarcode, FormsModule],
  templateUrl: './pk-barcode-page.html',
  styleUrl: './pk-barcode-page.css',
})
export class PkBarcodePage {
  readonly barcode = viewChild<PkBarcode>('bc');

  format      = signal<PkBarcodeFormat>('code128');
  value       = signal('Hello World');
  lineColor   = signal('#000000');
  bgColor     = signal('#ffffff');
  showText    = signal(true);
  barHeight   = signal(60);
  moduleWidth = signal(2);

  readonly formats: { id: PkBarcodeFormat; label: string; placeholder: string }[] = [
    { id: 'code128', label: 'Code 128', placeholder: 'Any printable ASCII, e.g. Hello World' },
    { id: 'code39',  label: 'Code 39',  placeholder: 'Uppercase + digits, e.g. HELLO123' },
    { id: 'ean13',   label: 'EAN-13',   placeholder: '12-13 digits, e.g. 5901234123457' },
    { id: 'ean8',    label: 'EAN-8',    placeholder: '7-8 digits, e.g. 96385074' },
  ];

  get currentPlaceholder(): string {
    return this.formats.find(f => f.id === this.format())?.placeholder ?? '';
  }

  onFormatChange(f: PkBarcodeFormat): void {
    this.format.set(f);
    const defaults: Record<PkBarcodeFormat, string> = {
      code128: 'Hello World',
      code39:  'HELLO123',
      ean13:   '5901234123457',
      ean8:    '96385074',
    };
    this.value.set(defaults[f]);
  }

  downloadSvg(): void { this.barcode()?.downloadSvg(); }
  downloadPng(): void { this.barcode()?.downloadPng(); }

  readonly code1 = `import { PkBarcode } from 'ngx-pk-ui';

@Component({
  imports: [PkBarcode],
})`;
  readonly code2 = `<!-- Code 128 (default) -->
<pk-barcode value="Hello World" />

<!-- EAN-13 -->
<pk-barcode value="5901234123457" format="ean13" />

<!-- Custom colors & height -->
<pk-barcode
  value="ITEM-001"
  format="code39"
  lineColor="#1d4ed8"
  bgColor="#eff6ff"
  [barHeight]="80"
  [showText]="true"
/>`;
}
