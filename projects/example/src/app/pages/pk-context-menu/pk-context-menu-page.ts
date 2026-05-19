import { Component, inject, signal } from '@angular/core';
import { PkContextMenuDirective, PkToastrService } from 'ngx-pk-ui';
import type {
  PkContextMenuItem,
  PkContextMenuLayout,
  PkContextMenuSelectEvent,
  PkContextMenuTheme,
} from 'ngx-pk-ui';

interface TableRow {
  id: number;
  name: string;
  role: string;
  status: string;
}

@Component({
  selector: 'app-pk-context-menu-page',
  standalone: true,
  imports: [PkContextMenuDirective],
  templateUrl: './pk-context-menu-page.html',
})
export class PkContextMenuPage {
  toastr = inject(PkToastrService);
  theme  = signal<PkContextMenuTheme>('light');
  layout = signal<PkContextMenuLayout>('vertical');

  readonly themes: PkContextMenuTheme[]  = ['light', 'dark', 'green', 'blue', 'orange', 'red', 'magenta'];
  readonly layouts: PkContextMenuLayout[] = ['vertical', 'horizontal'];

  lastEvent = signal<string>('—');

  rows: TableRow[] = [
    { id: 1, name: 'Alice Johnson',  role: 'Admin',    status: 'Active'   },
    { id: 2, name: 'Bob Smith',      role: 'Editor',   status: 'Active'   },
    { id: 3, name: 'Carol Davis',    role: 'Viewer',   status: 'Inactive' },
    { id: 4, name: 'David Lee',      role: 'Editor',   status: 'Active'   },
    { id: 5, name: 'Eva Martinez',   role: 'Admin',    status: 'Pending'  },
  ];

  tableMenu: PkContextMenuItem[] = [
    { id: 1,   title: 'View details',  icon: 'visibility' },
    { id: 2,   title: 'Edit',          icon: 'edit' },
    { separator: true },
    { id: 3, title: 'Delete',        icon: 'delete' },
  ];

  cardMenu: PkContextMenuItem[] = [
    { id: 1,    title: 'Copy link',    icon: 'content_copy' },
    { id: 2,    title: 'Share',        icon: 'share' },
    { id: 3,    title: 'Star item',    icon: 'star' },
    { separator: true },
    { id: 4,    title: 'Report',       icon: 'flag',  disabled: true },
    { id: 5,    title: 'Archive',      icon: 'archive' },
  ];

  onSelect(event: PkContextMenuSelectEvent): void {
    this.lastEvent.set(`"${event.item.title}" selected, id: ${event.item.id}`);
    this.toastr.info(`You selected "${event.item.title}" (id: ${event.item.id})`);
  }
}
