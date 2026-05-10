import { Component, TemplateRef, ViewChild, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'pk-tab-title',
  standalone: false,
  templateUrl: './pk-tab-title.component.html',
  styles: [`
    .pk-tab-title {
      font-size: 14px;
      display: inline-block;
      white-space: nowrap;
      cursor: pointer;
    }
  `]
})
export class PkTabTitleComponent {
  @ViewChild('titleTemplate', { static: true }) templateRef!: TemplateRef<any>;
  @Input() customStyle: { [key: string]: string } = {};
  @Input() customClass: string = '';
  @Input() style: string = '';
  @Output() tabClick = new EventEmitter<void>();

  onClick() {
    this.tabClick.emit();
  }
}