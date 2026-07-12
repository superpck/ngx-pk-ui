import { Component, Input, ContentChild, TemplateRef, ChangeDetectorRef, inject, SimpleChanges, OnChanges } from '@angular/core';
import { PkTabBodyComponent } from './pk-tab-body.component';
import { PkTabTitleComponent } from './pk-tab-title.component';
import { PkTabsComponent } from '../pk-tabs/pk-tabs.component';

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
export class PkTabComponent implements OnChanges {
  @Input() active = false;
  @Input() disabled = false; // เพิ่ม disabled
  @Input() customStyle: { [key: string]: any } = {};
  @Input() customClass: string = '';
  @Input() style: string = '';
  
  @ContentChild(PkTabTitleComponent) captionComponent!: PkTabTitleComponent;
  @ContentChild(PkTabBodyComponent) bodyComponent!: PkTabBodyComponent;

  cdr = inject(ChangeDetectorRef);
  parentTabs = inject(PkTabsComponent, { optional: true });

  get captionTemplate(): TemplateRef<any> {
    return this.captionComponent.templateRef;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['active']) {
      this.cdr.markForCheck();
      
      // If the consumer sets [active]="true", notify the parent to update internal state (so tab headers update)
      if (this.parentTabs && changes['active'].currentValue === true && !changes['active'].isFirstChange()) {
          this.parentTabs.syncFromChild(this);
      }
    }
  }
}