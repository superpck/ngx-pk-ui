import { Component, Input } from '@angular/core';

@Component({
  selector: 'pk-tab-body',
  standalone: false,
  templateUrl: './pk-tab-body.component.html',
  styles: [`
    .pk-tab-body {
      padding: 1px;
    }
  `]
})
export class PkTabBodyComponent {
  @Input() customStyle: { [key: string]: any } = {};
  @Input() customClass: string = '';
}