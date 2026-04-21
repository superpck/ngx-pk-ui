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

  localOptions: AutocompleteOption[] = [
    { label: 'Bangkok', value: 'bangkok' },
    { label: 'Chiang Mai', value: 'chiangmai' },
    { label: 'Phuket', value: 'phuket' },
    { label: 'Khon Kaen', value: 'khonkaen' },
    { label: 'Songkhla', value: 'songkhla' },
    { label: 'Ubon Ratchathani', value: 'ubonratchathani' },
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

}
