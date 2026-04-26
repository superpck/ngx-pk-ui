import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'pk-dg-action',
  templateUrl: './pk-dg-action.component.html',
  styleUrls: ['./pk-dg-action.component.css'],
  standalone: false,
  host: {
    'style': 'display: contents'
  }
})
export class PkDgActionComponent {
  isOpen = false;
  menuPos: { top: number; left: number } = { top: 0, left: 0 };

  toggle(event: MouseEvent) {
    event.stopPropagation();
    const btn = event.currentTarget as HTMLElement;
    const rect = btn.getBoundingClientRect();
    this.menuPos = { top: rect.bottom + 4, left: rect.left };
    this.isOpen = !this.isOpen;
  }

  @HostListener('document:click')
  onDocumentClick() {
    this.isOpen = false;
  }
}
