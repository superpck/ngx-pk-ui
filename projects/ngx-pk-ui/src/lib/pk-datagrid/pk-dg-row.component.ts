import { Component, Input, TemplateRef, ContentChild } from '@angular/core';

@Component({
  selector: 'pk-dg-row',
  templateUrl: './pk-dg-row.component.html',
  styleUrls: ['./pk-dg-row.component.scss'],
  standalone: false,
  host: {
    'style': 'display: contents'
  }
})
export class PkDgRowComponent {
  @Input() pkDgItem: any;
  
  @ContentChild('detail') detailTemplate?: TemplateRef<any>;
  
  isExpanded: boolean = false;
  hasDetail: boolean = false;
}
