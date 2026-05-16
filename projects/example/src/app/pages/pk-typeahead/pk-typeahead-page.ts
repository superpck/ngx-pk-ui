import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PkTypeaheadComponent } from 'ngx-pk-ui';

@Component({
  selector: 'app-pk-typeahead-page',
  imports: [FormsModule, PkTypeaheadComponent],
  templateUrl: './pk-typeahead-page.html',
})
export class PkTypeaheadPage {
  selectedValue = '';
  selectedStrict = '';
  multiValue = '';
  lastSelected = signal<string>('');

  cityItems = [
    { label: 'Bangkok', value: 'Bangkok' },
    { label: 'Chiang Mai', value: 'Chiang Mai' },
    { label: 'Phuket', value: 'Phuket' },
    { label: 'Khon Kaen', value: 'Khon Kaen' },
    { label: 'Songkhla', value: 'Songkhla' },
    { label: 'Ubon Ratchathani', value: 'Ubon Ratchathani' },
  ];

  languageItems = [
    'TypeScript',
    'JavaScript',
    'Python',
    'Go',
    'Rust',
    'Java',
    'Kotlin',
    'Swift',
  ];

  techItems = [
    'Angular', 'Angular CLI', 'Angular Material',
    'React', 'React Native', 'React Router',
    'Vue', 'Vite', 'Vitest',
    'Next.js', 'Nuxt', 'Nest.js',
    'TypeScript', 'TailwindCSS', 'Tanstack',
    'Node.js', 'npm', 'nginx',
    'Docker', 'Django',
  ];

  readonly codeImport = `import { FormsModule } from '@angular/forms';
import { PkTypeaheadComponent } from 'ngx-pk-ui';

@Component({
  imports: [FormsModule, PkTypeaheadComponent],
})`;

  readonly codeUsage = `<pk-typeahead
  [items]="items"
  labelField="label"
  valueField="value"
  [(ngModel)]="selected"
  (itemSelected)="onSelect($event)"
/>`;

  readonly codeMultiWord = `<!-- Multi-word: type a word, select, press Space, type next word -->
<pk-typeahead
  [items]="techItems"
  [minChars]="1"
  [(ngModel)]="multiValue"
  (itemSelected)="onSelect($event)"
/>`;

  onCitySelected(item: { label: string; value: string }): void {
    this.selectedValue = item.value;
  }

  onLanguageSelected(item: string): void {
    this.selectedStrict = item;
  }

  onTechSelected(item: string): void {
    this.lastSelected.set(item);
  }
}
