import { Component } from '@angular/core';

@Component({
  selector: 'pk-modal-footer',
  standalone: true,
  template: `<ng-content />`,
  styles: [`
    :host {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 8px;
      padding: 12px 20px;
      border-top: 1px solid #e0e0e0;
      background: #f9f9f9;
      border-bottom-left-radius: 10px;
      border-bottom-right-radius: 10px;
    }
  `],
})
export class PkModalFooter {}
