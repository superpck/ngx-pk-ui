import { Component, signal } from '@angular/core';
import {
  PK_ICONS,
  PkIcon,
  PkIconName,
  PkMaterialSymbolVariant,
  PkMaterialSymbolWeight,
} from 'ngx-pk-ui';

interface IconGroup {
  label: string;
  icons: PkIconName[];
}

interface MaterialIconGroup {
  label: string;
  icons: string[];
}

const ICON_GROUPS: IconGroup[] = [
  { label: 'Navigation & UI',       icons: ['search','menu','close','sort','plus','list','reload'] },
  { label: 'Users & Auth',          icons: ['user','users','profile','login','logout'] },
  { label: 'Location',              icons: ['map','map-point'] },
  { label: 'Files & Documents',     icons: ['folder-close','folder-open','document','report','csv','xls','pdf','text'] },
  { label: 'Charts & Analytics',    icons: ['chart-pie','chart-bar','dashboard','venn'] },
  { label: 'System & Infrastructure', icons: ['database','cog','setting','server','shield'] },
  { label: 'Communication',         icons: ['email','phone'] },
  { label: 'Transfer',              icons: ['upload','download','export','import'] },
  { label: 'Links',                 icons: ['link','unlink'] },
  { label: 'Editing & Actions',     icons: ['pencil','save','trash','eye','eye-off','print'] },
  { label: 'Status',                icons: ['check-mark','check-mark-circle','success','warning','error','question'] },
  { label: 'Time',                  icons: ['clock','calendar','time','wait'] },
  { label: 'Medical & Transport',   icons: ['ambulance','car','car-crash','bed','xray','lab'] },
  { label: 'Social',                icons: ['youtube','facebook','line','telegram','wechat','linkedin'] },
];

const MATERIAL_ICON_GROUPS: MaterialIconGroup[] = [
  {
    label: 'Navigation',
    icons: ['home', 'menu', 'search', 'arrow_back', 'arrow_forward', 'close', 'more_horiz'],
  },
  {
    label: 'Actions',
    icons: ['add', 'edit', 'delete', 'save', 'download', 'upload', 'share'],
  },
  {
    label: 'Status',
    icons: ['check_circle', 'warning', 'error', 'info', 'help', 'notifications', 'task_alt'],
  },
  {
    label: 'Commerce & File',
    icons: ['shopping_cart', 'payments', 'receipt_long', 'folder', 'description', 'print', 'qr_code'],
  },
  {
    label: 'Security & User',
    icons: ['person', 'group', 'login', 'logout', 'lock', 'shield', 'verified_user'],
  },
];

@Component({
  selector: 'app-pk-icon-page',
  imports: [PkIcon],
  templateUrl: './pk-icon-page.html',
})
export class PkIconPage {
  groups = ICON_GROUPS;
  materialGroups = MATERIAL_ICON_GROUPS;
  totalIcons = Object.keys(PK_ICONS).length;

  // Playground controls
  demoName    = signal<PkIconName>('search');
  demoSize    = signal(24);
  demoColor   = signal('#1976d2');
  demoFill    = signal('none');
  demoStroke  = signal(2);

  // Material Symbols demo controls
  materialName    = signal('home');
  materialVariant = signal<PkMaterialSymbolVariant>('outlined');
  materialWeight  = signal<PkMaterialSymbolWeight>(400);
  materialFill    = signal<0 | 1>(0);

  // Click-to-copy
  copied = signal<string | null>(null);

  selectIcon(name: PkIconName) {
    this.demoName.set(name);
    this.copied.set(name);
    setTimeout(() => this.copied.set(null), 1500);
  }

  setSize(e: Event)   { this.demoSize.set(+(e.target as HTMLInputElement).value); }
  setStroke(e: Event) { this.demoStroke.set(+(e.target as HTMLInputElement).value); }
  setColor(e: Event)  { this.demoColor.set((e.target as HTMLInputElement).value); }
  setFill(e: Event)   { this.demoFill.set((e.target as HTMLInputElement).value); }
  resetFill()         { this.demoFill.set('none'); }

  setMaterialName(e: Event) {
    this.materialName.set((e.target as HTMLSelectElement).value);
  }

  setMaterialVariant(e: Event) {
    this.materialVariant.set((e.target as HTMLSelectElement).value as PkMaterialSymbolVariant);
  }

  setMaterialWeight(e: Event) {
    this.materialWeight.set(+(e.target as HTMLInputElement).value as PkMaterialSymbolWeight);
  }

  toggleMaterialFill(e: Event) {
    this.materialFill.set((e.target as HTMLInputElement).checked ? 1 : 0);
  }

  selectMaterialIcon(name: string) {
    this.materialName.set(name);
  }
}
