import {
  Component, computed, input, viewChild, ElementRef, PLATFORM_ID, inject,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import type { PkQrEcLevel } from './pk-qrcode.model';
import { encodeQr } from './pk-qrcode-encoder';

@Component({
  selector: 'pk-qrcode',
  standalone: true,
  imports: [],
  templateUrl: './pk-qrcode.html',
  styleUrl: './pk-qrcode.css',
})
export class PkQrcode {
  private platformId = inject(PLATFORM_ID);

  value      = input.required<string>();
  ecLevel    = input<PkQrEcLevel>('M');
  size       = input<number>(200);
  darkColor  = input<string>('#000000');
  lightColor = input<string>('#ffffff');
  logo       = input<string | null>(null);
  /** Logo size as fraction of QR size (0.1–0.3); clamped automatically */
  logoSize   = input<number>(0.25);
  /** Quiet zone in modules */
  margin     = input<number>(4);

  readonly svgEl = viewChild<ElementRef<SVGSVGElement>>('svgEl');

  readonly _effectiveEcLevel = computed<PkQrEcLevel>(() => {
    const lvl = this.ecLevel();
    // With logo covering ~6% center, need at least Q (25% recovery)
    if (this.logo() && (lvl === 'L' || lvl === 'M')) return 'Q';
    return lvl;
  });

  readonly _error = computed<string | null>(() => {
    if (!this.value()) return 'value must not be empty';
    try { encodeQr(this.value(), this._effectiveEcLevel()); return null; }
    catch (e: unknown) { return e instanceof Error ? e.message : String(e); }
  });

  readonly _matrix = computed<boolean[][] | null>(() => {
    if (this._error()) return null;
    return encodeQr(this.value(), this._effectiveEcLevel());
  });

  readonly _modules = computed<number>(() => this._matrix()?.length ?? 21);

  readonly _totalSize = computed<number>(() => {
    const margin = this.margin() * 2;
    return this._modules() + margin;
  });

  /** Single SVG <path> d-string for all dark modules (row-merged for efficiency) */
  readonly _darkPath = computed<string>(() => {
    const m = this._matrix();
    if (!m) return '';
    const margin = this.margin();
    const parts: string[] = [];
    const size = m.length;
    for (let r = 0; r < size; r++) {
      let runStart = -1;
      for (let c = 0; c <= size; c++) {
        const dark = c < size && m[r][c];
        if (dark && runStart === -1) {
          runStart = c;
        } else if (!dark && runStart !== -1) {
          const x = runStart + margin;
          const y = r + margin;
          const w = c - runStart;
          parts.push(`M${x} ${y}h${w}v1h-${w}z`);
          runStart = -1;
        }
      }
    }
    return parts.join('');
  });

  readonly _logoSizePx = computed<number>(() => {
    if (!this.logo()) return 0;
    return Math.round(this._totalSize() * Math.min(0.3, Math.max(0.1, this.logoSize())));
  });

  readonly _logoOffset = computed<number>(() =>
    (this._totalSize() - this._logoSizePx()) / 2
  );

  downloadSvg(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const svg = this.svgEl()?.nativeElement;
    if (!svg) return;
    const data = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([data], { type: 'image/svg+xml' });
    this._triggerDownload(URL.createObjectURL(blob), 'qrcode.svg');
  }

  downloadPng(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const svg = this.svgEl()?.nativeElement;
    if (!svg) return;
    const px = this.size();
    const data = new XMLSerializer().serializeToString(svg);
    const img = new Image();
    img.width = px; img.height = px;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = px; canvas.height = px;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, px, px);
      canvas.toBlob(blob => {
        if (blob) this._triggerDownload(URL.createObjectURL(blob), 'qrcode.png');
      });
    };
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(data);
  }

  private _triggerDownload(url: string, filename: string): void {
    const a = document.createElement('a');
    a.href = url; a.download = filename;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}
