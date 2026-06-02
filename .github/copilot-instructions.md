# ngx-pk-ui — Copilot Instructions

## What this repo is

An **Angular 21 component library** (`ngx-pk-ui`) published to npm for other teams to install and use.
All library source lives under `projects/ngx-pk-ui/src/lib/`. The public API is declared in `projects/ngx-pk-ui/src/public-api.ts`.

## Commands

```bash
# Build the library (outputs to dist/ngx-pk-ui)
ng build ngx-pk-ui
npm run build:lib          # alias

# Serve the example app (builds lib first, then opens browser)
npm run start:example      # runs: ng build ngx-pk-ui --watch & ng serve example --open

# Run all tests (Vitest, headless)
ng test ngx-pk-ui --no-watch

# Run a single test file
npx vitest run projects/ngx-pk-ui/src/lib/pk-accordion/pk-accordion.spec.ts

# Publish to npm (run after build)
npm publish dist/ngx-pk-ui
```

## Architecture

```
projects/
  ngx-pk-ui/               ← the published library
    src/
      public-api.ts        ← everything exported from here is part of the public API
      lib/
        pk-accordion/
          pk-accordion-item.ts  ← child component: one collapsible panel (content projection)
          pk-accordion.ts       ← parent container: single/multi-open mode via signals
          pk-accordion.html / .css / .spec.ts
        pk-breadcrumb/
          pk-breadcrumb.model.ts  ← PkBreadcrumbItem, PkBreadcrumbSeparator, PkBreadcrumbSize types
          pk-breadcrumb.ts        ← standalone component: items input, (itemClick)/(itemDblClick) outputs
          pk-breadcrumb.html / .css
        pk-tabs/                  ← NgModule-based (not standalone) — import PkTabsModule
          pk-tab/
            pk-tab.component.ts        ← PkTabComponent — one tab pane (standalone: false)
            pk-tab-body.component.ts   ← PkTabBodyComponent — body content slot
            pk-tab-title.component.ts  ← PkTabTitleComponent — custom title slot
          pk-tabs/
            pk-tabs.component.ts       ← PkTabsComponent — tab container
            pk-tabs.component.html / .scss
          pk-tabs.module.ts            ← PkTabsModule — exports all 4 components
        pk-tabs-old/              ← old standalone/signals version (pending deletion, not exported)
        pk-timeline/
          pk-timeline-item.ts   ← child component: one event dot/label (standalone)
          pk-timeline.ts        ← parent container: direction/lineStyle via signals (standalone)
          pk-timeline-item.css / pk-timeline.css
        pk-toastr/
          pk-toastr.model.ts    ← Toast, ToastType, ToastPosition, ToastOptions interfaces/types
          pk-toastr.service.ts  ← injectable service: success/error/info/warning/dismiss/clear (auto-mounts to body)
          pk-toastr.ts          ← component that renders the toast container (add once to AppComponent)
          pk-toastr.html / .css / .spec.ts
        pk-alert/
          pk-alert.model.ts     ← AlertType, AlertInputType, AlertConfig, AlertSlot interfaces
          pk-alert.service.ts   ← injectable service: success/warn/error/confirm/input → Promise
          pk-alert.ts           ← modal overlay component (add once to AppComponent)
          pk-alert.html / .css / .spec.ts
        pk-modal/
          pk-modal.model.ts     ← PkModalSize type alias
          pk-modal-header.ts    ← slot component — bold header, bottom border
          pk-modal-body.ts      ← slot component — scrollable body
          pk-modal-footer.ts    ← slot component — right-aligned flex footer
          pk-modal.ts           ← main component: openModal/size/blur/closeAble/customClass/customStyle/(onClose)
          pk-modal.html / .css / .spec.ts
        pk-icon/
          pk-icon.model.ts      ← PkIconModel type
          pk-icon.ts            ← SVG icon component + Material Symbols mode
        pk-datagrid/            ← NgModule-based datagrid (sort, filter, resize, pagination, row detail)
        pk-datepicker/          ← Datepicker with PkLocale support (17 locales), range, clear
        pk-progress/            ← Line/circle progress with status variants
        pk-treeview/            ← Hierarchical tree (NgModule-based)
        pk-select/              ← Single/multi select with optional search
        pk-autocomplete/        ← Local/async autocomplete input
        pk-typeahead/           ← Typeahead input with keyboard navigation
        pk-tooltip/             ← Hover tooltip (CSS-driven + Angular component)
        pk-calendar/
          pk-calendar.model.ts  ← all types: PkCalendarEvent, PkCalendarView, PkEventType, PkEventPriority, PkCalendarAttachment, PkEventMoveResult
          pk-calendar-form.ts   ← internal form component (NOT exported from public-api)
          pk-calendar-form.html / .css
          pk-calendar.ts        ← main standalone component: Year/Month/Week/Day/Agenda views
          pk-calendar.html / .css
        pk-file-upload/
          pk-file-upload.model.ts  ← PkUploadFile, PkUploadPreviewType, PkFileUploadPreviewSize
          pk-file-upload.ts        ← standalone component: drag & drop, browser-native preview, upload button
          pk-file-upload.html / .css / .spec.ts
        pk-sidenav/
          pk-sidenav.model.ts   ← PkSidenavGroup, PkSidenavItem (incl. `fn?`), PkSidenavTheme, PkSidenavMode, PkSidenavPosition, PkSidenavThemeConfig
          pk-sidenav.ts         ← standalone component: left/right, full/icon/auto, multi-level, 10 themes, CSS-variable override; `fn` callback support; body scroll fix
          pk-sidenav.html / .css
        pk-input-password/
          pk-input-password.ts  ← standalone component: show/hide toggle, ControlValueAccessor, optional strength meter
          pk-input-password.html / .css
        pk-barcode/
          pk-barcode.model.ts   ← PkBarcodeFormat type alias
          pk-barcode-encoder.ts ← pure TS encoder: Code128 / Code39 / EAN-13 / EAN-8
          pk-barcode.ts         ← standalone component: inline SVG, downloadSvg/downloadPng
          pk-barcode.html / .css / .spec.ts
        pk-qrcode/
          pk-qrcode.model.ts    ← PkQrEcLevel type alias
          pk-qrcode-tables.ts   ← static lookup tables (capacity, EC params, alignment, remainder)
          pk-qrcode-rs.ts       ← Reed-Solomon GF(256) encoder
          pk-qrcode-encoder.ts  ← full QR matrix encoder (mode, version, data, masking, format info)
          pk-qrcode.ts          ← standalone component: inline SVG, center logo, downloadSvg/downloadPng
          pk-qrcode.html / .css / .spec.ts
        pk-code-reader/
          pk-code-reader.model.ts  ← PkCodeFormat, PkCodeScanResult, PkCodeReaderError; ambient BarcodeDetector declarations
          pk-code-reader.ts        ← standalone component: camera, upload, paste; BarcodeDetector; canvas overlay; AudioContext beep
          pk-code-reader.html / .css / .spec.ts
        pk-otp/
          pk-otp.model.ts       ← PkOtpType, PkOtpSize
          pk-otp.ts             ← standalone component: OTP/PIN cells, ControlValueAccessor, mask, keyboard nav, paste
          pk-otp.html / .css / .spec.ts
        pk-export/
          pk-export.model.ts        ← PkExportFormat, PkCsvOptions, PkTsvOptions, PkJsonOptions, PkXmlOptions, PkHtmlOptions, PkTextOptions, PkXlsxOptions, PkExportButtonItem
          pk-export-encoders.ts     ← toCsv / toTsv / toJson / toXml / toHtml / toText — pure TS, zero deps
          pk-export-xlsx.ts         ← toXlsx — ZIP STORE SpreadsheetML encoder (no CompressionStream)
          pk-export-download.ts     ← downloadFile() — Blob + URL.createObjectURL download
          pk-export.service.ts      ← PkExportService (providedIn: 'root') — csv/tsv/json/xml/xlsx/html/text methods
          pk-export-button.ts       ← PkExportButton standalone component (dropdown UI)
          pk-export-button.html / .css
          pk-export.service.spec.ts / pk-export-button.spec.ts
    src/styles/
      pk-ui.css                   ← single entry point — @imports all modules below
      pk-grid.css                 ← responsive 12-column grid
      pk-btn.css                  ← button variants and groups
      pk-spinner.css              ← loading spinners
      pk-badge.css                ← badges and dot indicators
      pk-card.css                 ← card layouts
      pk-table.css                ← styled tables (striped, hover, bordered, color variants)
      pk-toggle.css               ← CSS-only toggle switch (replaces <input type="checkbox">)
      pk-breadcrumb.css           ← breadcrumb nav
      pk-icon-font.css            ← Material Symbols font classes
      pk-tooltip.css              ← tooltip styles
      pk-form.css                 ← floating label fields (input/select/textarea), prefix/suffix, group layout
      pk-layout.css               ← fixed top navbar + sidebar layout shell (CSS variables, responsive)
      pk-divider.css              ← horizontal/vertical dividers with optional label
      pk-float-btn.css            ← floating action button utility with position/color variants
      pk-font.css                 ← Google Fonts helper classes (Latin, Thai, Lao) (opt-in — NOT in pk-ui.css)
  example/                 ← local dev/test app (gitignored, never published)
    src/app/
      app.ts / app.html / app.css  ← shell: dark sidebar nav + RouterOutlet + PkToastr + PkAlert
      app.routes.ts                ← lazy-loaded routes for each component/CSS section
      pages/
        Components: home/ pk-accordion/ pk-tabs/ pk-toastr/ pk-alert/ pk-modal/
                    pk-icon/ pk-datagrid/ pk-datepicker/ pk-progress/ pk-treeview/
                    pk-select/ pk-autocomplete/ pk-typeahead/ pk-tooltip/ pk-timeline/ pk-calendar/
                    pk-file-upload/ pk-sidenav/ pk-markdown-viewer/ pk-heatmap/ pk-input-password/
                    pk-split/ pk-textarea/ pk-barcode/ pk-qrcode/ pk-code-reader/
        CSS pages:  pk-grid/ pk-btn/ pk-spinner/ pk-badge/ pk-card/
                    pk-table/ pk-toggle/ pk-breadcrumb/ pk-float-btn/ pk-font/ pk-form/ pk-layout/
        Example pages: examples/login/   ← login-example.ts/html/css — full-bleed card, form, password strength
                       examples/chat/    ← chat-example.ts/html/css — icon sidenav, conversation list, message pane
                       examples/dashboard/ ← dashboard-example.ts/html/css — pk-sidenav + topbar + stat cards + placeholder cards
```

`dist/ngx-pk-ui/` is the build output consumed by npm. Never edit files there.
`projects/example/` is gitignored — it is only for local visual testing.

## Key conventions

### Angular 21 patterns used throughout
- **Signals** (`signal()`, `input()`, `contentChildren()`, `viewChild()`) — no `@Input`/`@Output` decorators.
- **`input.required<T>()`** for required component inputs.
- **`contentChildren(Token)`** (not `@ContentChildren`) for querying projected content.
- **Standalone components only** — no NgModules for new components. Exception: `pk-tabs`, `pk-datagrid`, `pk-treeview` use NgModule pattern (copied from existing projects or legacy) — import their `*Module` class instead.
- **`inject()`** instead of constructor injection.
- **`@for` / `@if` control flow blocks** — not `*ngFor` / `*ngIf` directives.

### Adding a new component
1. `ng generate component <name> --project=ngx-pk-ui`
2. Change the selector from `lib-<name>` to `pk-<name>`.
3. Export it from `public-api.ts`.
4. Write a `.spec.ts` alongside the component (Vitest, no `fakeAsync` — use `vi.useFakeTimers()` instead).

### Tests
- Test runner is **Vitest** (Angular 21 default). Do **not** use `fakeAsync`/`tick` from `@angular/core/testing` — import `vi` from `vitest` and use `vi.useFakeTimers()` / `vi.advanceTimersByTime()` instead.
- DOM tests use a `TestHostComponent` wrapper to test components through real content projection.

### CSS
- Each component has a co-located `.css` file (no global styles, no preprocessor).
- Class names follow BEM: `.pk-tabs__nav-item--active`.

### Versioning & publishing
- The library's own `package.json` is at `projects/ngx-pk-ui/package.json`. Bump version there before publishing.
- `peerDependencies` must stay in sync with the Angular version of the workspace (`package.json` → `@angular/core`).
- When Angular releases a new major version, update `peerDependencies` in `projects/ngx-pk-ui/package.json` and rebuild.

---

## Component API reference

### pk-breadcrumb

Standalone component — wraps the `pk-breadcrumb` CSS with Angular event support.

```ts
import { PkBreadcrumb } from 'ngx-pk-ui';
import type { PkBreadcrumbItem, PkBreadcrumbSeparator, PkBreadcrumbSize } from 'ngx-pk-ui';

@Component({
  imports: [PkBreadcrumb],
})
```

```html
<pk-breadcrumb
  [items]="crumbs"
  separator="arrow"
  size="md"
  [bg]="false"
  (itemClick)="onItemClick($event)"
  (itemDblClick)="onItemDblClick($event)"
/>
```

**`PkBreadcrumb` inputs / outputs:**
| Input/Output | Type | Default | Description |
|---|---|---|---|
| `items` | `PkBreadcrumbItem[]` | `[]` | Breadcrumb item array |
| `separator` | `'default'\|'slash'\|'dot'\|'arrow'` | `'default'` | Separator character between items |
| `size` | `'sm'\|'md'\|'lg'` | `'md'` | Font size preset |
| `bg` | `boolean` | `false` | Grey pill background with border |
| `(itemClick)` | `PkBreadcrumbItem` | — | Emits when a non-active, non-disabled item is clicked |
| `(itemDblClick)` | `PkBreadcrumbItem` | — | Emits on double-click |

