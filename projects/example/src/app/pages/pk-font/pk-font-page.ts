import { Component } from '@angular/core';

@Component({
  selector: 'app-pk-font-page',
  imports: [],
  templateUrl: './pk-font-page.html',
  styles: [`
    .font-row {
      display: grid;
      grid-template-columns: 220px 1fr;
      gap: 12px;
      align-items: baseline;
      padding: 14px 0;
      border-bottom: 1px solid #f0f0f0;
    }
    .font-row:last-child { border-bottom: none; }
    .font-meta { display: flex; flex-direction: column; gap: 4px; }
    .font-class { font-size: 0.75rem; color: #888; font-family: monospace; }
    .font-name  { font-size: 0.85rem; font-weight: 600; color: #555; }
    .font-sample { font-size: 20px; line-height: 1.5; color: #222; }
    .font-weights { display: flex; gap: 16px; flex-wrap: wrap; margin-top: 4px; }
    .font-weights span { font-size: 13px; color: #666; }
    .section-note { font-size: 13px; color: #888; margin: 0 0 16px; padding: 8px 12px; background: #f9f9f9; border-radius: 4px; border-left: 3px solid #e0e0e0; }
  `],
})
export class PkFontPage {
  thaiText = 'สวัสดีครับ ยินดีต้อนรับ 0123456789 ๑๒๓๔๕๖๗๘๙๐ ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  laoText = 'ສະບາຍດີ ຍິນດີຕ້ອນຮັບ 0123456789 ໐໑໒໓໔໕໖໗໘໙໐ ABCDEFGHIJKLMNOPQRSTUVWXYZ';
}
