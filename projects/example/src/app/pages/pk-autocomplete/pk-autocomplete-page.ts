import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  PkAutocompleteComponent,
  type AutocompleteOption,
  type AutocompleteFetchFn,
} from 'ngx-pk-ui';

@Component({
  selector: 'app-pk-autocomplete-page',
  imports: [FormsModule, PkAutocompleteComponent],
  templateUrl: './pk-autocomplete-page.html',
})
export class PkAutocompletePage {
  selectedLocal: string | null = null;
  selectedAsync: string | null = null;
  ngModelValue: string | null = null;
  multiValue = '';
  multiWordValue = '';

  localOptions: string[] = [
    'Bangkok',
    'Chiang Mai',
    'Phuket',
    'Khon Kaen',
    'Songkhla',
    'Ubon Ratchathani',
    'Lopburi',
    'Nakhon Ratchasima',
    'Chiang Rai',
  ];

  private allCountries: AutocompleteOption[] = [
    { label: 'Thailand', value: 'th' },
    { label: 'Taiwan', value: 'tw' },
    { label: 'Turkey', value: 'tr' },
    { label: 'Tunisia', value: 'tn' },
    { label: 'Japan', value: 'jp' },
    { label: 'Jordan', value: 'jo' },
    { label: 'Germany', value: 'de' },
    { label: 'Greece', value: 'gr' },
    { label: 'France', value: 'fr' },
    { label: 'Finland', value: 'fi' },
    { label: 'Canada', value: 'ca' },
    { label: 'China', value: 'cn' },
  ];

  fetchCountries: AutocompleteFetchFn = async (term: string) => {
    await new Promise(resolve => setTimeout(resolve, 250));
    const query = term.trim().toLowerCase();
    if (!query) {
      return this.allCountries.slice(0, 8);
    }
    return this.allCountries.filter(item => item.label.toLowerCase().includes(query));
  };

  readonly codeUsage = `import { FormsModule } from '@angular/forms';
import { PkAutocompleteComponent } from 'ngx-pk-ui';

@Component({
  imports: [FormsModule, PkAutocompleteComponent],
})
export class AnyPage {
  // Simple string array (new)
  options: string[] = ['Bangkok', 'Phuket', 'Chiang Mai'];

  // Or AutocompleteOption[] for custom label/value (still supported)
  // options: AutocompleteOption[] = [
  //   { label: 'Bangkok', value: 'bkk' },
  // ];

  selected: string | null = null;
}

<pk-autocomplete
  [options]="options"
  placeholder="Search"
  [(ngModel)]="selected"
/>`;

  readonly codeMulti = `<pk-autocomplete
  [options]="cityOptions"
  [multi]="true"
  [minChars]="0"
  placeholder="เลือกจังหวัด…"
  [(ngModel)]="selectedCities"
/>

// value: 'Bangkok Khon Kaen Lopburi'`;

  readonly codeMultiWord = `<pk-autocomplete
  [options]="cityOptions"
  [multiWord]="true"
  [minChars]="1"
  placeholder="พิมพ์ → เลือก → Space → พิมพ์ต่อ…"
  [(ngModel)]="selected"
/>

// พิมพ์ B → เลือก Bangkok → Space → พิมพ์ K → เลือก Khon Kaen
// value: 'Bangkok Khon Kaen'`;
}
