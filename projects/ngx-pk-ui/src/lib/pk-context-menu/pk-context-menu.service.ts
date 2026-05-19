import {
  ApplicationRef,
  createComponent,
  EnvironmentInjector,
  inject,
  Injectable,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import type {
  PkContextMenuItem,
  PkContextMenuLayout,
  PkContextMenuSelectEvent,
  PkContextMenuTheme,
} from './pk-context-menu.model';
import type { PkContextMenuPanel } from './pk-context-menu-panel';

export interface PkContextMenuShowConfig {
  items: PkContextMenuItem[];
  layout: PkContextMenuLayout;
  theme: PkContextMenuTheme;
  x: number;
  y: number;
  onSelectedFn: ((e: PkContextMenuSelectEvent) => void) | null;
}

@Injectable({ providedIn: 'root' })
export class PkContextMenuService {
  private _panel: PkContextMenuPanel | null = null;

  constructor() {
    if (!isPlatformBrowser(inject(PLATFORM_ID))) return;

    const appRef   = inject(ApplicationRef);
    const injector = inject(EnvironmentInjector);

    // Lazy import breaks potential circular reference at parse time
    import('./pk-context-menu-panel').then(({ PkContextMenuPanel }) => {
      try {
        const ref = createComponent(PkContextMenuPanel, { environmentInjector: injector });
        appRef.attachView(ref.hostView);
        document.body.appendChild(ref.location.nativeElement);
        this._panel = ref.instance;
      } catch {
        // Injector destroyed before async import resolved (e.g., tests)
      }
    });
  }

  show(config: PkContextMenuShowConfig): void {
    this._panel?.show(
      config.x,
      config.y,
      config.items,
      config.layout,
      config.theme,
      config.onSelectedFn,
    );
  }

  hide(): void {
    this._panel?.hide();
  }
}
