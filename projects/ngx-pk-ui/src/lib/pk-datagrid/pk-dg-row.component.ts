import { Component, Input, TemplateRef, ContentChild } from '@angular/core';

@Component({
  selector: 'pk-dg-rows',
  templateUrl: './pk-dg-row.component.html',
  styleUrls: ['./pk-dg-row.component.css'],
  standalone: false,
  host: {
    'style': 'display: contents'
  }
})
export class PkDgRowComponent {
  @Input() pkDgRow: any;
  
  @ContentChild('detail') detailTemplate?: TemplateRef<any>;
  
  isExpanded: boolean = false;
  hasDetail: boolean = false;
}
