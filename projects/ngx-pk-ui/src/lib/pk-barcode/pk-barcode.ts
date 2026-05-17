import {
  Component, computed, input, viewChild, ElementRef, PLATFORM_ID, inject,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import type { PkBarcodeFormat } from './pk-barcode.model';
import { encodeBarcode } from './pk-barcode-encoder';

interface Rect { x: number; y: number; w: number; h: number; }

@Component({
  selector: 'pk-barcode',
  standalone: true,
  imports: [],
  templateUrl: './pk-barcode.html',
  styleUrl: './pk-barcode.css',
})
export class PkBarcode {
  private platformId = inject(PLATFORM_ID);

  value       = input.required<string>();
  format      = input<PkBarcodeFormat>('code128');
  lineColor   = input<string>('#000000');
  bgColor     = input<string>('#ffffff');
  showText    = input<boolean>(true);
  fontSize    = input<number>(12);
  barHeight   = input<number>(60);
  moduleWidth = input<number>(2);
  quietZone   = input<number>(0);  // extra side padding (modules handled inside encoder)

  readonly svgEl = viewChild<ElementRef<SVGSVGElement>>('svgEl');

  readonly _error = computed<string | null>(() => {
    try { encodeBarcode(this.value(), this.format()); return null; }
    catch (e: unknown) { return e instanceof Error ? e.message : String(e); }
  });

  readonly _bars = computed(() => {
    if (this._error()) return [];
    return encodeBarcode(this.value(), this.format());
  });

  readonly _totalModules = computed(() =>
    this._bars().reduce((s, b) => s + b.width, 0)
  );

  readonly _svgWidth = computed(() =>
    this._totalModules() * this.moduleWidth() + this.quietZone() * 2
  );

  readonly _textY = computed(() =>
    this.barHeight() + (this.showText() ? this.fontSize() + 4 : 0) + 6
  );

  readonly _svgHeight = computed(() => this._textY() + 4);

  readonly _darkRects = computed<Rect[]>(() => {
    const mw = this.moduleWidth();
    const h  = this.barHeight();
    const qz = this.quietZone();
    let x = qz;
    const rects: Rect[] = [];
    for (const bar of this._bars()) {
      if (bar.dark) rects.push({ x, y: 0, w: bar.width * mw, h });
      x += bar.width * mw;
    }
    return rects;
  });

  readonly _labelText = computed<string>(() => {
    const v = this.value();
    const fmt = this.format();
    if (fmt === 'ean13' && v.length === 12) return v + '?'; // before checksum computed
    return v;
  });

  downloadSvg(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const svg = this.svgEl()?.nativeElement;
    if (!svg) return;
    const data = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([data], { type: 'image/svg+xml' });
    this._triggerDownload(URL.createObjectURL(blob), `barcode-${this.format()}.svg`);
  }

  downloadPng(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const svg = this.svgEl()?.nativeElement;
    if (!svg) return;
    const data = new XMLSerializer().serializeToString(svg);
    const img = new Image();
    const url = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(data);
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width  = this._svgWidth();
      canvas.height = this._svgHeight();
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0);
      canvas.toBlob(blob => {
        if (blob) this._triggerDownload(URL.createObjectURL(blob), `barcode-${this.format()}.png`);
      });
    };
    img.src = url;
  }

  private _triggerDownload(url: string, filename: string): void {
    const a = document.createElement('a');
    a.href = url; a.download = filename;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}
