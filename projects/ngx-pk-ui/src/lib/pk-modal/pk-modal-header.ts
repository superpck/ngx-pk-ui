import { Component } from '@angular/core';

@Component({
  selector: 'pk-modal-header',
  standalone: true,
  template: `<ng-content />`,
  styles: [`
    :host {
      display: block;
      padding: 16px 48px 16px 20px;
      border-bottom: 1px solid #e0e0e0;
      font-size: 17px;
      font-weight: 600;
      color: #1a1a2e;
      line-height: 1.4;
    }
  `],
})
export class PkModalHeader {}
