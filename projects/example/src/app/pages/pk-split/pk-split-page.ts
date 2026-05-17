import { Component, signal } from '@angular/core';
import { PkSplit, PkSplitPanel } from 'ngx-pk-ui';

@Component({
  selector: 'app-pk-split-page',
  imports: [PkSplit, PkSplitPanel],
  templateUrl: './pk-split-page.html',
  styleUrl: './pk-split-page.css',
})
export class PkSplitPage {
  lastSize = signal<[number, number] | null>(null);

  readonly codeImport = `import { PkSplit, PkSplitPanel } from 'ngx-pk-ui';

@Component({
  imports: [PkSplit, PkSplitPanel],
})`;

  readonly codeHorizontal = `<pk-split style="height: 300px">
  <pk-split-panel>
    <p>Left panel content</p>
  </pk-split-panel>
  <pk-split-panel>
    <p>Right panel content</p>
  </pk-split-panel>
</pk-split>`;

  readonly codeVertical = `<pk-split direction="vertical" style="height: 300px">
  <pk-split-panel>
    <p>Top panel</p>
  </pk-split-panel>
  <pk-split-panel>
    <p>Bottom panel</p>
  </pk-split-panel>
</pk-split>`;

  readonly codeOptions = `<pk-split
  direction="horizontal"
  [initialSize]="30"
  [minSize]="15"
  [gutterSize]="8"
  (sizeChange)="onSize($event)"
  style="height: 300px"
>
  <pk-split-panel>...</pk-split-panel>
  <pk-split-panel>...</pk-split-panel>
</pk-split>`;

  onSize(sizes: [number, number]): void {
    this.lastSize.set(sizes);
  }
}
