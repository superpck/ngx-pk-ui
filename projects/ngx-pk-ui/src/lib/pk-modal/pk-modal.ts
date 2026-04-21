import { Component, computed, input, output } from '@angular/core';
import { NgStyle } from '@angular/common';
import type { PkModalSize, PkModalTheme } from './pk-modal.model';

@Component({
  selector: 'pk-modal',
  imports: [NgStyle],
  templateUrl: './pk-modal.html',
  styleUrl: './pk-modal.css',
})
export class PkModal {
  openModal   = input<boolean>(false);
  customStyle = input<Record<string, string> | null>(null);
  customClass = input<string | null>(null);
  blur        = input<boolean>(true);
  size        = input<PkModalSize>('md');
  theme       = input<PkModalTheme>('white');
  closeAny    = input<boolean>(false);
  closeMarker = input<boolean>(true);

  onClose = output<void>();

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
