import { Component, computed, effect, inject, input, OnDestroy, output, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, NgStyle, DOCUMENT } from '@angular/common';
import type { PkModalSize, PkModalTheme } from './pk-modal.model';

// ── Shared scroll-lock counter (survives multiple PkModal instances) ──────────
let _lockCount = 0;
let _savedPaddingRight = '';

function lockBody(doc: Document): void {
  _lockCount++;
  if (_lockCount === 1) {
    const scrollbarWidth = (doc.defaultView?.innerWidth ?? 0) - doc.documentElement.clientWidth;
    _savedPaddingRight = doc.body.style.paddingRight;
    if (scrollbarWidth > 0) {
      doc.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    doc.body.style.overflow = 'hidden';
  }
}

function unlockBody(doc: Document): void {
  _lockCount = Math.max(0, _lockCount - 1);
  if (_lockCount === 0) {
    doc.body.style.overflow = '';
    doc.body.style.paddingRight = _savedPaddingRight;
    _savedPaddingRight = '';
  }
}

@Component({
  selector: 'pk-modal',
  imports: [NgStyle],
  templateUrl: './pk-modal.html',
  styleUrl: './pk-modal.css',
})
export class PkModal implements OnDestroy {
  private readonly doc        = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser  = isPlatformBrowser(this.platformId);

  openModal   = input<boolean>(false);
  customStyle = input<Record<string, string> | null>(null);
  customClass = input<string | null>(null);
  blur        = input<boolean>(true);
  size        = input<PkModalSize>('md');
  theme       = input<PkModalTheme>('white');
  closeAny    = input<boolean>(false);
  closeMarker = input<boolean>(true);
  /** Lock background scroll while the modal is open (default: true). */
  lockScroll  = input<boolean>(true);

  onClose = output<void>();

  private _locked = false;

  constructor() {
    effect(() => {
      if (!this.isBrowser || !this.lockScroll()) {
        return;
      }
      if (this.openModal()) {
        if (!this._locked) {
          lockBody(this.doc);
          this._locked = true;
        }
      } else {
        if (this._locked) {
          unlockBody(this.doc);
          this._locked = false;
        }
      }
    });
  }

  ngOnDestroy(): void {
    if (this.isBrowser && this._locked) {
      unlockBody(this.doc);
      this._locked = false;
    }
  }

  readonly dialogClass = computed(() => {
    const classes = [
      'pk-modal-dialog',
      `pk-modal-dialog--${this.size()}`,
      `pk-modal-dialog--theme-${this.theme()}`,
    ];
    const custom = this.customClass();
    if (custom) classes.push(custom);
    return classes.join(' ');
  });

  close(): void {
    this.onClose.emit();
  }

  onOverlayClick(): void {
    if (this.closeAny()) {
      this.close();
    }
  }
}