**`PkBreadcrumbItem` interface:**
| Property | Type | Description |
|---|---|---|
| `label` | `string` | Display text |
| `key` | `string?` | Identifier returned in click events |
| `route` | `string\|any[]?` | Router commands — renders `<a [routerLink]>` |
| `href` | `string?` | URL — renders `<a [href]>` |
| `hrefTarget` | `'_blank'\|'_self'?` | Link target. Default `'_self'` |
| `disabled` | `boolean?` | Prevents click/dblclick |

**Rendering rules:**
- **Last item** — always rendered as plain text (active state, not clickable)
- `route` set → `<a [routerLink]>` with `routerLinkActive`
- `href` set → `<a [href]>`
- Neither → `<button>` styled as link (click fires without page navigation)

**CSS-only usage** (still supported — no component needed):
```html
<nav class="pk-breadcrumb pk-breadcrumb--slash">
  <ol class="pk-breadcrumb-list">
    <li class="pk-breadcrumb-item"><a routerLink="/">Home</a></li>
    <li class="pk-breadcrumb-item pk-breadcrumb-item--active">Current</li>
  </ol>
</nav>
```

---

### pk-tabs

Uses **NgModule** pattern — import `PkTabsModule` (not standalone). Uses `*ngFor` / `*ngTemplateOutlet` internally.

```ts
// In consuming NgModule or standalone component
import { PkTabsModule } from 'ngx-pk-ui';

@Component({
  imports: [PkTabsModule],
})
```

```html
<pk-tabs>
  <pk-tab>
    <pk-tab-title>Profile</pk-tab-title>
    <pk-tab-body>
      <p>Profile content here</p>
    </pk-tab-body>
  </pk-tab>

  <pk-tab [active]="true">
    <pk-tab-title>Settings</pk-tab-title>
    <pk-tab-body>
      <p>Settings content — active by default</p>
    </pk-tab-body>
  </pk-tab>

  <pk-tab [disabled]="true">
    <pk-tab-title>Disabled</pk-tab-title>
    <pk-tab-body><p>Never shown</p></pk-tab-body>
  </pk-tab>
</pk-tabs>
```

**`PkTabsComponent` inputs / outputs:**
| Input/Output | Type | Default | Description |
|---|---|---|---|
| `overflow` | `'scrollx'\|'newline'` | `'scrollx'` | Tab overflow behaviour |
| `customClass` | `string` | `''` | Extra CSS class on container |
| `customStyle` | `object` | `{}` | Inline styles on container |
| `style` | `string` | `''` | Raw style string |
| `(onSelectTab)` | `number` | — | Emits index of selected tab |

**`PkTabComponent` inputs:**
| Input | Type | Default | Description |
|---|---|---|---|
| `active` | `boolean` | `false` | Activate this tab on init |
| `disabled` | `boolean` | `false` | Prevent tab from being selected |
| `customClass` | `string` | `''` | Extra CSS class |
| `customStyle` | `object` | `{}` | Inline styles |
| `style` | `string` | `''` | Raw style string |

**`PkTabTitleComponent`** — title slot inside `<pk-tab>`. Supports `customClass`, `customStyle`, `style`. Emits `(tabClick)`.

**`PkTabBodyComponent`** — body content slot inside `<pk-tab>`. Supports `customClass`, `customStyle`.

### pk-toastr

`PkToastrService` automatically mounts the toast container into `document.body` on first inject — no `<pk-toastr>` tag needed in templates.

```ts
// any component or service
import { PkToastrService } from 'ngx-pk-ui';

@Component({ imports: [] })
export class MyComponent {
  toastr = inject(PkToastrService);

  save() {
    this.toastr.success('Saved!', 'Success');
    this.toastr.error('Failed', 'Error', { duration: 0 });           // persist
    this.toastr.warning('Check your input');
    this.toastr.info('Loading…', undefined, { duration: 8000, position: 'bottom-right' });
    this.toastr.success('Done!', undefined, { progress: true });     // show progress bar
  }
}
```

**`PkToastrService` methods:**
| Method | Signature |
|--------|-----------|
| `success` | `(message, title?, options?: ToastOptions) => void` |
| `error` | `(message, title?, options?: ToastOptions) => void` |
| `info` | `(message, title?, options?: ToastOptions) => void` |
| `warning` | `(message, title?, options?: ToastOptions) => void` |
| `dismiss` | `(id: number) => void` |
| `clear` | `() => void` |
| `show` | `(type, message, title?, options?: ToastOptions) => void` |

**`ToastOptions`:**
| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `duration` | `number` | `4000` | Auto-dismiss (ms). `0` = persist |
| `position` | `ToastPosition` | `'top-right'` | One of 9 positions |
| `progress` | `boolean` | `false` | Show countdown progress bar |

**`ToastPosition`** values: `top-left` · `top-center` · `top-right` · `center-left` · `center-center` · `center-right` · `bottom-left` · `bottom-center` · `bottom-right`

Default `duration` is **4000 ms**. Pass `0` to keep toast until manually dismissed.

---

### pk-timeline

Uses **content projection** — `<pk-timeline-item>` children are discovered via `contentChildren()`.

```ts
import { PkTimeline, PkTimelineItem } from 'ngx-pk-ui';

@Component({
  imports: [PkTimeline, PkTimelineItem],
})
```

```html
<!-- Vertical (default) -->
<pk-timeline>
  <pk-timeline-item label="16 Oct" sublabel="09:15" icon="check_circle" [active]="true" dotColor="#10b981">
    <p>Event content here</p>
  </pk-timeline-item>
  <pk-timeline-item label="15 Oct" image="https://example.com/avatar.jpg">
    <p>Event with avatar photo</p>
  </pk-timeline-item>
</pk-timeline>

<!-- Horizontal + dashed -->
<pk-timeline direction="horizontal" lineStyle="dashed">
  <pk-timeline-item label="Step 1" icon="shopping_cart" [active]="true">...</pk-timeline-item>
  <pk-timeline-item label="Step 2" icon="local_shipping">...</pk-timeline-item>
  <pk-timeline-item label="Step 3" icon="check_circle">...</pk-timeline-item>
</pk-timeline>
```

**`PkTimeline` inputs:**
| Input | Type | Default | Description |
|---|---|---|---|
| `direction` | `'vertical'\|'horizontal'` | `'vertical'` | Layout direction |
| `lineStyle` | `'solid'\|'dashed'` | `'solid'` | Connecting line style |

**`PkTimelineItem` inputs:**
| Input | Type | Default | Description |
|---|---|---|---|
| `label` | `string` | `''` | Date / step name beside dot |
| `sublabel` | `string` | `''` | Secondary label line |
| `icon` | `string` | `''` | Material Symbols icon name |
| `image` | `string` | `''` | Avatar/photo URL (circular, overrides icon) |
| `dotColor` | `string` | `''` | CSS color override for dot |
| `active` | `boolean` | `false` | Filled dot; icon turns white |

Dot rendering priority: `image` > `icon` > empty bordered circle.

---

### pk-accordion

Uses **content projection** — `<pk-accordion-item>` children are discovered via `contentChildren()`.

```ts
import { PkAccordion, PkAccordionItem } from 'ngx-pk-ui';

@Component({
  imports: [PkAccordion, PkAccordionItem],
})
```

```html
<!-- Single-open (default) -->
<pk-accordion>
  <pk-accordion-item label="Section 1">Content goes here.</pk-accordion-item>
  <pk-accordion-item label="Section 2" [open]="true">Starts expanded.</pk-accordion-item>
  <pk-accordion-item label="Disabled" [disabled]="true">Cannot open.</pk-accordion-item>
</pk-accordion>

<!-- Multi-open -->
<pk-accordion [multi]="true">
  <pk-accordion-item label="A">...</pk-accordion-item>
  <pk-accordion-item label="B">...</pk-accordion-item>
</pk-accordion>
```

| Input | Component | Type | Default | Description |
|-------|-----------|------|---------|-------------|
| `multi` | `PkAccordion` | `boolean` | `false` | Allow multiple panels open simultaneously |
| `label` | `PkAccordionItem` | `string` | required | Panel header text |
| `open` | `PkAccordionItem` | `boolean` | `false` | Expand on init |
| `disabled` | `PkAccordionItem` | `boolean` | `false` | Prevent toggling |

---

## Exported public symbols

Everything in `projects/ngx-pk-ui/src/public-api.ts`:

| Symbol | Kind | File |
|--------|------|------|
| `PkAccordionItem` | Component | `pk-accordion/pk-accordion-item` |
| `PkAccordion` | Component | `pk-accordion/pk-accordion` |
| `PkBreadcrumbItem` | Interface | `pk-breadcrumb/pk-breadcrumb.model` |
| `PkBreadcrumbSeparator` | Type alias | `pk-breadcrumb/pk-breadcrumb.model` |
| `PkBreadcrumbSize` | Type alias | `pk-breadcrumb/pk-breadcrumb.model` |
| `PkBreadcrumb` | Component | `pk-breadcrumb/pk-breadcrumb` |
| `PkTimelineItem` | Component | `pk-timeline/pk-timeline-item` |
| `PkTimeline` | Component | `pk-timeline/pk-timeline` |
| `PkTabComponent` | Component | `pk-tabs/pk-tab/pk-tab.component` |
| `PkTabBodyComponent` | Component | `pk-tabs/pk-tab/pk-tab-body.component` |
| `PkTabTitleComponent` | Component | `pk-tabs/pk-tab/pk-tab-title.component` |
| `PkTabsComponent` | Component | `pk-tabs/pk-tabs/pk-tabs.component` |
| `PkTabsModule` | NgModule | `pk-tabs/pk-tabs.module` |
| `Toast` | Interface | `pk-toastr/pk-toastr.model` |
| `ToastType` | Type alias | `pk-toastr/pk-toastr.model` |
| `ToastPosition` | Type alias | `pk-toastr/pk-toastr.model` |
| `ToastOptions` | Interface | `pk-toastr/pk-toastr.model` |
| `PkToastrService` | Injectable service | `pk-toastr/pk-toastr.service` |
| `PkToastr` | Component | `pk-toastr/pk-toastr` |
| `AlertType` | Type alias | `pk-alert/pk-alert.model` |
| `AlertInputType` | Type alias | `pk-alert/pk-alert.model` |
| `AlertConfig` | Interface | `pk-alert/pk-alert.model` |
| `AlertSlot` | Interface | `pk-alert/pk-alert.model` |
| `AlertResult` | Type alias | `pk-alert/pk-alert.model` |
| `PkAlertService` | Injectable service | `pk-alert/pk-alert.service` |
| `PkAlert` | Component | `pk-alert/pk-alert` |
| `PkModalSize` | Type alias | `pk-modal/pk-modal.model` |
| `PkModalHeader` | Component | `pk-modal/pk-modal-header` |
| `PkModalBody` | Component | `pk-modal/pk-modal-body` |
| `PkModalFooter` | Component | `pk-modal/pk-modal-footer` |
| `PkModal` | Component | `pk-modal/pk-modal` |
| `PkModalModule` | NgModule | `pk-modal/pk-modal.module` |
| `PkIconModel` | Type alias | `pk-icon/pk-icon.model` |
| `PkIcon` | Component | `pk-icon/pk-icon` |
| `PkDatagridModule` | NgModule | `pk-datagrid/pk-datagrid.module` |
| `PkDatagridComponent` | Component | `pk-datagrid/pk-datagrid.component` |
| `PkDatepickerComponent` | Component | `pk-datepicker/pk-datepicker.component` |
| `PkProgressComponent` | Component | `pk-progress/pk-progress.component` |
| `PkTreeviewModule` | NgModule | `pk-treeview/pk-treeview.module` |
| `PkTreeviewComponent` | Component | `pk-treeview/pk-treeview.component` |
| `PkUploadFile` | Interface | `pk-file-upload/pk-file-upload.model` |
| `PkUploadPreviewType` | Type alias | `pk-file-upload/pk-file-upload.model` |
| `PkFileUploadPreviewSize` | Type alias | `pk-file-upload/pk-file-upload.model` |
| `PkFileUpload` | Component | `pk-file-upload/pk-file-upload` |
| `PkSidenavGroup` | Interface | `pk-sidenav/pk-sidenav.model` |
| `PkSidenavItem` | Interface | `pk-sidenav/pk-sidenav.model` |
| `PkSidenavTheme` | Type alias | `pk-sidenav/pk-sidenav.model` |
| `PkSidenavMode` | Type alias | `pk-sidenav/pk-sidenav.model` |
| `PkSidenavPosition` | Type alias | `pk-sidenav/pk-sidenav.model` |
| `PkSidenavThemeConfig` | Interface | `pk-sidenav/pk-sidenav.model` |
| `PkSidenav` | Component | `pk-sidenav/pk-sidenav` |
| `PkMarkdownTheme` | Type alias | `pk-markdown-viewer/pk-markdown-viewer.model` |
| `parseMarkdown` | Function | `pk-markdown-viewer/pk-markdown-parser` |
| `buildHtmlDocument` | Function | `pk-markdown-viewer/pk-markdown-parser` |
| `PkMarkdownViewer` | Component | `pk-markdown-viewer/pk-markdown-viewer` |
| `PkLocale` | Type alias | `pk-locale/pk-locale.model` |
| `PkLocaleData` | Interface | `pk-locale/pk-locale.model` |
| `PK_LOCALE_DATA` | Constant | `pk-locale/pk-locale.model` |
| `getPkLocaleData` | Function | `pk-locale/pk-locale.model` |
| `PkHeatmapDay` | Interface | `pk-heatmap/pk-heatmap.model` |
| `PkHeatmapColorScheme` | Type alias | `pk-heatmap/pk-heatmap.model` |
| `PkHeatmapLocale` | Type alias | `pk-heatmap/pk-heatmap.model` |
| `PkHeatmapCell` | Interface | `pk-heatmap/pk-heatmap.model` |
| `PkHeatmap` | Component | `pk-heatmap/pk-heatmap` |
| `PkInputPassword` | Component | `pk-input-password/pk-input-password` |
| `PkSplitDirection` | Type alias | `pk-split/pk-split.model` |
| `PkSplitPanel` | Component | `pk-split/pk-split-panel` |
| `PkSplit` | Component | `pk-split/pk-split` |
| `PkBarcodeFormat` | Type alias | `pk-barcode/pk-barcode.model` |
| `PkBarcode` | Component | `pk-barcode/pk-barcode` |
| `PkQrEcLevel` | Type alias | `pk-qrcode/pk-qrcode.model` |
| `PkQrcode` | Component | `pk-qrcode/pk-qrcode` |
| `PkCodeFormat` | Type alias | `pk-code-reader/pk-code-reader.model` |
| `PkCodeScanResult` | Interface | `pk-code-reader/pk-code-reader.model` |
| `PkCodeReaderError` | Type alias | `pk-code-reader/pk-code-reader.model` |
| `PkCodeReader` | Component | `pk-code-reader/pk-code-reader` |
| `PkTimeFormat` | Type alias | `pk-timepicker/pk-timepicker.model` |
| `PkTimeType` | Type alias | `pk-timepicker/pk-timepicker.model` |
| `PkTimeInputType` | Type alias | `pk-timepicker/pk-timepicker.model` |
| `PkTimepicker` | Component | `pk-timepicker/pk-timepicker` |
| `PkContextMenuLayout` | Type alias | `pk-context-menu/pk-context-menu.model` |
| `PkContextMenuTheme` | Type alias | `pk-context-menu/pk-context-menu.model` |
| `PkContextMenuItem` | Interface | `pk-context-menu/pk-context-menu.model` |
| `PkContextMenuSelectEvent` | Interface | `pk-context-menu/pk-context-menu.model` |
| `PkContextMenuShowConfig` | Interface | `pk-context-menu/pk-context-menu.service` |
| `PkContextMenuService` | Injectable service | `pk-context-menu/pk-context-menu.service` |
| `PkContextMenuDirective` | Directive | `pk-context-menu/pk-context-menu.directive` |
| `PkTimeFormat` | Type alias | `pk-timepicker/pk-timepicker.model` |
| `PkTimeType` | Type alias | `pk-timepicker/pk-timepicker.model` |
| `PkTimeInputType` | Type alias | `pk-timepicker/pk-timepicker.model` |
| `PkTimepicker` | Component | `pk-timepicker/pk-timepicker` |
| `PkDatePipe` | Pipe | `pk-pipes/pk-date.pipe` |
| `parseBEDate` | Function | `pk-pipes/pk-date.pipe` |
| `PkOtpType` | Type alias | `pk-otp/pk-otp.model` |
| `PkOtpSize` | Type alias | `pk-otp/pk-otp.model` |
| `PkOtp` | Component | `pk-otp/pk-otp` |
| `PkExportFormat` | Type alias | `pk-export/pk-export.model` |
| `PkCsvOptions` | Interface | `pk-export/pk-export.model` |
| `PkTsvOptions` | Interface | `pk-export/pk-export.model` |
| `PkJsonOptions` | Interface | `pk-export/pk-export.model` |
| `PkXmlOptions` | Interface | `pk-export/pk-export.model` |
| `PkHtmlOptions` | Interface | `pk-export/pk-export.model` |
| `PkTextOptions` | Interface | `pk-export/pk-export.model` |
| `PkXlsxOptions` | Interface | `pk-export/pk-export.model` |
| `PkExportButtonItem` | Interface | `pk-export/pk-export.model` |
| `toCsv` | Function | `pk-export/pk-export-encoders` |
| `toTsv` | Function | `pk-export/pk-export-encoders` |
| `toJson` | Function | `pk-export/pk-export-encoders` |
| `toXml` | Function | `pk-export/pk-export-encoders` |
| `toHtml` | Function | `pk-export/pk-export-encoders` |
| `toText` | Function | `pk-export/pk-export-encoders` |
| `toXlsx` | Function | `pk-export/pk-export-xlsx` |
| `downloadFile` | Function | `pk-export/pk-export-download` |
| `PkExportService` | Injectable service | `pk-export/pk-export.service` |
| `PkExportButton` | Component | `pk-export/pk-export-button` |

