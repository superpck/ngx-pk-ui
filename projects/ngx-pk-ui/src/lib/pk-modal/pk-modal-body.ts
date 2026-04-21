import { Component } from '@angular/core';

@Component({
  selector: 'pk-modal-body',
  standalone: true,
  template: `<ng-content />`,
  styles: [`
    :host {
      display: block;
      padding: 20px;
      flex: 1;
      overflow-y: auto;
      color: #333;
      line-height: 1.6;
      font-size: 14px;
    }
  `],
})
export class PkModalBody {}
