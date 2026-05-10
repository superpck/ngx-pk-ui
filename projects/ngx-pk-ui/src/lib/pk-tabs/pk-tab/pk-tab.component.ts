import { Component, Input, ContentChild, TemplateRef, ViewChild } from '@angular/core';
import { PkTabBodyComponent } from './pk-tab-body.component';
import { PkTabTitleComponent } from './pk-tab-title.component';

@Component({
  selector: 'pk-tab',
  standalone: false,
  templateUrl: './pk-tab.component.html',
  styles: [`
    .pk-tab {
      width: 100%;
    }
  `]
})
export class PkTabComponent {
  @Input() active = false;
  @Input() disabled = false; // เพิ่ม disabled
  @Input() customStyle: { [key: string]: any } = {};
  @Input() customClass: string = '';
  @Input() style: string = '';
  
  @ContentChild(PkTabTitleComponent) captionComponent!: PkTabTitleComponent;
  @ContentChild(PkTabBodyComponent) bodyComponent!: PkTabBodyComponent;

  get captionTemplate(): TemplateRef<any> {
    return this.captionComponent.templateRef;
  }
}