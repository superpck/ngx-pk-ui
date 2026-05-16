import { Component, TemplateRef, viewChild } from '@angular/core';

@Component({
  selector: 'pk-split-panel',
  template: `<ng-template #content><ng-content /></ng-template>`,
})
export class PkSplitPanel {
  content = viewChild.required<TemplateRef<unknown>>('content');
}