---

## Known gotchas (discovered during initial build)

- **`PkTab` must NOT be in `PkTabs.imports[]`** — Angular 21 warns "not used within the template" because `PkTab` is only consumed via `contentChildren()`, not rendered directly in the template. Keep it only in the spec's `TestHostComponent.imports[]`.
- **No `fakeAsync` in Vitest** — Angular 21 uses Vitest as the test runner (not Karma). `fakeAsync`/`tick` from `@angular/core/testing` throw a zone error. Use `vi.useFakeTimers()` / `vi.advanceTimersByTime(ms)` / `vi.useRealTimers()` from `vitest` instead.
- **`ng new` creates a subdirectory** — `ng new <name>` always nests files. When creating the workspace in the repo root, files need to be moved up manually.
- **Browser flag removed** — `ng test --browsers=ChromeHeadless` fails; Vitest uses its own browser provider. Run `ng test ngx-pk-ui --no-watch` directly.
- **pk-tabs is NgModule-based** — import `PkTabsModule` (not individual components). It uses `*ngFor` and `*ngTemplateOutlet` internally. Do NOT try to make it standalone — it was copied from a working project intentionally.
- **Never use `{{ }}` inside `<pre><code>` blocks** — Angular template compiler evaluates interpolations even in HTML-escaped content. `&#123;&#123;` decodes to `{{` before template compilation, causing binding errors. `&#123;` alone also decodes to `{` which triggers ICU expression parsing. `&#64;` decodes to `@` which triggers control flow parsing. **Correct approach**: store code snippets as TypeScript string properties and use `{{ codeProperty }}` interpolation in a bare `<pre>` — Angular auto-escapes `{`, `}`, `@`, `<`, `>` in string interpolation. For simple single `{` in table cells, `{{ '{' }}` works (no preceding `@` context).
- **`pkTooltip` does not work on `<pk-dg-column>`** — that component uses `host: { style: 'display: contents' }` so it has no bounding box. Apply `[pkTooltip]` to an inner `<span>` instead.
- **`provideHttpClient()` required for HttpClient** — add to `providers` in `app.config.ts` when any component uses `inject(HttpClient)`.
- **Datagrid NG0100 fix** — `PkDgHeaderComponent` reads `textContent` in `ngAfterViewInit` (fires after parent CD). Fix: moved to `ngAfterContentInit`. This prevents ExpressionChangedAfterItHasBeenCheckedError in Angular 19+.
- **Datagrid pagination CSS** — internal buttons use `pk-dg-btn` / `pk-dg-btn-active` / `pk-dg-btn-nav` (self-contained SCSS). No dependency on external `btn` classes — safe alongside Bootstrap or any other CSS framework.
- **Datagrid row selection DI** — `PkDgRowComponent` injects `PkDatagridComponent` via `@Optional() @Inject(forwardRef(() => PkDatagridComponent))`. Do NOT add `providers: [{ provide: forwardRef(…), useExisting: … }]` to `PkDatagridComponent` — that creates a circular dependency (NG0200). Angular resolves the ancestor component via the injector tree automatically without any explicit provider registration.
- **Datagrid rows not clearing on empty array** — When `items` changes from a populated array to `[]` or `null`, old rows stayed rendered. Root cause: `updateDisplayedItems()` returned early on empty without incrementing `displayedItemsVersion`, so `PkDgRowsDirective.ngDoCheck()` saw no version change and skipped `renderItems()`. Fix: always increment `displayedItemsVersion` (and reset `pagination.rowCount = 0`) even when items is empty.
- **`pk-icon` floats above adjacent text** — `inline-flex` elements use `vertical-align: baseline` by default, which misaligns icons when placed next to text. Fix: add `vertical-align: middle` to `:host` in `pk-icon.css`.
- **`PK_MATERIAL_ICON_SETS` for material-symbols check** — use the exported constant `PK_MATERIAL_ICON_SETS` (from `pk-icon.model.ts`) instead of repeating `iconSet() === 'material-symbols' || iconSet() === 'google' || iconSet() === 'mat'`.
- **`contenteditable` dynamic content not styled** — Elements injected by `document.execCommand()` (e.g. `<blockquote>`, `<h1>`, `<ul>`) do NOT receive Angular's `_ngcontent-xxx` attribute, so component-scoped CSS like `.pk-ta__editor blockquote` is compiled to `.pk-ta__editor blockquote[_ngcontent-xxx]` and never matches. Fix: use `:host ::ng-deep .pk-ta__editor blockquote` for any style targeting dynamically-inserted editor content.
- **`Touch` / `TouchEvent` not available in jsdom** — Vitest's jsdom environment does not implement the `Touch` constructor. In specs, dispatch touch events as `new Event('touchstart', { bubbles: true }) as TouchEvent` and mock the `touches` array via `Object.defineProperty(event, 'touches', { value: [{ clientX, clientY, ... }] })`.
- **`@HostListener('document:keydown.*')` receives `Event`, not `KeyboardEvent`** — Angular passes the raw `Event` from `addEventListener`. Typing the parameter as `KeyboardEvent` causes TS2345. Always type it as `Event` (or `Event & { key: string }`).
- **`pkDate` — never use `{{ '...' }}` for code snippets with complex content** — `{{ '...' }}` inline string literals in Angular templates cause NG5002 "Unexpected closing block" when the string contains `}}`, `(`, `)`, `/>`, or `<`. Store all code snippet strings as TypeScript `readonly` properties.
- **`parseBEDate()` is for INPUT parsing only** — it converts a BE-year string to a CE `Date`. The `pkDate` pipe always works with CE `Date` internally; use `era: 'BE'` to add 543 to the displayed year. Round-trip: `parseBEDate('31/01/2568') | pkDate:'dd/mm/yyyy':'numeric':'en':'BE'` → `'31/01/2568'`.

---

## Current project status

