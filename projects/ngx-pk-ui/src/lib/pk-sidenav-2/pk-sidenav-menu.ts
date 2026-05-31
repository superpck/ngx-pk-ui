import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { NgStyle, NgClass } from '@angular/common';

/**
 * PkSidenavMenu — menu container that holds pk-sidenav-item children.
 * Projected inside <pk-sidenav> via ng-content.
 */
@Component({
  selector: 'pk-sidenav-menu',
  standalone: true,
  imports: [NgStyle, NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="pk-snv-menu"
      [ngClass]="hostClass()"
      [ngStyle]="hostStyle()"
    >
      <ng-content />
    </div>
  `,
  styles: [`
    :host {
      display: block;
      flex: 1;
      overflow-y: auto;
      overflow-x: hidden;
    }

    .pk-snv-menu {
      display: flex;
      flex-direction: column;
      gap: 4px;
      padding: 8px 12px;
    }
  `],
})
export class PkSidenavMenu {
  customClass = input<string>('');
  customStyle = input<Record<string, string>>({});

  readonly hostClass = computed(() => this.customClass());
  readonly hostStyle = computed(() => this.customStyle());
}
