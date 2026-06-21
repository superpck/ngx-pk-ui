import { Component, ChangeDetectionStrategy } from '@angular/core';
import { PkAccordion, PkAccordionItem } from 'ngx-pk-ui';

@Component({
  selector: 'app-pk-accordion-page',
  imports: [PkAccordion, PkAccordionItem],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './pk-accordion-page.html',
})
export class PkAccordionPage {}