| Item | State |
|------|-------|
| Library package name | `ngx-pk-ui` |
| Library version | `2.18.2` |
| Angular version | `^21.0.0` (CLI 21.0.3) |
| `pk-accordion` | ✅ Built, tested (8 tests) |
| `pk-tabs` | ✅ Built, tested (4 tests) — NgModule-based (PkTabsModule) |
| `pk-timeline` | ✅ Built — no tests yet |
| `pk-toastr` | ✅ Built, tested (4 tests) |
| `pk-alert` | ✅ Built, tested (13 tests) |
| `pk-modal` | ✅ Built, tested (16 tests) — `lockScroll` input (default `true`): locks body scroll + compensates scrollbar width |
| `pk-icon` | ✅ Built — `vertical-align: middle` fix; `PK_MATERIAL_ICON_SETS` constant added |
| `pk-datagrid` | ✅ Built (NgModule) — row selection (single/multiple); bug fix: rows now clear correctly when array resets to `[]` |
| `pk-datepicker` | ✅ Built — shared `PkLocale` support; 17 locales; localized labels/placeholders; Thai Buddhist Era year |
| `pk-progress` | ✅ Built |
| `pk-treeview` | ✅ Built (NgModule) |
| `pk-select` | ✅ Built |
| `pk-autocomplete` | ✅ Built |
| `pk-typeahead` | ✅ Built |
| `pk-tooltip` | ✅ Built |
| `pk-calendar` | ✅ Built — Year/Month/Week/Day/Agenda views, drag & drop, multi-day bars, built-in form, full 17-locale support via `PkLocale`; toolbar labels (`year/month/week/day/agenda/today/newEvent`) from `PkLocaleData.calendarLabels` |
| `pk-file-upload` | ✅ Built, tested (14 tests) — drag & drop, browser-native preview (image/PDF/text), upload button, maxSize/maxFiles validation |
| `pk-sidenav` | ✅ Built — left/right, full/icon/auto mode, multi-level, badge, 10 themes (light/dark/primary/orange/blue/teal/indigo/terra-cotta/air-force-blue/peacock-blue), CSS-variable override, content slots; `route` (routerLink) fixed; `href` + `hrefTarget` added; `fn` callback added; scroll fix (`height: 100%` on `:host` + `.pk-sidenav`) |
| `pk-markdown-viewer` | ✅ Built, tested (18 tests) — `fileName` (fetch) + `content` (raw string); Print, Export .md, Export .html; light/dark theme; zero external deps |
| `pk-locale` | ✅ Built — global shared locale model; 17 locales; `direction: 'ltr'\|'rtl'`; `calendarLabels` (year/month/week/day/agenda/today/newEvent) for all 17 locales |
| `pk-heatmap` | ✅ Built, tested (16 tests) — full-width layout; 4 color schemes; 17-locale labels; legend 0/max; tooltip |
| `pk-input-password` | ✅ Built — standalone, ControlValueAccessor, show/hide toggle, 4-level strength meter |
| `pk-radio-group` | ✅ Built, tested (14 tests) — standalone, ControlValueAccessor (`ngModel`/`FormControl`), `layout: vertical\|horizontal`, per-option disabled, `(onChange)` output |
| `pk-timepicker` | ✅ Built, tested (39 tests) — standalone, ControlValueAccessor (`ngModel`/`FormControl`); value as 24H string (`HH:mm`, `HH:mm:ss`, `HH`); `format: 'hms'\|'hm'\|'h'`; `type: '24H'\|'12H'`; `inputType: 'spinner'\|'number'\|'dropdown'`; default `height: 35px` (override via `customStyle`); `customClass`/`customStyle`; `(onTimeChange)` output |
| `pk-context-menu` | ✅ Built, tested (30 tests) — `[pkContextMenu]` directive + `PkContextMenuService` (panel appended to `<body>` on first inject); 7 themes (light/dark/green/blue/orange/red/magenta); `layout: 'vertical'\|'horizontal'`; `PkContextMenuItem` supports `fn`, `route`, `href`, `icon`, `disabled`, `separator`; keyboard nav (ArrowDown/Up/Enter/Escape); auto-position near viewport edges; **mobile long-press (500 ms)** support |
| `pk-pipes` | ✅ Built, tested (68 tests) — 5 standalone pipes: `PkTruncatePipe` (pkTruncate), `PkTimeAgoPipe` (pkTimeAgo, pure:false), `PkFileSizePipe` (pkFileSize), `PkHighlightPipe` (pkHighlight, SafeHtml, XSS-safe), `PkDatePipe` (pkDate, locale-aware, BE/CE era) + `parseBEDate()` utility |
| `pk-directives` | ✅ Built, tested (20 tests) — 5 standalone directives: `PkClickOutsideDirective`, `PkCopyToClipboardDirective`, `PkAutoFocusDirective`, `PkDebounceClickDirective`, `PkNumberOnlyDirective` |
| `pk-split` | ✅ Built, tested (8 tests) — horizontal/vertical resizable split pane; drag divider; touch support; `direction`, `initialSize`, `minSize`, `gutterSize`, `(sizeChange)` |
| `pk-textarea` | ✅ Built, tested (11 tests) — rich text editor: bold/italic/underline/strike, text colour, **highlight color**, font name (23 Google Fonts via `pk-font-*`), font size (small/normal/large/h1-h3), ordered/unordered lists, **blockquote**, dark theme, 3 view modes (Edit/HTML/Text); standalone, ControlValueAccessor (`PkTextareaValue { html, text }`); `::ng-deep` used for dynamic editor content styles |
| `pk-barcode` | ✅ Built, tested (15 tests) — inline SVG barcode; Code 128 / Code 39 / EAN-13 / EAN-8; pure TypeScript encoder; inputs: `value`, `format`, `width`, `height`, `showText`, `lineColor`, `backgroundColor`; `downloadSvg()` / `downloadPng()` |
| `pk-qrcode` | ✅ Built, tested (12 tests) — inline SVG QR code; versions 1–40; EC levels L/M/Q/H; 8 mask patterns with ISO 18004 penalty scoring; center logo (auto-upgrades EC level to Q); inputs: `value`, `ecLevel`, `size`, `darkColor`, `lightColor`, `logo`, `logoSize`, `margin`; `downloadSvg()` / `downloadPng()` |
| `pk-code-reader` | ✅ Built, tested (20 tests) — QR + barcode scanner; native `BarcodeDetector` API (zero deps); **jsQR v1.4.0 fallback for iOS/Firefox** (vendored TS source, QR-only when `BarcodeDetector` unavailable; `_jsqrMode` signal; "QR only" badge in viewport); camera / image upload / clipboard paste; canvas RAF overlay (viewfinder + green bbox highlight 800 ms); AudioContext beep 880 Hz; torch toggle; camera switch; `formats` filtered by `getSupportedFormats()`; iOS-aware "not supported" message; **permission-denied fallback**: capture overlay with `<input capture="environment">` (bypasses `getUserMedia()` — works in Android LINE WebView); `reset()`, `startCamera()`, `openCaptureInput()` methods |
| `pk-otp` | ✅ Built, tested (23 tests) — OTP/PIN cells (1–16); `type: 'number'\|'char'\|'none'`; `capital`; `size: 'sm'\|'md'\|'lg'`; `title`/`text` labels; `showString`/`showTime` masking; animated pulse/blink border on focus; keyboard nav (←/→/Backspace/Delete); paste; browser OTP autofill; ControlValueAccessor (`ngModel`/`FormControl`); `(onChange)`/`(onComplete)` outputs |
| `pk-export` | ✅ Built, tested (50 tests) — pure TS data-export module; zero external deps; 7 formats: CSV (UTF-8 BOM), TSV, JSON, XML, XLSX (SpreadsheetML / ZIP STORE), HTML, text; `PkExportService` (7 methods); `PkExportButton` (dropdown UI); tree-shakable pure encoder functions |
| `pk-grid` (CSS only) | ✅ Shipped as `dist/ngx-pk-ui/styles/pk-grid.css` |
| `pk-btn` (CSS only)  | ✅ Shipped as `dist/ngx-pk-ui/styles/pk-btn.css` |
| `pk-spinner` (CSS only) | ✅ Shipped as `dist/ngx-pk-ui/styles/pk-spinner.css` |
| `pk-badge` (CSS only)   | ✅ Shipped as `dist/ngx-pk-ui/styles/pk-badge.css` |
| `pk-card` (CSS only)    | ✅ Shipped as `dist/ngx-pk-ui/styles/pk-card.css` |
| `pk-table` (CSS only)   | ✅ Shipped as `dist/ngx-pk-ui/styles/pk-table.css` — `pk-table-header-sticky` added |
| `pk-toggle` (CSS only)  | ✅ Shipped as `dist/ngx-pk-ui/styles/pk-toggle.css` |
| `pk-breadcrumb` | ✅ CSS shipped as `dist/ngx-pk-ui/styles/pk-breadcrumb.css` + Angular component `PkBreadcrumb` with `(itemClick)` / `(itemDblClick)` outputs; `items`, `separator`, `size`, `bg` inputs |
| `pk-form` (CSS only) | ✅ Shipped as `dist/ngx-pk-ui/styles/pk-form.css` — included in pk-ui.css |
| `pk-layout` (CSS only) | ✅ Shipped as `dist/ngx-pk-ui/styles/pk-layout.css` — included in pk-ui.css |
| `pk-font` (CSS only, opt-in) | ✅ Shipped as `dist/ngx-pk-ui/styles/pk-font.css` — NOT in pk-ui.css |
| `pk-icon-font` (CSS only) | ✅ Shipped as `dist/ngx-pk-ui/styles/pk-icon-font.css` |
| `pk-divider` (CSS only) | ✅ Shipped as `dist/ngx-pk-ui/styles/pk-divider.css` — included in pk-ui.css |
| `pk-float-btn` (CSS only) | ✅ Shipped as `dist/ngx-pk-ui/styles/pk-float-btn.css` — included in pk-ui.css |
| Example app (`projects/example/`) | ✅ Sidebar nav + lazy-routed pages for every section; 3 example pages: login, chat, dashboard; CHANGELOG.md asset |
| npm published | ✅ Published |

**Test totals: 431 / 431 passing**

### Suggested next components
- `pk-stepper` — multi-step wizard / stepper
- `pk-pagination` — standalone pagination component (reuse datagrid logic)
- `pk-drawer` — slide-in side panel / off-canvas drawer
- `pk-kanban` — drag-and-drop kanban board
- `pk-image-viewer` — lightbox / image viewer (works with pk-file-upload previews)
- `pk-command-palette` — keyboard-driven command palette (works with pk-sidenav)

---

## pk-timepicker API reference

Standalone component — time picker with ControlValueAccessor support. Value is always stored/emitted as a **24H string** (`HH:mm`, `HH:mm:ss`, or `HH`).

```ts
import { PkTimepicker } from 'ngx-pk-ui';
import type { PkTimeFormat, PkTimeType, PkTimeInputType } from 'ngx-pk-ui';

@Component({
  imports: [PkTimepicker, FormsModule],
})
```

```html
<!-- Basic 24H hm -->
<pk-timepicker [(ngModel)]="time" />

<!-- 12H mode, hms format, number inputs -->
<pk-timepicker [(ngModel)]="time" type="12H" format="hms" inputType="number" />

<!-- Dropdown, custom height -->
<pk-timepicker [(ngModel)]="time" inputType="dropdown" [customStyle]="{ height: '42px' }" />
```

### PkTimepicker inputs / outputs

| Input/Output | Type | Default | Description |
|---|---|---|---|
| `format` | `'hms'\|'hm'\|'h'` | `'hm'` | Fields shown — hours+minutes+seconds / hours+minutes / hours only |
| `type` | `'24H'\|'12H'` | `'24H'` | Clock mode — 12H shows AM/PM toggle |
| `inputType` | `'spinner'\|'number'\|'dropdown'` | `'number'` | UI style (see below) |
| `customClass` | `string` | `''` | Extra CSS class on container |
| `customStyle` | `Record<string,string>` | `{}` | Inline styles — overrides defaults (e.g. `height`) |
| `(onTimeChange)` | `string` | — | Emits formatted time string on every change |

### inputType modes

| Mode | Description |
|---|---|
| `spinner` | Up/down arrow buttons per field + mouse-wheel support |
| `number` | Plain `<input type="text">` per field — invalid values (out-of-range on blur) revert to the previous valid value |
| `dropdown` | Native `<select>` per field — always emits a valid value; hours 00–23 (24H) or 01–12 (12H) |

### Value format

| `format` | Value string |
|---|---|
| `'hm'` | `"14:30"` |
| `'hms'` | `"14:30:05"` |
| `'h'` | `"14"` |

Always 24H internally regardless of `type`. `writeValue('14:30')` sets `_h=14, _m=30`.

### Notes
- Default `height: 35px` set in CSS; override with `[customStyle]="{ height: '42px' }"`.
- 12H display: hour 0 → shows as `12` (midnight AM); hour 12 → shows as `12` (noon PM).
- Separate spec files per `inputType` to avoid TestBed environment conflicts.

---

## pk-context-menu API reference

Directive + service — right-click context menu with zero template setup for the panel.

```ts
import { PkContextMenuDirective } from 'ngx-pk-ui';
import type { PkContextMenuItem, PkContextMenuSelectEvent } from 'ngx-pk-ui';

@Component({
  imports: [PkContextMenuDirective],
})
```

```html
<div
  [pkContextMenu]="menuItems"
  pkContextMenuTheme="light"
  pkContextMenuLayout="vertical"
  (pkContextMenuSelected)="onSelect($event)"
>Right-click here</div>
```

### PkContextMenuDirective inputs / outputs

| Input/Output | Type | Default | Description |
|---|---|---|---|
| `pkContextMenu` | `PkContextMenuItem[]` | `[]` | Menu items |
| `pkContextMenuLayout` | `'vertical'\|'horizontal'` | `'vertical'` | Panel layout |
| `pkContextMenuTheme` | `PkContextMenuTheme` | `'light'` | Color theme |
| `pkContextMenuDisabled` | `boolean` | `false` | Prevent menu from opening |
| `(pkContextMenuSelected)` | `PkContextMenuSelectEvent` | — | Emits when user selects an item |
| `(pkContextMenuOpen)` | `MouseEvent` | — | Emits on right-click before menu opens |

### PkContextMenuTheme values

`'light'` · `'dark'` · `'green'` · `'blue'` · `'orange'` · `'red'` · `'magenta'`

### PkContextMenuItem interface

| Property | Type | Description |
|---|---|---|
| `id` | `string\|number?` | Optional identifier |
| `title` | `string?` | Display label |
| `icon` | `string?` | Material Symbols icon name |
| `disabled` | `boolean?` | Prevent selection |
| `separator` | `boolean?` | Render a divider line (other fields ignored) |
| `route` | `any[]?` | Angular Router commands — `router.navigate(route)` |
| `href` | `string?` | External URL — `window.open(href, hrefTarget)` |
| `hrefTarget` | `'_blank'\|'_self'?` | Link target. Default `'_blank'` |
| `fn` | `() => void?` | Callback executed on selection |

### PkContextMenuService methods

| Method | Description |
|---|---|
| `show(config)` | Open the panel at x/y with items, layout, theme, and selection callback |
| `hide()` | Programmatically close the panel |

### Notes
- **Panel is auto-created** — `PkContextMenuService` is `providedIn: 'root'`; the panel component is lazily imported and appended to `<body>` on first inject. No `<pk-ctx-panel>` tag needed anywhere.
- **Keyboard**: ArrowDown/Up to navigate, Enter to confirm, Escape to close.
- **Auto-position**: panel flips to stay within viewport bounds.
- **Mobile long-press**: directive listens to `touchstart` — fires menu after 500 ms hold. Moving finger > 10 px cancels the gesture. Android's duplicate `contextmenu` event after long-press is swallowed via `_longPressTriggered` flag. Host style `-webkit-touch-callout: none` suppresses the iOS native callout.
- **`PkContextMenuPanel` is NOT exported** from public-api — it's an internal implementation detail.

---

## pk-pipes API reference

### PkDatePipe (`pkDate`)

Standalone pure pipe — locale-aware date formatting with Buddhist Era support.

```ts
import { PkDatePipe, parseBEDate } from 'ngx-pk-ui';

@Component({
  imports: [PkDatePipe],
})
```

