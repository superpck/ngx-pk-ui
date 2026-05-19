import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  PkClickOutsideDirective,
  PkCopyToClipboardDirective,
  PkAutoFocusDirective,
  PkDebounceClickDirective,
  PkNumberOnlyDirective,
} from 'ngx-pk-ui';

@Component({
  selector: 'pk-directives-page',
  standalone: true,
  imports: [
    FormsModule,
    PkClickOutsideDirective,
    PkCopyToClipboardDirective,
    PkAutoFocusDirective,
    PkDebounceClickDirective,
    PkNumberOnlyDirective,
  ],
  templateUrl: './pk-directives-page.html',
  styleUrl: './pk-directives-page.css',
})
export class PkDirectivesPage {
  // pkClickOutside
  dropdownOpen = signal(false);

  // pkCopyToClipboard
  copyText = signal('https://github.com/ngx-pk-ui');
  copyStatus = signal<'idle' | 'ok' | 'fail'>('idle');
  onCopied(ok: boolean): void {
    this.copyStatus.set(ok ? 'ok' : 'fail');
    setTimeout(() => this.copyStatus.set('idle'), 2000);
  }

  // pkAutoFocus
  autoFocusEnabled = signal(true);
  autoFocusKey = signal(0);
  remount(): void { this.autoFocusKey.update(k => k + 1); }

  // pkDebounceClick
  debounceDelay = signal(300);
  debounceCount = signal(0);
  debounceLog: string[] = [];
  onDebounced(): void {
    this.debounceCount.update(n => n + 1);
    this.debounceLog = [`Fired at ${new Date().toLocaleTimeString()}`, ...this.debounceLog].slice(0, 5);
  }

  // pkNumberOnly
  intValue = signal('');
  decValue = signal('');

  readonly code1 = `import {
  PkClickOutsideDirective,
  PkCopyToClipboardDirective,
  PkAutoFocusDirective,
  PkDebounceClickDirective,
  PkNumberOnlyDirective,
} from 'ngx-pk-ui';

@Component({
  imports: [
    PkClickOutsideDirective,
    PkCopyToClipboardDirective,
    PkAutoFocusDirective,
    PkDebounceClickDirective,
    PkNumberOnlyDirective,
  ],
})`;

  readonly code2 = `<!-- Click outside -->
<div pkClickOutside (pkClickOutside)="close()">...</div>

<!-- Copy to clipboard -->
<button [pkCopyToClipboard]="url" (pkCopied)="onCopied($event)">Copy</button>

<!-- Auto focus -->
<input pkAutoFocus />
<input [pkAutoFocus]="isOpen()" />

<!-- Debounce click (300 ms default) -->
<button pkDebounceClick (pkDebounceClicked)="search()">Search</button>
<button [pkDebounceClick]="500" (pkDebounceClicked)="save()">Save</button>

<!-- Numbers only -->
<input type="text" pkNumberOnly />
<input type="text" pkNumberOnly [pkAllowDecimal]="true" />`;

  readonly codeClickOutside = `<div pkClickOutside (pkClickOutside)="close()">...</div>`;
  readonly codeCopyToClipboard = `<button [pkCopyToClipboard]="url" (pkCopied)="onCopied($event)">Copy</button>`;
  readonly codeAutoFocus = `<input pkAutoFocus />\n<input [pkAutoFocus]="isOpen()" />`;
  readonly codeDebounce = `<button pkDebounceClick (pkDebounceClicked)="search()">Search</button>\n<button [pkDebounceClick]="500" (pkDebounceClicked)="save()">Save</button>`;
  readonly codeNumberOnly = `<input type="text" pkNumberOnly />\n<input type="text" pkNumberOnly [pkAllowDecimal]="true" />`;
}
