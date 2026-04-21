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
        [placeholder]="'ค้นหาและเลือกจังหวัด'"
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
    { label: 'กรุงเทพมหานคร', value: 'bangkok' },
    { label: 'กระบี่', value: 'krabi' },
    { label: 'กาญจนบุรี', value: 'kanchanaburi' },
    { label: 'กาฬสินธุ์', value: 'kalasin' },
    { label: 'กำแพงเพชร', value: 'kamphaengphet' },
    { label: 'ขอนแก่น', value: 'khonkaen' },
    { label: 'จันทบุรี', value: 'chanthaburi' },
    { label: 'ฉะเชิงเทรา', value: 'chachoengsao' },
    { label: 'ชลบุรี', value: 'chonburi' },
    { label: 'ชัยนาท', value: 'chainat' },
    { label: 'ชัยภูมิ', value: 'chaiyaphum' },
    { label: 'ชุมพร', value: 'chumphon' },
    { label: 'เชียงราย', value: 'chiangrai' },
    { label: 'เชียงใหม่', value: 'chiangmai' },
    { label: 'ตรัง', value: 'trang' },
    { label: 'ตราด', value: 'trat' },
    { label: 'ตาก', value: 'tak' },
    { label: 'นครนายก', value: 'nakhonnayok' },
    { label: 'นครปฐม', value: 'nakhonpathom' },
    { label: 'นครพนม', value: 'nakhonphanom' },
    { label: 'นครราชสีมา', value: 'nakhonratchasima' },
    { label: 'นครศรีธรรมราช', value: 'nakhonsithammarat' },
    { label: 'นครสวรรค์', value: 'nakhonsawan' },
    { label: 'นนทบุรี', value: 'nonthaburi' },
    { label: 'นราธิวาส', value: 'narathiwat' },
    { label: 'น่าน', value: 'nan' },
    { label: 'บึงกาฬ', value: 'buengkan' },
    { label: 'บุรีรัมย์', value: 'buriram' },
    { label: 'ปทุมธานี', value: 'pathumthani' },
    { label: 'ประจวบคีรีขันธ์', value: 'prachuapkhirikhan' },
    { label: 'ปราจีนบุรี', value: 'prachinburi' },
    { label: 'ปัตตานี', value: 'pattani' },
    { label: 'พระนครศรีอยุธยา', value: 'phranakhonsiayutthaya' },
    { label: 'พะเยา', value: 'phayao' },
    { label: 'พังงา', value: 'phangnga' },
    { label: 'พัทลุง', value: 'phatthalung' },
    { label: 'พิจิตร', value: 'phichit' },
    { label: 'พิษณุโลก', value: 'phitsanulok' },
    { label: 'เพชรบุรี', value: 'phetchaburi' },
    { label: 'เพชรบูรณ์', value: 'phetchabun' },
    { label: 'แพร่', value: 'phrae' },
    { label: 'ภูเก็ต', value: 'phuket' },
    { label: 'มหาสารคาม', value: 'mahasarakham' },
    { label: 'มุกดาหาร', value: 'mukdahan' },
    { label: 'แม่ฮ่องสอน', value: 'maehongson' },
    { label: 'ยโสธร', value: 'yasothon' },
    { label: 'ยะลา', value: 'yala' },
    { label: 'ร้อยเอ็ด', value: 'roiet' },
    { label: 'ระนอง', value: 'ranong' },
    { label: 'ระยอง', value: 'rayong' },
    { label: 'ราชบุรี', value: 'ratchaburi' },
    { label: 'ลพบุรี', value: 'lopburi' },
    { label: 'ลำปาง', value: 'lampang' },
    { label: 'ลำพูน', value: 'lamphun' },
    { label: 'เลย', value: 'loei' },
    { label: 'ศรีสะเกษ', value: 'sisaket' },
    { label: 'สกลนคร', value: 'sakonnakhon' },
    { label: 'สงขลา', value: 'songkhla' },
    { label: 'สตูล', value: 'satun' },
    { label: 'สมุทรปราการ', value: 'samutprakan' },
    { label: 'สมุทรสงคราม', value: 'samutsakorn' },
    { label: 'สมุทรสาคร', value: 'samutsakhon' },
    { label: 'สระแก้ว', value: 'sakaeo' },
    { label: 'สระบุรี', value: 'saraburi' },
    { label: 'สิงห์บุรี', value: 'singburi' },
    { label: 'สุโขทัย', value: 'sukhothai' },
    { label: 'สุพรรณบุรี', value: 'suphanburi' },
    { label: 'สุราษฎร์ธานี', value: 'suratthani' },
    { label: 'สุรินทร์', value: 'surin' },
    { label: 'หนองคาย', value: 'nongkhai' },
    { label: 'หนองบัวลำภู', value: 'nongbualamphu' },
    { label: 'อ่างทอง', value: 'angthong' },
    { label: 'อำนาจเจริญ', value: 'amnatcharoen' },
    { label: 'อุดรธานี', value: 'udonthani' },
    { label: 'อุตรดิตถ์', value: 'uttaradit' },
    { label: 'อุทัยธานี', value: 'uthaithani' },
    { label: 'อุบลราชธานี', value: 'ubonratchathani' },
  ]);

  onSelectionChange(value: any): void {
    this.selectedValue.set(String(value));
  }
}