```html
{{ date | pkDate: format : style : locale : era }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|---|---|---|---|
| `format` | `string` | required | Format string — tokens + literal separators (e.g. `'dd/mm/yyyy'`) |
| `style` | `'numeric'\|'abbr'\|'full'` | `'numeric'` | Month rendering — number / short name / full name |
| `locale` | `PkLocale` | `'en'` | Locale for month names (from `PkLocaleData`) |
| `era` | `'CE'\|'BE'` | `'CE'` | Buddhist Era adds 543 to displayed year |

**Format tokens:**

| Token | Output | Example (Jan 31, 2025) |
|---|---|---|
| `d` | Day, no padding | `31` |
| `dd` | Day, 2-digit | `31` |
| `m` | Month numeric, no padding (or month name) | `1` or `Jan` |
| `mm` | Month numeric, 2-digit (or month name) | `01` or `Jan` |
| `yyyy` | 4-digit year | `2025` / `2568` (BE) |
| `yy` | 2-digit year | `25` / `68` (BE) |

Any other characters in `format` are passed through as-is (separators, spaces, commas).

**Examples:**

```html
{{ date | pkDate:'dd/mm/yyyy' }}                        <!-- 31/01/2025 -->
{{ date | pkDate:'d m yyyy':'abbr':'th':'BE' }}          <!-- 31 ม.ค. 2568 -->
{{ date | pkDate:'d-m-yyyy':'abbr':'es' }}               <!-- 31-Ene-2025 -->
{{ date | pkDate:'m, d yyyy':'full':'it' }}              <!-- Gennaio, 31 2025 -->
{{ date | pkDate:'yyyy年mm月dd日':'abbr':'ja' }}         <!-- 2025年1月31日 -->
```

### parseBEDate()

Parses a Buddhist Era date string and returns a CE `Date`.

```ts
parseBEDate(value: string, separator?: string, order?: 'dmy'|'mdy'|'ymd'): Date
```

| Parameter | Type | Default | Description |
|---|---|---|---|
| `value` | `string` | required | BE date string (e.g. `'31/01/2568'`) |
| `separator` | `string` | `'/'` | Field separator |
| `order` | `'dmy'\|'mdy'\|'ymd'` | `'dmy'` | Field order |

```ts
parseBEDate('31/01/2568')              // new Date(2025, 0, 31)
parseBEDate('2568-01-31', '-', 'ymd') // new Date(2025, 0, 31)
```

**Round-trip**: `parseBEDate('31/01/2568') | pkDate:'dd/mm/yyyy':'numeric':'en':'BE'` → `'31/01/2568'`

---

## pk-split API reference

Standalone component — resizable split pane with horizontal or vertical layout.

```ts
import { PkSplit, PkSplitPanel } from 'ngx-pk-ui';
import type { PkSplitDirection } from 'ngx-pk-ui';

@Component({
  imports: [PkSplit, PkSplitPanel],
})
```

```html
<!-- Horizontal (left / right) — default -->
<pk-split style="height: 400px">
  <pk-split-panel>
    <p>Left panel</p>
  </pk-split-panel>
  <pk-split-panel>
    <p>Right panel</p>
  </pk-split-panel>
</pk-split>

<!-- Vertical (top / bottom) -->
<pk-split direction="vertical" style="height: 400px">
  <pk-split-panel><p>Top panel</p></pk-split-panel>
  <pk-split-panel><p>Bottom panel</p></pk-split-panel>
</pk-split>

<!-- Custom sizes -->
<pk-split [initialSize]="30" [minSize]="15" [gutterSize]="8" (sizeChange)="onResize($event)">
  <pk-split-panel>...</pk-split-panel>
  <pk-split-panel>...</pk-split-panel>
</pk-split>
```

**`PkSplit` inputs / outputs:**
| Input/Output | Type | Default | Description |
|---|---|---|---|
| `direction` | `'horizontal'\|'vertical'` | `'horizontal'` | Layout direction — left/right or top/bottom |
| `initialSize` | `number` | `50` | Starting size of the first panel as a percentage |
| `minSize` | `number` | `10` | Minimum percentage either panel can shrink to |
| `gutterSize` | `number` | `6` | Divider thickness in pixels |
| `(sizeChange)` | `[number, number]` | — | Emits `[sizeA%, sizeB%]` on every drag move |

**Notes:**
- Both `PkSplit` and `PkSplitPanel` must be in `imports[]`.
- `pk-split` host uses `display: block; width: 100%; height: 100%` — set an explicit height on the parent or via `style`.
- Touch events are handled natively — works on mobile.
- The gutter uses flexbox `flex-grow` ratio approach — percentages are accurate regardless of gutter size.

---

## pk-markdown-viewer API reference

Standalone component — renders Markdown to HTML with no external dependencies.

```ts
import { PkMarkdownViewer } from 'ngx-pk-ui';
import type { PkMarkdownTheme } from 'ngx-pk-ui';

@Component({
  imports: [PkMarkdownViewer],
})
```

```html
<!-- Load from a file URL -->
<pk-markdown-viewer fileName="assets/CHANGELOG.md" theme="light" />

<!-- Render a raw markdown string -->
<pk-markdown-viewer [content]="markdownString" theme="dark" title="My Doc" />
```

### PkMarkdownViewer inputs

| Input | Type | Default | Description |
|---|---|---|---|
| `fileName` | `string` | `''` | URL/path to a `.md` file — fetched via `fetch()` |
| `content` | `string` | `''` | Raw Markdown string (takes priority over `fileName`) |
| `theme` | `'light'\|'dark'` | `'light'` | Color theme |
| `showToolbar` | `boolean` | `true` | Show/hide toolbar (Print + Export buttons) |
| `title` | `string` | `''` | Override toolbar title (defaults to filename) |

### Toolbar actions
| Button | Description |
|--------|-------------|
| Print | Opens a styled print window via `window.open()` |
| Export .md | Downloads the raw Markdown as a `.md` file |
| Export .html | Downloads a self-contained `.html` document |

### Supported Markdown syntax
Headings (H1–H6), **bold**, *italic*, ***bold italic***, ~~strikethrough~~, `inline code`, fenced code blocks (with language class), blockquotes, unordered/ordered lists, tables (with column alignment), links, images, horizontal rules.

### Exported functions (for advanced use)
```ts
import { parseMarkdown, buildHtmlDocument } from 'ngx-pk-ui';

const html = parseMarkdown('# Hello\n**world**');
const fullHtml = buildHtmlDocument('My Title', html);
```

### Notes
- Zero external npm dependencies — parser is pure TypeScript.
- `fileName` uses `fetch()` — no `HttpClient` or Angular DI needed.
- `content` takes priority when both inputs are set.
- HTML is sanitized via Angular's `DomSanitizer.bypassSecurityTrustHtml` after the parser generates safe markup. The parser itself escapes all raw HTML in text nodes and code blocks.

---

## pk-grid CSS reference

`pk-grid.css` is a **pure CSS file** — no Angular component needed. Include it in consumers' global styles.

**In an Angular app** (`angular.json` styles array) — one file for everything:
```json
"styles": ["node_modules/ngx-pk-ui/styles/pk-ui.css"]
```

Or import individual files:
```json
"styles": [
  "node_modules/ngx-pk-ui/styles/pk-grid.css",
  "node_modules/ngx-pk-ui/styles/pk-btn.css"
]
```

**Or via CSS import:**
```css
@import 'ngx-pk-ui/styles/pk-ui.css';
```

### Breakpoints (mobile-first)
| Prefix | Min-width |
|--------|-----------|
| `xs`   | always (< 576px) |
| `sm`   | ≥ 576px |
| `md`   | ≥ 768px |
| `lg`   | ≥ 992px |
| `xl`   | ≥ 1200px |

### Class reference
```html
<!-- Row container -->
<div class="pk-row">
  <!-- Fixed (all breakpoints) -->
  <div class="pk-col-6">50%</div>

  <!-- Responsive: stack on mobile, 3-col at md, 2-col at sm -->
  <div class="pk-col-12 pk-col-sm-6 pk-col-md-4">...</div>

  <!-- Auto-width -->
  <div class="pk-col">fills remaining</div>
</div>
```

**Row modifiers:** `pk-row--gap-0` `pk-row--gap-sm` `pk-row--gap-lg` `pk-row--align-center` `pk-row--align-top` `pk-row--align-bottom` `pk-row--justify-between` etc.

**Column classes:** `pk-col-[1-12]` · `pk-col-xs-[1-12]` · `pk-col-sm-[1-12]` · `pk-col-md-[1-12]` · `pk-col-lg-[1-12]` · `pk-col-xl-[1-12]` · `pk-col` (auto) · `pk-col-auto`

### Note on example app CSS loading
In the dev workspace, `ng-package.json` assets copies the CSS to `dist/ngx-pk-ui/styles/`. The `angular.json` for the example app references them as `dist/ngx-pk-ui/styles/pk-grid.css` and `dist/ngx-pk-ui/styles/pk-btn.css` (not via the `ngx-pk-ui` package alias, since CSS imports don't follow tsconfig paths).

---

## pk-btn CSS reference

```json
// angular.json styles
"styles": ["node_modules/ngx-pk-ui/styles/pk-btn.css"]
```

### Variants (solid, default = primary)
```html
<button class="pk-btn">Default / Primary</button>
<button class="pk-btn pk-btn-primary">Primary</button>
<button class="pk-btn pk-btn-secondary">Secondary</button>
<button class="pk-btn pk-btn-success">Success</button>
<button class="pk-btn pk-btn-error">Error</button>
```

### Modifiers (combine with any variant)
```html
<button class="pk-btn pk-btn-success pk-btn-outline">Outline</button>
<button class="pk-btn pk-btn-primary pk-btn-shadow">Shadow</button>
<button class="pk-btn pk-btn-sm">Small</button>
<button class="pk-btn pk-btn-lg">Large</button>
<button class="pk-btn" disabled>Disabled</button>
```

### Button group
```html
<div class="pk-btn-group">
  <button class="pk-btn pk-btn-secondary">Left</button>
  <button class="pk-btn pk-btn-secondary">Center</button>
  <button class="pk-btn pk-btn-secondary">Right</button>
</div>
```

Colors are driven by CSS custom properties (`--pk-btn-primary`, etc.) so consumers can override them in `:root`.

---

## pk-alert API reference

Place `<pk-alert />` **once** in your root component template alongside `<pk-toastr />`.

```ts
import { PkAlertService } from 'ngx-pk-ui';

@Component({ ... })
export class MyComponent {
  alert = inject(PkAlertService);

  async examples() {
    // Notification dialogs — resolve when user clicks OK
    await this.alert.success('Saved successfully!');
    await this.alert.warn('This may cause issues.');
    await this.alert.error('Operation failed.');

    // Confirm dialog — resolves true (OK) or false (Cancel)
    const yes = await this.alert.confirm('Delete this item?', 'Confirm');
    if (yes) { /* proceed */ }

    // Input dialogs — resolve the value or null (if cancelled)
    const name = await this.alert.input('Enter your name:', 'string', 'Name', 'Alice');
    const age  = await this.alert.input('Enter your age:',  'number', 'Age', 25);
    const dob  = await this.alert.input('Pick a date:',     'date');
    const ok   = await this.alert.input('Agree to terms?',  'boolean');
  }
}
```

**`PkAlertService` methods:**
| Method | Returns |
|--------|---------|
| `success(message, title?)` | `Promise<void>` |
| `warn(message, title?)` | `Promise<void>` |
| `error(message, title?)` | `Promise<void>` |
| `confirm(message, title?, confirmLabel?, cancelLabel?)` | `Promise<boolean>` |
| `input(message, inputType, title?, defaultValue?)` | `Promise<string\|number\|boolean\|null>` |

`inputType` values: `'string'` `'number'` `'date'` `'boolean'`

---

## pk-spinner CSS reference

```html
<!-- Sizes -->
<span class="pk-spinner pk-spinner-sm"></span>
<span class="pk-spinner"></span>           <!-- md (default) -->
<span class="pk-spinner pk-spinner-lg"></span>
<span class="pk-spinner pk-spinner-xl"></span>

<!-- Colors -->
<span class="pk-spinner pk-spinner-primary"></span>
<span class="pk-spinner pk-spinner-secondary"></span>
<span class="pk-spinner pk-spinner-success"></span>
<span class="pk-spinner pk-spinner-error"></span>
<span class="pk-spinner pk-spinner-white"></span>

<!-- Inline (sits alongside text or inside a button) -->
<span class="pk-spinner pk-spinner-sm pk-spinner-inline"></span>
```

| Modifier | Description |
|----------|-------------|
| `pk-spinner-sm` | 16px / 2px border |
| `pk-spinner-md` | 24px / 3px border (default) |
| `pk-spinner-lg` | 36px / 4px border |
| `pk-spinner-xl` | 48px / 5px border |
| `pk-spinner-inline` | `display:inline-block; vertical-align:middle` |
| `pk-spinner-primary/secondary/success/error/white` | Color variants |

---

## pk-badge CSS reference

```html
<!-- Solid variants (default = primary) -->
<span class="pk-badge">Primary</span>
<span class="pk-badge pk-badge-success">Success</span>
<span class="pk-badge pk-badge-warn">Warn</span>
<span class="pk-badge pk-badge-error">Error</span>

<!-- Outline -->
<span class="pk-badge pk-badge-error pk-badge-outline">Error</span>

<!-- Sizes -->
<span class="pk-badge pk-badge-sm">3</span>
<span class="pk-badge pk-badge-lg">New</span>

<!-- Pill (rectangular, rounded ends) -->
<span class="pk-badge pk-badge-success pk-badge-pill">v2.5.0</span>

<!-- Dot (empty indicator, no text) -->
<span class="pk-badge pk-badge-dot pk-badge-success"></span>
```

---

## pk-card CSS reference

```html
<div class="pk-card">
  <div class="pk-card-header">Title</div>
  <div class="pk-card-body">Content</div>
  <div class="pk-card-footer">
    <button class="pk-btn pk-btn-primary pk-btn-sm">OK</button>
  </div>
</div>
```

### Color variants (colored header bg + matching border)
```html
<div class="pk-card pk-card-primary">...</div>
<div class="pk-card pk-card-secondary">...</div>
<div class="pk-card pk-card-success">...</div>
<div class="pk-card pk-card-error">...</div>
<div class="pk-card pk-card-warn">...</div>
<div class="pk-card pk-card-info">...</div>
```

### Modifiers
| Modifier | Description |
|----------|-------------|
| `pk-card-shadow` | Elevated shadow |
| `pk-card-flat` | No shadow |
| `pk-card-outlined` | Border only, no shadow |

Color variants: `pk-card-primary` · `pk-card-secondary` · `pk-card-success` · `pk-card-error` · `pk-card-warn` (`--pk-btn-warn` / #fb8c00) · `pk-card-info` (teal, `--pk-btn-info` / #00897b)

Colors are driven by the same CSS custom properties as `pk-btn.css` (`--pk-btn-primary`, etc.).

---

## pk-table CSS reference

```html
<!-- Basic -->
<table class="pk-table">
  <thead><tr><th>Name</th><th>Status</th></tr></thead>
  <tbody><tr><td>Alice</td><td>Active</td></tr></tbody>
