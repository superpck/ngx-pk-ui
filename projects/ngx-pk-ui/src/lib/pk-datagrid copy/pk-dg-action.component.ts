import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'pk-dg-action',
  templateUrl: './pk-dg-action.component.html',
  styleUrls: ['./pk-dg-action.component.scss'],
  standalone: false,
  host: {
    'style': 'display: contents'
  }
})
export class PkDgActionComponent {
  isOpen = false;
  menuPos: { top: number; left: number } = { top: 0, left: 0 };
  private skipNextClose = false;

  toggle(event: MouseEvent) {
    const btn = event.currentTarget as HTMLElement;
    const rect = btn.getBoundingClientRect();
    this.menuPos = { top: rect.bottom + 4, left: rect.left };
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.skipNextClose = true;
    }
  }

  @HostListener('document:click')
  onDocumentClick() {
    if (this.skipNextClose) {
      this.skipNextClose = false;
      return;
    }
    this.isOpen = false;
  }
}
