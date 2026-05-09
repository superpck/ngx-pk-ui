import { Component, input, signal, TemplateRef, viewChild } from '@angular/core';

@Component({
  selector: 'pk-accordion-item',
  template: `<ng-template #content><ng-content /></ng-template>`,
})
export class PkAccordionItem {
  label = input.required<string>();
  disabled = input<boolean>(false);
  open = input<boolean>(false);

  /** Internal open state — managed by PkAccordion parent */
  _isOpen = signal(false);

  content = viewChild.required<TemplateRef<unknown>>('content');
}