</table>

<!-- Striped + hover + colored header -->
<table class="pk-table pk-table-primary pk-table-striped pk-table-hover">...</table>

<!-- Responsive wrapper -->
<div class="pk-table-responsive">
  <table class="pk-table pk-table-bordered">...</table>
</div>

<!-- Sticky header -->
<div style="max-height: 300px; overflow-y: auto">
  <table class="pk-table pk-table-header-sticky pk-table-primary pk-table-striped">
    <thead><tr><th>Name</th><th>Role</th></tr></thead>
    <tbody>...many rows...</tbody>
  </table>
</div>
```

| Class | Description |
|-------|-------------|
| `pk-table` | Base styles (required) |
| `pk-table-striped` | Alternating row background |
| `pk-table-hover` | Row highlight on hover |
| `pk-table-bordered` | Border on every cell |
| `pk-table-sm` | Reduced padding |
| `pk-table-compact` | Minimal padding + smaller font |
| `pk-table-primary/success/warn/error` | Colored `<thead>` |
| `pk-table-header-sticky` | Sticky `<thead>` — wrap table in `overflow-y: auto` container with fixed height. Uses `overflow: clip` to preserve border-radius while allowing sticky |
| `pk-table-responsive` | Wrapper `<div>` — horizontal scroll on overflow |

---

## pk-toggle CSS reference

```html
<!-- Minimal -->
<label class="pk-toggle">
  <input type="checkbox" />
  <span class="pk-toggle__track"></span>
</label>

<!-- With label + color variant -->
<label class="pk-toggle pk-toggle-success">
  <input type="checkbox" checked />
  <span class="pk-toggle__track"></span>
  <span class="pk-toggle__label">Enable feature</span>
</label>
```

| Class | Description |
|-------|-------------|
| `pk-toggle` | Wrapper `<label>` — required |
| `pk-toggle__track` | Track + thumb `<span>` — required |
| `pk-toggle__label` | Optional text label `<span>` |
| `pk-toggle-success/warn/error` | Checked color variant |
| `pk-toggle-sm` | Small (34×18 px) |
| `pk-toggle-lg` | Large (56×30 px) |
| `pk-toggle-label-left` | Move label to the left of the track |

---

## pk-float-btn CSS reference

```html
<!-- Basic (bottom-right, primary color) -->
<a href="#top" class="pk-float-btn pk-float-btn--bottom-right">
  <pk-icon icon="arrow_upward" [size]="16" />
  Back to top
</a>

<!-- Position variants -->
<button class="pk-float-btn pk-float-btn--top-left">Top Left</button>
<button class="pk-float-btn pk-float-btn--top-center">Top Center</button>
<button class="pk-float-btn pk-float-btn--top-right">Top Right</button>
<button class="pk-float-btn pk-float-btn--bottom-left">Bottom Left</button>
<button class="pk-float-btn pk-float-btn--bottom-center">Bottom Center</button>
<button class="pk-float-btn pk-float-btn--bottom-right">Bottom Right</button>

<!-- Color variants -->
<button class="pk-float-btn pk-float-btn--bottom-right pk-float-btn--secondary">Secondary</button>
<button class="pk-float-btn pk-float-btn--bottom-right pk-float-btn--success">Success</button>
<button class="pk-float-btn pk-float-btn--bottom-right pk-float-btn--error">Error</button>
<button class="pk-float-btn pk-float-btn--bottom-right pk-float-btn--warning">Warning</button>
<button class="pk-float-btn pk-float-btn--bottom-right pk-float-btn--info">Info</button>
<button class="pk-float-btn pk-float-btn--bottom-right pk-float-btn--dark">Dark</button>
```

| Class | Description |
|-------|-------------|
| `pk-float-btn` | Base class — fixed positioning, rounded, translucent bg, backdrop-filter blur |
| `pk-float-btn--top-left` | Position top-left (16px inset) |
| `pk-float-btn--top-center` | Position top-center |
| `pk-float-btn--top-right` | Position top-right |
| `pk-float-btn--bottom-left` | Position bottom-left |
| `pk-float-btn--bottom-center` | Position bottom-center |
| `pk-float-btn--bottom-right` | Position bottom-right (default placement) |
| `pk-float-btn--secondary` | Gray color variant |
| `pk-float-btn--success` | Green color variant |
| `pk-float-btn--error` | Red color variant |
| `pk-float-btn--warning` | Orange/amber color variant |
| `pk-float-btn--info` | Cyan color variant |
| `pk-float-btn--dark` | Dark slate bg with white text |

**Features:**
- `position: fixed` with `z-index: 9999`
- Translucent white background (`rgba(255,255,255,0.92)`) with `backdrop-filter: blur(6px)`
- Smooth hover transition: shadow lift + 1px up translate
- Works as `<button>` or `<a>` element
- Center positions (`--top-center`, `--bottom-center`) use `transform: translateX(-50%)` for perfect centering

---

## pk-font CSS reference

`pk-font.css` is **opt-in** — it is NOT included in `pk-ui.css`. Import separately.

```json
// angular.json
"styles": [
  "node_modules/ngx-pk-ui/styles/pk-ui.css",
  "node_modules/ngx-pk-ui/styles/pk-font.css"
]
```

```html
<p class="pk-font-roboto">Hello World</p>
<p class="pk-font-sarabun">สวัสดี</p>
<p class="pk-font-kanit">สวัสดี</p>
<p class="pk-font-phetsarath">ສະບາຍດີ</p>
```

| Class | Font | Script |
|-------|------|--------|
| `pk-font-roboto` | Roboto | Latin |
| `pk-font-montserrat` | Montserrat | Latin |
| `pk-font-open-sans` | Open Sans | Latin |
| `pk-font-lato` | Lato | Latin |
| `pk-font-poppins` | Poppins | Latin |
| `pk-font-bai-jamjuree` | Bai Jamjuree | Thai |
| `pk-font-chakra-petch` | Chakra Petch | Thai |
| `pk-font-charm` | Charm | Thai |
| `pk-font-charmonman` | Charmonman | Thai |
| `pk-font-kanit` | Kanit | Thai |
| `pk-font-mitr` | Mitr | Thai |
| `pk-font-noto-sans-thai` | Noto Sans Thai | Thai |
| `pk-font-pattaya` | Pattaya | Thai |
| `pk-font-prompt` | Prompt | Thai |
| `pk-font-sarabun` | Sarabun | Thai |
| `pk-font-sriracha` | Sriracha | Thai |
| `pk-font-srisakdi` | Srisakdi | Thai |
| `pk-font-thasadith` | Thasadith | Thai |
| `pk-font-trirong` | Trirong | Thai |
| `pk-font-noto-sans-lao` | Noto Sans Lao | Lao |
| `pk-font-noto-sans-lao-looped` | Noto Sans Lao Looped | Lao |
| `pk-font-noto-serif-lao` | Noto Serif Lao | Lao |
| `pk-font-phetsarath` | Phetsarath | Lao |

> **Note:** Google Sans is proprietary (not on Google Fonts CDN) and is excluded.

---

## pk-modal API reference

Place `<pk-modal>` wherever the dialog needs to appear. Use the three slot components for structure.

```ts
import { PkModal, PkModalHeader, PkModalBody, PkModalFooter } from 'ngx-pk-ui';
import type { PkModalSize } from 'ngx-pk-ui';

@Component({
  imports: [PkModal, PkModalHeader, PkModalBody, PkModalFooter],
  // ...
})
export class MyComponent {
  showModal = false;
}
```

```html
<button (click)="showModal = true">Open</button>

<pk-modal
  [openModal]="showModal"
  size="lg"
  [blur]="true"
  [closeAble]="true"
  (onClose)="showModal = false"
>
  <pk-modal-header>Title</pk-modal-header>

  <pk-modal-body>
    <p>Any content — forms, text, tables.</p>
  </pk-modal-body>

  <pk-modal-footer>
    <button class="pk-btn pk-btn-secondary pk-btn-outline" (click)="showModal = false">Cancel</button>
    <button class="pk-btn pk-btn-primary" (click)="confirm()">OK</button>
  </pk-modal-footer>
</pk-modal>
```

### PkModal inputs / outputs

| Input/Output | Type | Default | Description |
|---|---|---|---|
| `openModal` | `boolean` | `false` | Show / hide the modal |
| `size` | `'sm'\|'md'\|'lg'\|'xl'\|'full'` | `'md'` | Dialog width preset |
| `blur` | `boolean` | `true` | `backdrop-filter: blur(4px)` on overlay |
| `closeAble` | `boolean` | `true` | Show × button; allow backdrop click to close |
| `lockScroll` | `boolean` | `true` | Lock `<body>` scroll when modal is open; compensates for scrollbar width |
| `customClass` | `string\|null` | `null` | Extra CSS class on dialog container |
| `customStyle` | `Record<string,string>\|null` | `null` | Inline styles on dialog container |
| `(onClose)` | `void` | — | Emits on × click or backdrop click (when closeAble=true) |

### Size presets

| Size | Max-width |
|---|---|
| `sm` | 360px |
| `md` | 520px (default) |
| `lg` | 760px |
| `xl` | 1020px |
| `full` | 100vw × 100vh, no border-radius |

### Notes
- **Slots** — `pk-modal-header`, `pk-modal-body`, `pk-modal-footer` are standalone components; import all three in the consuming component's `imports[]`.
- **`closeAble=false`** — hides the × button AND disables backdrop-click dismiss. You must emit `(onClose)` programmatically.
- **Animation** — overlay fades in, dialog slides in from slightly above (pure CSS, no Angular Animations module).
- **`customStyle`** — uses Angular's `[ngStyle]` binding; provide a `Record<string, string>` object.

---

## pk-tooltip API reference

```ts
import { PkTooltip } from 'ngx-pk-ui';

@Component({
  imports: [PkTooltip],
})
```

```html
<button [pkTooltip]="'Hello world'" pkTooltipPosition="top" pkTooltipType="primary">Hover me</button>

<!-- Dynamic text -->
<span [pkTooltip]="user.email" pkTooltipPosition="bottom" pkTooltipType="secondary">{{ user.email }}</span>
```

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `pkTooltip` | `string` | required | Tooltip text |
| `pkTooltipPosition` | `'top'\|'bottom'\|'left'\|'right'` | `'top'` | Tooltip placement |
| `pkTooltipType` | `PkTooltipType` | `'primary'` | Color variant |

`PkTooltipType` values: `'primary'` `'secondary'` `'success'` `'danger'` `'info'` + `-outline` suffix for each

- `white-space: normal; max-width: 260px` — long text wraps automatically.
- Tooltip is appended to `<body>` and positioned with JS — works on any element that has a real bounding box. **Does NOT work on elements with `display: contents`** (e.g. `<pk-dg-column>`).

---

## pk-datagrid key API

### `<pk-datagrid>` inputs / outputs
| Input/Output | Type | Default | Description |
|-------|------|---------|-------------|
| `pkDgLoading` | `boolean` | `false` | Show loading overlay |
| `pkDgSelect` | `'none'\|'single'\|'multiple'` | `'none'` | Row selection mode — adds checkbox/radio column |
| `(pkDgSelectionChange)` | `any[]` | — | Emits array of selected row objects when selection changes |
| `(pkDgRefresh)` | `void` | — | Emits when the grid requests a data reload |
| `(filterChange)` | `{ key: string; value: string }` | — | Emits on every filter input change — useful for server-side filtering |

### Content projection slots
| Slot selector | Description |
|---|---|
| `[pkDgToolbar]` | Toolbar bar above the table — use for action buttons, export, custom controls. The slot is rendered as `.pk-dg-toolbar` (flex row, `border-bottom: 1px solid #ccc`). Hidden when empty (`:empty { display: none }`). |
| `<pk-dg-footer>` | Free-form footer slot below the table — place `<pk-dg-pagination>` and any extra controls (e.g. `<pk-export-button>`) here. Library applies only `border-top` + `background` — all layout is the consumer's responsibility. |

**Both slots in one grid (recommended pattern):**
```html
<pk-datagrid [pkDgLoading]="loading()">
  <!-- toolbar: action buttons + status info -->
  <div pkDgToolbar>
    <button class="pk-btn pk-btn-primary pk-btn-sm" (click)="reload()">Reload</button>
    <span style="font-size:13px;color:#888;">{{ rows.length }} rows</span>
  </div>

  <pk-dg-header pkDgSort="name">Name</pk-dg-header>
  ...
  <pk-dg-rows *pkDgRows="let row of rows" [pkDgRow]="row">...</pk-dg-rows>

  <!-- footer: export button left, pagination right -->
  <pk-dg-footer>
    <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;padding:4px 8px;">
      <pk-export-button
        [data]="rows"
        [formats]="['csv', 'xlsx', 'json']"
        filename="report"
        [csvOptions]="{ columns: exportColumns, headers: exportHeaders }"
        [xlsxOptions]="{ columns: exportColumns, headers: exportHeaders }"
      />
      <pk-dg-pagination #pag [pkDgPageSize]="10" [rowCount]="rows.length">
        {{ pag.firstItem + 1 }} - {{ pag.lastItem + 1 }} of {{ rows.length }} rows
      </pk-dg-pagination>
    </div>
  </pk-dg-footer>
</pk-datagrid>
```

