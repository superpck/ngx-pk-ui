import { Component, signal } from '@angular/core';
import { PkModal, PkModalHeader, PkModalBody, PkModalFooter } from 'ngx-pk-ui';
import type { PkModalSize, PkModalTheme } from 'ngx-pk-ui';

@Component({
  selector: 'app-pk-modal-page',
  imports: [PkModal, PkModalHeader, PkModalBody, PkModalFooter],
  templateUrl: './pk-modal-page.html',
})
export class PkModalPage {
  basicOpen    = signal(false);
  noCloseOpen  = signal(false);
  noBlurOpen   = signal(false);
  sizeOpen     = signal(false);
  customOpen   = signal(false);
  themeOpen    = signal(false);
  currentSize  = signal<PkModalSize>('md');
  currentTheme = signal<PkModalTheme>('white');

  openSize(size: PkModalSize) {
    this.currentSize.set(size);
    this.sizeOpen.set(true);
  }

  openTheme(theme: PkModalTheme) {
    this.currentTheme.set(theme);
    this.themeOpen.set(true);
  }
}
