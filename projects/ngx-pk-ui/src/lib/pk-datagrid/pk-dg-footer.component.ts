import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'pk-dg-footer',
  template: '<div class="pk-dg-footer"><ng-content></ng-content></div>',
  styles: [`
    .pk-dg-footer {
      border-top: 2px solid #e0e0e0;
      background: #fafafa;
    }
  `],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class PkDgFooterComponent {}
