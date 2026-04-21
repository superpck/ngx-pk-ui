import { Component, computed, inject, input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import {
  PK_ICONS,
  PkIconName,
  PkIconSet,
  PkMaterialSymbolGrade,
  PkMaterialSymbolOpticalSize,
  PkMaterialSymbolVariant,
  PkMaterialSymbolWeight,
} from './pk-icon.model';

@Component({
  selector: 'pk-icon',
  template: `
    @if (iconSet() === 'material-symbols') {
      <span
        class="pk-material-symbol"
        [class.material-symbols-outlined]="materialVariantClass() === 'material-symbols-outlined'"
        [class.material-symbols-rounded]="materialVariantClass() === 'material-symbols-rounded'"
        [class.material-symbols-sharp]="materialVariantClass() === 'material-symbols-sharp'"
        [style.font-size.px]="size()"
        [style.color]="color()"
        [style.font-variation-settings]="materialVariationSettings()"
      >{{ name() }}</span>
    } @else {
      <span [innerHTML]="svgHtml()"></span>
    }
  `,
  styleUrl: './pk-icon.css',
})
export class PkIcon {
  name        = input.required<PkIconName | string>();
  iconSet     = input<PkIconSet>('pk');
  size        = input<number>(15);
  color       = input<string>('currentColor');
  fillColor   = input<string>('none');
  viewBox     = input<string>('0 0 24 24');
  strokeWidth = input<number>(2);

  // Material Symbols specific controls
  variant     = input<PkMaterialSymbolVariant>('outlined');
  fill        = input<0 | 1>(0);
  weight      = input<PkMaterialSymbolWeight>(400);
  grade       = input<PkMaterialSymbolGrade>(0);
  opticalSize = input<PkMaterialSymbolOpticalSize>(24);

  private sanitizer = inject(DomSanitizer);

  svgHtml = computed((): SafeHtml => {
    const paths = PK_ICONS[this.name() as PkIconName] ?? '';
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

  materialVariantClass = computed((): string => {
    if (this.variant() === 'rounded') {
      return 'material-symbols-rounded';
    }
    if (this.variant() === 'sharp') {
      return 'material-symbols-sharp';
    }
    return 'material-symbols-outlined';
  });

  materialVariationSettings = computed((): string => {
    return `'FILL' ${this.fill()}, 'wght' ${this.weight()}, 'GRAD' ${this.grade()}, 'opsz' ${this.opticalSize()}`;
  });
}
