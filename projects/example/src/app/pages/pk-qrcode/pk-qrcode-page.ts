import { Component, signal, viewChild } from '@angular/core';
import { PkQrcode } from 'ngx-pk-ui';
import type { PkQrEcLevel } from 'ngx-pk-ui';

@Component({
  selector: 'pk-qrcode-page',
  standalone: true,
  imports: [PkQrcode],
  templateUrl: './pk-qrcode-page.html',
  styleUrl: './pk-qrcode-page.css',
})
export class PkQrcodePage {
  readonly qr = viewChild<PkQrcode>('qr');

  value      = signal('https://github.com/superpck/ngx-pk-ui');
  ecLevel    = signal<PkQrEcLevel>('M');
  size       = signal(220);
  darkColor  = signal('#000000');
  lightColor = signal('#ffffff');
  logo       = signal('');
  logoSize   = signal(0.25);
  margin     = signal(4);

  readonly ecLevels: { id: PkQrEcLevel; label: string; desc: string }[] = [
    { id: 'L', label: 'L', desc: '7%' },
    { id: 'M', label: 'M', desc: '15%' },
    { id: 'Q', label: 'Q', desc: '25%' },
    { id: 'H', label: 'H', desc: '30%' },
  ];

  downloadSvg(): void { this.qr()?.downloadSvg(); }
  downloadPng(): void { this.qr()?.downloadPng(); }

  readonly code1 = `import { PkQrcode } from 'ngx-pk-ui';

@Component({
  imports: [PkQrcode],
})`;
  readonly code2 = `<!-- Basic -->
<pk-qrcode value="https://example.com" />

<!-- Custom EC level, size, colors -->
<pk-qrcode
  value="Hello World"
  ecLevel="H"
  [size]="300"
  darkColor="#1d4ed8"
  lightColor="#eff6ff"
/>

<!-- With center logo (auto-upgrades ECL to Q minimum) -->
<pk-qrcode
  value="https://example.com"
  logo="assets/logo.svg"
  [logoSize]="0.25"
/>`;
}
