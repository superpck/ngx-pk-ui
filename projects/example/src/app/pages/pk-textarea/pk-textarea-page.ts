import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PkTextarea } from 'ngx-pk-ui';
import type { PkTextareaValue } from 'ngx-pk-ui';

@Component({
  selector: 'app-pk-textarea-page',
  imports: [PkTextarea, FormsModule],
  templateUrl: './pk-textarea-page.html',
  styleUrl: './pk-textarea-page.css',
})
export class PkTextareaPage {
  basicValue = signal<PkTextareaValue>({ html: '', text: '' });
  richValue = signal<PkTextareaValue>({
    html: '<h2>Welcome!</h2><p>This editor supports <b>bold</b>, <i>italic</i>, <u>underline</u>, and more.</p>',
    text: '',
  });

  readonly codeImport = `import { PkTextarea } from 'ngx-pk-ui';
import type { PkTextareaValue } from 'ngx-pk-ui';

@Component({
  imports: [PkTextarea, FormsModule],
})`;

  readonly codeBasic = `<pk-textarea [(ngModel)]="value" />`;

  readonly codeWithOptions = `<pk-textarea
  [(ngModel)]="value"
  placeholder="Start typing..."
  minHeight="160px"
  [showToolbar]="true"
  theme="light"
/>`;

  readonly codeDark = `<pk-textarea
  [(ngModel)]="value"
  theme="dark"
  minHeight="180px"
/>`;

  readonly codeNoToolbar = `<pk-textarea
  [(ngModel)]="value"
  [showToolbar]="false"
  placeholder="No toolbar mode..."
/>`;

  readonly codeDisabled = `<pk-textarea
  [(ngModel)]="value"
  [disabled]="true"
/>`;

  readonly codeValue = `interface PkTextareaValue {
  html: string;   // full HTML string from the editor
  text: string;   // plain text (innerText)
}`;

  readonly codeFontNote = `<!-- Font names use pk-font-* CSS classes from pk-font.css (opt-in) -->
<!-- Import the font stylesheet to activate them:               -->
@import 'ngx-pk-ui/styles/pk-font.css';`;
}
