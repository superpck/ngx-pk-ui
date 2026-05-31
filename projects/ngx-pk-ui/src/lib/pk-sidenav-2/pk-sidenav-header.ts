import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { NgStyle, NgClass } from '@angular/common';

/**
 * PkSidenavHeader — header slot for logo and app name.
 * Projected inside <pk-sidenav> via ng-content.
 */
@Component({
  selector: 'pk-sidenav-header',
  standalone: true,
  imports: [NgStyle, NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="pk-snv-header"
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
      position: sticky;
      top: 0;
      background: var(--pk-snv-bg, #ffffff);
      z-index: 10;
    }

    .pk-snv-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 8px 12px 12px;
      min-height: 56px;
      box-sizing: border-box;
      border-bottom: 1px solid var(--pk-snv-divider-color, rgba(0, 0, 0, 0.07));
    }
  `],
})
export class PkSidenavHeader {
  customClass = input<string>('');
  customStyle = input<Record<string, string>>({});

  readonly hostClass = computed(() => this.customClass());
  readonly hostStyle = computed(() => this.customStyle());
}
