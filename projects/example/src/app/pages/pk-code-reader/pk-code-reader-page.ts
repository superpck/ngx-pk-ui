import { Component, signal } from '@angular/core';
import { PkCodeReader } from 'ngx-pk-ui';
import type { PkCodeFormat, PkCodeScanResult, PkCodeReaderError } from 'ngx-pk-ui';

@Component({
  selector: 'app-pk-code-reader-page',
  standalone: true,
  imports: [PkCodeReader],
  templateUrl: './pk-code-reader-page.html',
  styleUrl: './pk-code-reader-page.css',
})
export class PkCodeReaderPage {
  continuous    = signal(false);
  beep          = signal(false);
  showOverlay   = signal(true);
  showHighlight = signal(true);

  lastScan      = signal<PkCodeScanResult | null>(null);
  lastError     = signal<PkCodeReaderError | null>(null);
  supported     = signal<PkCodeFormat[]>([]);
  scanCount     = signal(0);

  onScan(result: PkCodeScanResult): void {
    this.lastScan.set(result);
    this.lastError.set(null);
    this.scanCount.update(n => n + 1);
  }

  clearLastScan(): void {
    this.lastScan.set(null);
    this.lastError.set(null);
    this.scanCount.set(0);
  }

  onError(err: PkCodeReaderError): void {
    this.lastError.set(err);
  }

  onSupportedFormats(formats: PkCodeFormat[]): void {
    this.supported.set(formats);
  }

  readonly code1 = `import { PkCodeReader } from 'ngx-pk-ui';
import type { PkCodeScanResult } from 'ngx-pk-ui';

@Component({
  imports: [PkCodeReader],
})
export class MyComponent {
  onScan(result: PkCodeScanResult) {
    console.log(result.value, result.format, result.source);
  }
}`;

  readonly code2 = `<!-- Basic usage — camera only -->
<pk-code-reader (scan)="onScan($event)" />

<!-- Custom formats -->
<pk-code-reader
  [formats]="['qr_code', 'ean_13']"
  [continuous]="true"
  [beep]="true"
  (scan)="onScan($event)"
  (error)="onError($event)"
  (supportedFormats)="onSupported($event)"
/>`;

  readonly code3 = `// PkCodeScanResult
interface PkCodeScanResult {
  value: string;
  format: PkCodeFormat;
  source: 'camera' | 'upload' | 'paste';
  boundingBox?: DOMRectReadOnly;
  cornerPoints?: ReadonlyArray<{ x: number; y: number }>;
}`;
}
