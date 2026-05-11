import { Component, TemplateRef, ViewChild, Host, Optional, OnInit } from '@angular/core';
import { PkDgRowComponent } from './pk-dg-row.component';

@Component({
  selector: 'pk-dg-row-expand',
  template: '<ng-content></ng-content>',
  standalone: false,
  host: {
    'style': 'display: contents'
  }
})
export class PkDgRowExpandComponent implements OnInit {
  constructor(
    @Host() @Optional() public row?: PkDgRowComponent
  ) {}

  ngOnInit() {
    if (this.row) {
      this.row.hasDetail = true;
    }
  }
}
