import { Component, input, TemplateRef, viewChild } from '@angular/core';

@Component({
  selector: 'pk-tab',
  template: `<ng-template #content><ng-content /></ng-template>`,
})
export class PkTab {
  label = input.required<string>();
  disabled = input<boolean>(false);
  content = viewChild.required<TemplateRef<unknown>>('content');
}