### `<pk-dg-rows>` inputs
| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `pkDgRow` | `any` | required | Data object for the row (used by sort/filter) |
| `rowClass` | `string` | `''` | CSS class added to the `<tr>` element — e.g. `[rowClass]="row.active ? 'row-active' : ''"` |

### `<pk-dg-header>` inputs
| Input | Type | Description |
|-------|------|-------------|
| `pkDgSort` | `string` | Field key for sorting |
| `pkDgFilter` | `string` | Field key for filter popup |

### `<pk-dg-pagination>` inputs / properties
| Input/Property | Type | Description |
|----------------|------|-------------|
| `pkDgPageSize` | `number` | Rows per page (default 10) |
| `rowCount` | `number` | Total row count — **must be set** for correct page range display |
| `firstItem` | `number` | 0-based index of first row on current page |
| `lastItem` | `number` | 0-based index of last row on current page |

### Directives
| Directive | Usage |
|-----------|-------|
| `*pkDgRows` | `*pkDgRows="let row of rows"` — renders visible paged rows |
| `*pkDgRowIsExpand` | On `<pk-dg-row-expand>` — renders only when row is expanded |

### Row selection usage
```html
<!-- Single select — radio button per row, click again to deselect -->
<pk-datagrid pkDgSelect="single" (pkDgSelectionChange)="onSelect($event)">
  ...
</pk-datagrid>

<!-- Multiple select — checkbox per row + "select all" header checkbox -->
<pk-datagrid pkDgSelect="multiple" (pkDgSelectionChange)="onSelect($event)">
  ...
</pk-datagrid>
```

- **`single`** — radio input, click selected row again = deselect. Emits array of 0 or 1 item.
- **`multiple`** — checkbox inputs + indeterminate "select all" in header. Emits array of all selected items.
- Selected rows highlighted with light-blue background (`pk-dg-row--selected`).
- **DI gotcha**: `PkDgRowComponent` injects `PkDatagridComponent` via `@Optional() @Inject(forwardRef(() => PkDatagridComponent))`. Do NOT add `providers` in `PkDatagridComponent` — that causes NG0200 circular dependency. Angular walks the injector tree automatically.

---

## pk-form CSS reference

Floating label form fields — pure CSS, no Angular component. Works with `input`, `select`, `textarea`.
Included in `pk-ui.css` automatically.

```html
<!-- Basic (outlined, default) -->
<div class="pk-field">
  <input class="pk-field__input" type="text" placeholder=" " id="name" />
  <label class="pk-field__label" for="name">Full name</label>
</div>

<!-- Prefix / Suffix (use pk-field__wrap) -->
<div class="pk-field">
  <div class="pk-field__wrap">
    <span class="pk-field__prefix">@</span>
    <input class="pk-field__input" type="text" placeholder=" " id="user" />
    <span class="pk-field__suffix">.com</span>
  </div>
  <label class="pk-field__label" for="user">Username</label>
</div>
```

**CRITICAL — `placeholder=" "` (single space) is required** on every `pk-field__input`.
The CSS uses `:not(:placeholder-shown)` to detect when the field has a value and float the label.

**Wrapper modifier classes:**
| Class | Description |
|-------|-------------|
| `pk-field` | Required wrapper |
| `pk-field--filled` | Material filled style (bg + bottom border only) |
| `pk-field--underline` | Underline only, no box |
| `pk-field--pill` | border-radius 100px |
| `pk-field--outlined` | Glow ring on focus (stackable) |
| `pk-field--sm / --lg` | Height 42px / 60px |
| `pk-field--success / --error` | State color |

**Element classes:**
| Class | Element | Description |
|-------|---------|-------------|
| `pk-field__input` | input/select/textarea | Form control — must have `placeholder=" "` |
| `pk-field__label` | label | Floating label — must be after input in DOM |
| `pk-field__wrap` | div | Flex row for prefix + input + suffix (single border) |
| `pk-field__prefix` | span | Left addon (grayed bg, inner right divider) |
| `pk-field__suffix` | span | Right addon (grayed bg, inner left divider) |
| `pk-field__hint` | span | Helper text (grey) |
| `pk-field__error` | span | Error message (red) |
| `pk-field__footer` | div | Flex row: hint left + counter right |
| `pk-field__counter` | span | Character counter right-aligned |

**Layout helpers:**
| Class | Description |
|-------|-------------|
| `pk-form-group` | Responsive flex row of pk-fields |
| `pk-form-group--2 / --3` | Force 2 or 3 column layout |
| `pk-form-section` | Section divider label (uppercase + border-bottom) |

**Prefix/Suffix implementation notes:**
- `pk-field__wrap` acts as the single border box (`border: 1.5px solid` + `overflow: hidden`)
- `pk-field__input` inside wrap has no own border
- When prefix present: `pk-field` gains `padding-top: 22px` and label is permanently floated above the wrap
- When suffix-only: label floats dynamically (focus/:not(:placeholder-shown)) via `:has()` selector on `pk-field`

---

## pk-layout CSS reference

Fixed top navbar + sidebar layout shell. Pure CSS, no Angular component. All dimensions and colors are CSS variables.
Included in `pk-ui.css` automatically.

```html
<div class="pk-layout">
  <nav class="pk-navbar">
    <button class="pk-navbar__hamburger"><!-- icon --></button>
    <div class="pk-navbar__brand">My App</div>
    <div class="pk-navbar__content">
      <span class="pk-navbar__title">Page Title</span>
    </div>
    <div class="pk-navbar__end"><!-- avatar, actions --></div>
  </nav>

  <!-- show/hide via JS -->
  <button class="pk-layout__backdrop pk-layout__backdrop--open" (click)="close()"></button>

  <nav class="pk-sidebar" [class.pk-sidebar--open]="open">
    <div class="pk-sidebar__section">
      <span class="pk-sidebar__heading">General</span>
      <a class="pk-sidebar__link active" href="#">Home</a>
      <a class="pk-sidebar__link" href="#">Settings</a>
    </div>
    <div class="pk-sidebar__divider"></div>
  </nav>

  <main class="pk-layout__main">
    <router-outlet />
  </main>
</div>
```

**Key CSS variables:**
| Variable | Default | Description |
|---|---|---|
| `--pk-navbar-height` | `56px` | Navbar height |
| `--pk-sidebar-width` | `220px` | Sidebar width (desktop) |
| `--pk-navbar-bg` | `#ffffff` | Navbar background |
| `--pk-sidebar-bg` | `#ffffff` | Sidebar background |
| `--pk-sidebar-link-color` | `#374151` | Default link color |
| `--pk-sidebar-link-hover-bg` | `rgba(0,0,0,0.05)` | Link hover bg |
| `--pk-sidebar-link-hover-color` | `inherit` | Link hover text color |
| `--pk-sidebar-link-active-color` | `var(--pk-btn-primary)` | Active link color |
| `--pk-sidebar-link-active-bg` | `rgba(25,118,210,0.08)` | Active link bg |
| `--pk-sidebar-link-active-border` | `var(--pk-btn-primary)` | Active left border color |
| `--pk-sidebar-heading-color` | `#9ca3af` | Section heading color |
| `--pk-layout-bg` | `#f9fafb` | Main content background |
| `--pk-layout-main-pad-top` | `calc(56px + 32px)` | Content top padding |
| `--pk-layout-main-pad-x` | `40px` | Content horizontal padding |

**Class reference:**
| Class | Description |
|---|---|
| `pk-layout` | Flex shell wrapper |
| `pk-navbar` | Fixed top bar, full width, z-index 200 |
| `pk-navbar__brand` | Left brand slot — same width as sidebar on desktop |
| `pk-navbar__hamburger` | Hidden desktop / flex mobile; 38×38px button |
| `pk-navbar__hamburger-icon` | Built-in 3-line icon (3 child `<span>`s) |
| `pk-navbar__content` | Flex-1 center slot (title, breadcrumb) |
| `pk-navbar__title` | Truncated page title inside `__content` |
| `pk-navbar__end` | Right slot (avatar, actions) |
| `pk-sidebar` | Fixed left, starts below navbar, z-index 150 |
| `pk-sidebar--open` | Slides sidebar into view (mobile) |
| `pk-sidebar__section` | Groups heading + links |
| `pk-sidebar__heading` | Uppercase section label |
| `pk-sidebar__link` | Nav item — add `.active` or `--active` for active state |
| `pk-sidebar__divider` | Thin horizontal rule |
| `pk-layout__main` | Content area — auto margin-left; top pad for navbar |
| `pk-layout__backdrop` | Invisible mobile overlay (add `--open` to show) |
| `pk-layout__backdrop--open` | Shows backdrop (`display: block`) |

**Responsive (breakpoint: 768px):**
- Desktop: sidebar always visible, brand has fixed width + right border, hamburger hidden
- Mobile: sidebar off-screen (`translateX(-110%)`) → slides in on `--open`; hamburger visible in navbar; main is full-width

**Active link:** works with Angular `routerLinkActive="active"` or manual `.pk-sidebar__link--active` class.

---

## pk-file-upload API reference

Standalone component — drag & drop + browser-native preview with no extra libraries.

```ts
import { PkFileUpload, type PkUploadFile } from 'ngx-pk-ui';

@Component({
  imports: [PkFileUpload],
})
```

```html
<pk-file-upload
  #uploader
  accept="image/*,.pdf"
  [multiple]="true"
  [maxSize]="10_000_000"
  [uploading]="isUploading()"
  (onUpload)="handleUpload($event)"
/>
```

```ts
readonly uploader = viewChild<PkFileUpload>('uploader');
isUploading = signal(false);

async handleUpload(files: PkUploadFile[]): Promise<void> {
  this.isUploading.set(true);
  const fd = new FormData();
  files.map(f => f.file).forEach(f => fd.append('files', f));
  await this.http.post('/api/upload', fd).toPromise();
  this.isUploading.set(false);
  this.uploader()?.clear();
}
```

### PkFileUpload inputs / outputs

| Input/Output | Type | Default | Description |
|---|---|---|---|
| `accept` | `string` | `''` | Same as native `<input accept>` |
| `multiple` | `boolean` | `true` | Allow multiple files; `false` replaces previous |
| `maxSize` | `number` | `0` | Max bytes per file. `0` = no limit |
| `maxFiles` | `number` | `0` | Max total files. `0` = no limit |
| `disabled` | `boolean` | `false` | Disables drop zone and buttons |
| `uploading` | `boolean` | `false` | Shows spinner on Upload button and disables it |
| `previewSize` | `'sm'\|'md'\|'lg'` | `'md'` | Thumbnail card width (100 / 140 / 180 px) |
| `uploadLabel` | `string` | `'Upload'` | Upload button label |
| `browseLabel` | `string` | `'Browse files'` | Browse link text in drop zone |
| `dropLabel` | `string` | `'Drag & drop files here, or'` | Main drop zone text |
| `(filesChange)` | `PkUploadFile[]` | — | Emits on every file add or remove |
| `(onUpload)` | `PkUploadFile[]` | — | Emits valid files (no errors) when Upload clicked |
| `clear()` | `void` | — | Public method — resets all files |

### PkUploadFile interface

```ts
interface PkUploadFile {
  id: number;                             // unique auto-increment id
  file: File;                             // original File object
  previewType: 'image' | 'pdf' | 'text' | 'none';
  previewUrl: string | null;              // blob: URL for image/pdf
  textContent: string | null;             // first 300 chars for text files
  error: string | null;                   // validation error message
}
```

Preview detection:
- **image** — `file.type.startsWith('image/')`
- **pdf** — `file.type === 'application/pdf'`
- **text** — `file.type.startsWith('text/')` or extension in `[json, xml, yaml, yml, csv, md, ts, js, html, css]`
- **none** — everything else

---

## pk-sidenav API reference

Standalone component — left/right side navigation with multi-level items, 4 built-in themes, CSS-variable override.

```ts
import { PkSidenav } from 'ngx-pk-ui';
import type { PkSidenavGroup } from 'ngx-pk-ui';

@Component({ imports: [PkSidenav] })
```

```html
<pk-sidenav
  [groups]="groups"
  theme="dark"
  mode="auto"
  position="left"
  [activeKey]="activeKey()"
  (itemClick)="onItemClick($event)"
>
  <div pkSidenavHeader>
    <span class="pk-snv-hide-on-icon">My App</span>
  </div>
  <div pkSidenavUser>
    <span class="pk-snv-hide-on-icon">John Doe</span>
  </div>
</pk-sidenav>
```

### PkSidenav inputs / outputs

| Input/Output | Type | Default | Description |
|---|---|---|---|
| `groups` | `PkSidenavGroup[]` | `[]` | Navigation groups with items |
| `theme` | `'light'\|'dark'\|'primary'\|'custom'` | `'light'` | Built-in color theme |
| `themeConfig` | `PkSidenavThemeConfig` | `{}` | CSS-variable overrides (use with `theme='custom'`) |
| `mode` | `'full'\|'icon'\|'auto'` | `'full'` | `full`=label+icon · `icon`=icon-only · `auto`=responsive |
| `position` | `'left'\|'right'` | `'left'` | Side of layout |
| `width` | `string` | `'220px'` | Full-mode width |
| `iconWidth` | `string` | `'64px'` | Icon-only width |
| `breakpoint` | `number` | `768` | px — auto-collapse threshold (mode='auto') |
| `activeKey` | `string` | `''` | Active item key |
| `showUser` | `boolean` | `true` | Show footer user slot |
| `(itemClick)` | `PkSidenavItem` | — | Emits item on click |
| `(modeChange)` | `PkSidenavMode` | — | Emits new mode after auto-collapse/expand |

### PkSidenavGroup interface

| Property | Type | Description |
|---|---|---|
| `heading` | `string?` | Section heading (uppercase) |
| `collapsible` | `boolean?` | Allow heading click to collapse group |
| `collapsed` | `boolean?` | Start collapsed |
| `items` | `PkSidenavItem[]` | Nav items in this group |

