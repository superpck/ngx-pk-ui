import { Component, signal } from '@angular/core';
import { PkSelectComponent, SelectOption } from '../index';

@Component({
  selector: 'pk-select-search-example',
  imports: [PkSelectComponent],
  template: `
    <div style="max-width: 400px;">
      <h4 style="margin-bottom: 12px;">Select with Search</h4>
      
      <pk-select
        [options]="options()"
        [searchable]="true"
        [placeholder]="'Search and select a province...'"
        (change)="onSelectionChange($event)" />
      
      <p style="margin-top: 12px; color: #6b7280;">
        Selected: {{ selectedValue() || 'None' }}
      </p>
    </div>
  `
})
export class PkSelectSearchExample {
  selectedValue = signal<string>('');

  options = signal<SelectOption[]>([
    { label: 'Bangkok', value: 'bangkok' },
    { label: 'Krabi', value: 'krabi' },
    { label: 'Kanchanaburi', value: 'kanchanaburi' },
    { label: 'Kalasin', value: 'kalasin' },
    { label: 'Kamphaeng Phet', value: 'kamphaengphet' },
    { label: 'Khon Kaen', value: 'khonkaen' },
    { label: 'Chanthaburi', value: 'chanthaburi' },
    { label: 'Chachoengsao', value: 'chachoengsao' },
    { label: 'Chonburi', value: 'chonburi' },
    { label: 'Chainat', value: 'chainat' },
    { label: 'Chaiyaphum', value: 'chaiyaphum' },
    { label: 'Chumphon', value: 'chumphon' },
    { label: 'Chiang Rai', value: 'chiangrai' },
    { label: 'Chiang Mai', value: 'chiangmai' },
    { label: 'Trang', value: 'trang' },
    { label: 'Trat', value: 'trat' },
    { label: 'Tak', value: 'tak' },
    { label: 'Nakhon Nayok', value: 'nakhonnayok' },
    { label: 'Nakhon Pathom', value: 'nakhonpathom' },
    { label: 'Nakhon Phanom', value: 'nakhonphanom' },
    { label: 'Nakhon Ratchasima', value: 'nakhonratchasima' },
    { label: 'Nakhon Si Thammarat', value: 'nakhonsithammarat' },
    { label: 'Nakhon Sawan', value: 'nakhonsawan' },
    { label: 'Nonthaburi', value: 'nonthaburi' },
    { label: 'Narathiwat', value: 'narathiwat' },
    { label: 'Nan', value: 'nan' },
    { label: 'Bueng Kan', value: 'buengkan' },
    { label: 'Buriram', value: 'buriram' },
    { label: 'Pathum Thani', value: 'pathumthani' },
    { label: 'Prachuap Khiri Khan', value: 'prachuapkhirikhan' },
    { label: 'Prachin Buri', value: 'prachinburi' },
    { label: 'Pattani', value: 'pattani' },
    { label: 'Phra Nakhon Si Ayutthaya', value: 'phranakhonsiayutthaya' },
    { label: 'Phayao', value: 'phayao' },
    { label: 'Phang Nga', value: 'phangnga' },
    { label: 'Phatthalung', value: 'phatthalung' },
    { label: 'Phichit', value: 'phichit' },
    { label: 'Phitsanulok', value: 'phitsanulok' },
    { label: 'Phetchaburi', value: 'phetchaburi' },
    { label: 'Phetchabun', value: 'phetchabun' },
    { label: 'Phrae', value: 'phrae' },
    { label: 'Phuket', value: 'phuket' },
    { label: 'Maha Sarakham', value: 'mahasarakham' },
    { label: 'Mukdahan', value: 'mukdahan' },
    { label: 'Mae Hong Son', value: 'maehongson' },
    { label: 'Yasothon', value: 'yasothon' },
    { label: 'Yala', value: 'yala' },
    { label: 'Roi Et', value: 'roiet' },
    { label: 'Ranong', value: 'ranong' },
    { label: 'Rayong', value: 'rayong' },
    { label: 'Ratchaburi', value: 'ratchaburi' },
    { label: 'Lopburi', value: 'lopburi' },
    { label: 'Lampang', value: 'lampang' },
    { label: 'Lamphun', value: 'lamphun' },
    { label: 'Loei', value: 'loei' },
    { label: 'Sisaket', value: 'sisaket' },
    { label: 'Sakon Nakhon', value: 'sakonnakhon' },
    { label: 'Songkhla', value: 'songkhla' },
    { label: 'Satun', value: 'satun' },
    { label: 'Samut Prakan', value: 'samutprakan' },
    { label: 'Samut Songkhram', value: 'samutsakorn' },
    { label: 'Samut Sakhon', value: 'samutsakhon' },
    { label: 'Sa Kaeo', value: 'sakaeo' },
    { label: 'Saraburi', value: 'saraburi' },
    { label: 'Sing Buri', value: 'singburi' },
    { label: 'Sukhothai', value: 'sukhothai' },
    { label: 'Suphan Buri', value: 'suphanburi' },
    { label: 'Surat Thani', value: 'suratthani' },
    { label: 'Surin', value: 'surin' },
    { label: 'Nong Khai', value: 'nongkhai' },
    { label: 'Nong Bua Lamphu', value: 'nongbualamphu' },
    { label: 'Ang Thong', value: 'angthong' },
    { label: 'Amnat Charoen', value: 'amnatcharoen' },
    { label: 'Udon Thani', value: 'udonthani' },
    { label: 'Uttaradit', value: 'uttaradit' },
    { label: 'Uthai Thani', value: 'uthaithani' },
    { label: 'Ubon Ratchathani', value: 'ubonratchathani' },
  ]);

  onSelectionChange(value: any): void {
    this.selectedValue.set(String(value));
  }
}
