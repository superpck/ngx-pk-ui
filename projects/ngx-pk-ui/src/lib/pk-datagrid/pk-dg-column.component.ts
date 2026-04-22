import { Component, Input } from '@angular/core';

@Component({
  selector: 'pk-dg-column',
  template: '<td [class.wrap]="!_nowrap" [ngStyle]="tdStyle"><ng-content></ng-content></td>',
  styleUrls: ['./pk-dg-column.component.css'],
  standalone: false,
  host: {
    'style': 'display: contents'
  }
})
export class PkDgColumnComponent {
  @Input() set nowrap(value: boolean) {
    this._nowrap = value;
  }
  get nowrap(): boolean { return this._nowrap; }
  _nowrap: boolean = true;

  @Input() tdStyle: { [key: string]: string } | null = null;
}
