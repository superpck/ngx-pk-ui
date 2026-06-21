import { Component, TemplateRef, viewChild, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'pk-split-panel',
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `<ng-template #content><ng-content /></ng-template>`,
})
export class PkSplitPanel {
  content = viewChild.required<TemplateRef<unknown>>('content');
}
