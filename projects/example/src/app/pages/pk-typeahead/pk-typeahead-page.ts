import { Component } from '@angular/core';
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

  cityItems = [
    { label: 'Bangkok', value: 'bangkok' },
    { label: 'Chiang Mai', value: 'chiangmai' },
    { label: 'Phuket', value: 'phuket' },
    { label: 'Khon Kaen', value: 'khonkaen' },
    { label: 'Songkhla', value: 'songkhla' },
    { label: 'Ubon Ratchathani', value: 'ubonratchathani' },
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

  onCitySelected(item: { label: string; value: string }): void {
    this.selectedValue = item.value;
  }

  onLanguageSelected(item: string): void {
    this.selectedStrict = item;
  }
}
