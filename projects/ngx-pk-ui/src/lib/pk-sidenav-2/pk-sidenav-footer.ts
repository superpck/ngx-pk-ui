import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { NgStyle, NgClass } from '@angular/common';

/**
 * PkSidenavFooter — footer slot for user info or other bottom content.
 * Projected inside <pk-sidenav> via ng-content.
 */
@Component({
  selector: 'pk-sidenav-footer',
  standalone: true,
  imports: [NgStyle, NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="pk-snv-footer"
      [ngClass]="hostClass()"
      [ngStyle]="hostStyle()"
    >
      <ng-content />
    </div>
  `,
  styles: [`
    :host {
      display: block;
      flex-shrink: 0;
      margin-top: auto;
      position: sticky;
      bottom: 0;
      background: var(--pk-snv-bg, #ffffff);
      z-index: 10;
    }

    .pk-snv-footer {
      padding: 14px 12px;
      box-sizing: border-box;
      border-top: 1px solid var(--pk-snv-divider-color, rgba(0, 0, 0, 0.07));
      text-align: center;
      font-size: 12px;
      font-weight: 500;
      color: var(--pk-snv-color, #374151);
      opacity: 0.8;
      letter-spacing: 0.01em;
    }
  `],
})
export class PkSidenavFooter {
  customClass = input<string>('');
  customStyle = input<Record<string, string>>({});

  readonly hostClass = computed(() => this.customClass());
  readonly hostStyle = computed(() => this.customStyle());
}