### PkSidenavItem interface

| Property | Type | Description |
|---|---|---|
| `key` | `string` | Unique key for active state tracking |
| `label` | `string` | Display label |
| `icon` | `string?` | Material Symbols icon name |
| `route` | `string\|any[]?` | Angular Router commands — renders item as `<a [routerLink]>` with `routerLinkActive` |
| `href` | `string?` | External/internal URL — renders item as `<a [href]>` |
| `hrefTarget` | `'_blank'\|'_self'?` | Link target. `'_blank'` = new tab; `'_self'` = same tab (default) |
| `badge` | `number\|string?` | Badge count shown on item |
| `disabled` | `boolean?` | Prevent selection |
| `children` | `PkSidenavItem[]?` | Nested items (multi-level) |
| `fn` | `() => void?` | Callback executed on selection |

### PkSidenavThemeConfig interface (for `theme='custom'`)

All fields are optional CSS-value strings:
`bg` · `color` · `activeColor` · `activeBg` · `activeBorder` · `hoverBg` · `hoverColor` · `headingColor` · `dividerColor` · `iconBg` · `iconColor`

### Content projection slots

| Selector | Description |
|---|---|
| `[pkSidenavHeader]` | Top slot — logo / brand area |
| `[pkSidenavUser]` | Bottom footer slot — user info |

### Utility class

Add `class="pk-snv-hide-on-icon"` to any projected element to auto-hide it in icon-only mode.
Internal `::ng-deep` is used — no extra CSS needed in consumer.

### Behaviour notes
- **Click in icon-only mode (auto)** → auto-expands to full mode, then selects item / opens submenu
- **Active border** — 3px left bar on active item (right bar when `position='right'`)
- **Submenu animation** — slide-down on open, `@keyframes pk-snv-slide-down`
- **Themes**: `light` (white) · `dark` (slate-800) · `primary` (green-800) · `orange` (orange-600) · `custom` (fully overridable via `themeConfig`)

---

## pk-code-reader API reference

Standalone component — scans QR codes and barcodes via the native `BarcodeDetector` API (zero external dependencies).

```ts
import { PkCodeReader } from 'ngx-pk-ui';
import type { PkCodeScanResult, PkCodeReaderError, PkCodeFormat } from 'ngx-pk-ui';

@Component({
  imports: [PkCodeReader],
})
```

```html
<pk-code-reader
  [continuous]="true"
  [beep]="true"
  [showOverlay]="true"
  [showHighlight]="true"
  [allowUpload]="true"
  [allowPaste]="true"
  (scan)="onScan($event)"
  (error)="onError($event)"
  (supportedFormats)="onFormats($event)"
/>
```

### PkCodeReader inputs

| Input | Type | Default | Description |
|---|---|---|---|
| `formats` | `PkCodeFormat[]` | `[]` | Formats to detect — empty = all supported |
| `facingMode` | `'environment'\|'user'` | `'environment'` | Rear (`environment`) or front (`user`) camera |
| `continuous` | `boolean` | `true` | Keep scanning after first result |
| `paused` | `boolean` | `false` | Pause scan loop without stopping camera |
| `interval` | `number` | `300` | ms between scan attempts |
| `showOverlay` | `boolean` | `true` | Render canvas viewfinder frame |
| `showHighlight` | `boolean` | `true` | Draw green bounding box on detected code (800 ms) |
| `beep` | `boolean` | `true` | AudioContext 880 Hz beep on detection |
| `showTorch` | `boolean` | `true` | Show torch / flashlight toggle button |
| `showSwitch` | `boolean` | `true` | Show front/rear camera switch button |
| `allowUpload` | `boolean` | `true` | Show Upload image button |
| `allowPaste` | `boolean` | `true` | Enable Ctrl+V clipboard paste scan |

### PkCodeReader outputs

| Output | Type | Description |
|---|---|---|
| `scan` | `PkCodeScanResult` | Emits on every successful detection |
| `error` | `PkCodeReaderError` | Emits on error — `'not-supported'`, `'permission-denied'`, `'no-camera'`, `'decode-error'` |
| `supportedFormats` | `PkCodeFormat[]` | Emits once on init with the device's supported formats |

### PkCodeScanResult interface

```ts
interface PkCodeScanResult {
  value: string;                          // decoded text
  format: PkCodeFormat;                   // e.g. 'qr_code', 'code_128'
  source: 'camera' | 'upload' | 'paste'; // how the code was scanned
  boundingBox?: DOMRectReadOnly;
  cornerPoints?: { x: number; y: number }[];
}
```

### Public methods

| Method | Description |
|---|---|
| `startCamera()` | (Re)start camera stream — useful after an error |
| `reset()` | Clear debounce state and restart the scan loop |

### PkCodeFormat values

`aztec` · `code_128` · `code_39` · `code_93` · `codabar` · `data_matrix` · `ean_13` · `ean_8` · `itf` · `pdf417` · `qr_code` · `upc_a` · `upc_e` · `unknown`

### Browser support

| Browser | Support |
|---|---|
| Chrome 83+ (desktop/Android) | ✅ Full — QR + most barcodes |
| Edge 83+ | ✅ Full |
| Android WebView | ✅ Full |
| Safari (iOS/macOS) | ❌ `BarcodeDetector` not supported — fallback overlay shown |
| Firefox | ❌ `BarcodeDetector` not supported — fallback overlay shown |

### Notes
- **Zero dependencies** — uses only the native `BarcodeDetector` Web API
- **Format filtering** — `getSupportedFormats()` is called on init; only device-supported formats are enabled. Code 39 and ITF reliability varies by platform
- **Debounce** — same value is not re-emitted within 2 s in continuous mode; call `reset()` to override
- **`_initPromise`** — exposed for testing: `await component._initPromise` after `TestBed.flushEffects()` to assert post-init state

---

## pk-otp API reference

Standalone component — OTP / PIN input with ControlValueAccessor support.

```ts
import { PkOtp } from 'ngx-pk-ui';
import type { PkOtpType, PkOtpSize } from 'ngx-pk-ui';

@Component({
  imports: [FormsModule, PkOtp],
})
```

```html
<!-- 6-digit OTP (default) -->
<pk-otp [(ngModel)]="otp" (onComplete)="submit($event)" />

<!-- 4-char PIN, masked immediately -->
<pk-otp [length]="4" size="sm" showString="*" [showTime]="0" [(ngModel)]="pin" />

<!-- 8-char alphanumeric, uppercase, large -->
<pk-otp [length]="8" type="char" [capital]="true" size="lg" [(ngModel)]="code" />

<!-- With title and ref text -->
<pk-otp title="Verification Code" text="ref: TXN-001" [(ngModel)]="otp" />
```

### PkOtp inputs / outputs

| Input/Output | Type | Default | Description |
|---|---|---|---|
| `length` | `number` | `6` | Number of cells (clamped to 1–16) |
| `type` | `'number'\|'char'\|'none'` | `'number'` | Accepted character type: digits / a-z letters / any printable |
| `capital` | `boolean` | `false` | Auto-uppercase input (applies when `type='char'`) |
| `size` | `'sm'\|'md'\|'lg'` | `'md'` | Cell size preset |
| `title` | `string` | `''` | Bold label displayed above the cells |
| `text` | `string` | `''` | Sub-label (e.g. `"ref: TXN-001"`) |
| `showString` | `string\|null` | `null` | Mask character — `null` shows actual input; e.g. `'*'` or `'•'` |
| `showTime` | `number` (ms) | `1000` | How long to briefly show the real char before masking. `0` = mask immediately |
| `disabled` | `boolean` | `false` | Disables all input cells |
| `customClass` | `string` | `''` | Extra CSS class on host |
| `customStyle` | `Record<string,string>` | `{}` | Inline styles on host |
| `(onChange)` | `string` | — | Emits the joined value on every keystroke |
| `(onComplete)` | `string` | — | Emits when all cells are filled |

### Size presets

| Size | Cell dimensions | Font |
|---|---|---|
| `sm` | 36 × 40 px | 16 px |
| `md` | 48 × 52 px (default) | 22 px |
| `lg` | 62 × 68 px | 28 px |

### Notes
- **Focus animation** — pulsing box-shadow (`@keyframes pk-otp-pulse`) with no JS; CSS only.
- **Keyboard navigation** — ArrowLeft / ArrowRight moves focus; Backspace clears current cell and moves left; Delete clears current cell without moving.
- **Paste** — fills cells from the pasted string starting at the focused cell; invalid chars (per `type`) are skipped.
- **Browser OTP autofill** — `autocomplete="one-time-code"` on each input; `inputmode="numeric"` when `type='number'`.
- **Masking logic** — when `showString` is set: if `showTime > 0` the real char is shown for `showTime` ms then replaced; if `showTime === 0` the mask is applied instantly.
- **`writeValue`** — supports pre-filled values (e.g. from server); each character is validated against `type` before being accepted.

---

## pk-export API reference

Pure TypeScript data-export module — zero external dependencies. 7 formats, injectable service, and a standalone dropdown button component.

```ts
import { PkExportService, PkExportButton } from 'ngx-pk-ui';
import type {
  PkExportFormat, PkCsvOptions, PkTsvOptions, PkJsonOptions,
  PkXmlOptions, PkHtmlOptions, PkTextOptions, PkXlsxOptions
} from 'ngx-pk-ui';

@Component({
  imports: [PkExportButton],
})
```

### PkExportButton — quick start

```html
<pk-export-button
  [data]="rows"
  [formats]="['csv','xlsx','json','xml','html','tsv','text']"
  filename="employees"
  label="Export"
  [csvOptions]="{ headers: ['ID','Name','Dept'] }"
  [xlsxOptions]="{ sheetName: 'Employees' }"
  (beforeExport)="onBefore($event)"
  (afterExport)="onAfter($event)"
/>
```

### PkExportButton inputs / outputs

| Input/Output | Type | Default | Description |
|---|---|---|---|
| `data` | `any[]` | required | Array of row objects to export |
| `formats` | `PkExportFormat[]` | `['csv','xlsx','json']` | Formats shown in the dropdown |
| `filename` | `string` | `'export'` | Base filename — extension appended automatically |
| `label` | `string` | `'Export'` | Button label |
| `disabled` | `boolean` | `false` | Disable the button |
| `customClass` | `string` | `''` | Extra CSS class on wrapper |
| `customStyle` | `Record<string,string>` | `{}` | Inline styles on wrapper |
| `csvOptions` | `PkCsvOptions` | — | Options for CSV encoder |
| `tsvOptions` | `PkTsvOptions` | — | Options for TSV encoder |
| `jsonOptions` | `PkJsonOptions` | — | Options for JSON encoder |
| `xmlOptions` | `PkXmlOptions` | — | Options for XML encoder |
| `xlsxOptions` | `PkXlsxOptions` | — | Options for XLSX encoder |
| `htmlOptions` | `PkHtmlOptions` | — | Options for HTML encoder |
| `textOptions` | `PkTextOptions` | — | Options for Text encoder |
| `(beforeExport)` | `PkExportFormat` | — | Emits before download triggers |
| `(afterExport)` | `PkExportFormat` | — | Emits after download triggers |

### PkExportService — direct use

```ts
export class MyComponent {
  private svc = inject(PkExportService);

  export() {
    this.svc.csv(data, 'report.csv', { bom: true, headers: ['Name','Dept'] });
    this.svc.xlsx(data, 'report.xlsx', { sheetName: 'Sheet1' });
    this.svc.json(data, 'report.json', { indent: 2 });
    this.svc.xml(data,  'report.xml',  { rootTag: 'employees', itemTag: 'employee' });
    this.svc.html(data, 'report.html', { title: 'Report', standalone: true });
    this.svc.tsv(data,  'report.tsv');
    this.svc.text(data, 'report.txt', { delimiter: '|' });
  }
}
```

### PkExportFormat values

`'csv'` · `'tsv'` · `'json'` · `'xml'` · `'xlsx'` · `'html'` · `'text'`

### Option interfaces (shared fields)

All option interfaces support `columns?: string[]` (filter which object keys to export) and `headers?: string[]` (override column header labels).

| Interface | Extra fields |
|---|---|
| `PkCsvOptions` | `delimiter?` (default `','`), `bom?` (default `true`) |
| `PkTsvOptions` | — |
| `PkJsonOptions` | `indent?` (default `2`) |
| `PkXmlOptions` | `rootTag?` (default `'root'`), `itemTag?` (default `'item'`) |
| `PkHtmlOptions` | `title?`, `standalone?` (default `true` — full `<!DOCTYPE html>` wrapper) |
| `PkTextOptions` | `delimiter?` (default `'\t'`) |
| `PkXlsxOptions` | `sheetName?` (default `'Sheet1'`) |

### Pure encoder functions (tree-shakable)

```ts
import { toCsv, toXlsx, downloadFile } from 'ngx-pk-ui';

const csv: string = toCsv(data, { bom: true });
const xlsx: Uint8Array = toXlsx(data, { sheetName: 'Data' });

// download manually
downloadFile(csv,  'report.csv',  'text/csv;charset=utf-8');
downloadFile(xlsx, 'report.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
```

### XLSX implementation notes
- Uses **ZIP STORE** (compression method = 0) — no `CompressionStream` needed, universal browser support
- SpreadsheetML format (same as `.xlsx`): `[Content_Types].xml`, `xl/workbook.xml`, `xl/worksheets/sheet1.xml`, `xl/sharedStrings.xml`
- Numbers stored as `<c r="A1"><v>42</v></c>`, strings via shared string index `<c r="A1" t="s"><v>0</v></c>`
- Pure TypeScript CRC-32 with 256-entry lookup table
