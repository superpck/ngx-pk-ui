import { Component, computed, inject, input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { PK_ICONS, PkIconName } from './pk-icon.model';

@Component({
  selector: 'pk-icon',
  template: `<span [innerHTML]="svgHtml()"></span>`,
  styleUrl: './pk-icon.css',
})
export class PkIcon {
  name        = input.required<PkIconName>();
  size        = input<number>(15);
  color       = input<string>('currentColor');
  fillColor   = input<string>('none');
  viewBox     = input<string>('0 0 24 24');
  strokeWidth = input<number>(2);

  private sanitizer = inject(DomSanitizer);

  svgHtml = computed((): SafeHtml => {
    const paths = PK_ICONS[this.name()] ?? '';
    const svg =
      `<svg xmlns="http://www.w3.org/2000/svg"` +
      ` width="${this.size()}" height="${this.size()}"` +
      ` viewBox="${this.viewBox()}"` +
      ` stroke="${this.color()}"` +
      ` fill="${this.fillColor()}"` +
      ` stroke-width="${this.strokeWidth()}"` +
      ` stroke-linecap="round" stroke-linejoin="round">` +
      paths +
      `</svg>`;
    return this.sanitizer.bypassSecurityTrustHtml(svg);
  });
}
