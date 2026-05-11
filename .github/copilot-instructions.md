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
        pk-datepicker/          ← Datepicker with TH/EN locale, range, clear
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
          pk-sidenav.model.ts   ← PkSidenavGroup, PkSidenavItem, PkSidenavTheme, PkSidenavMode, PkSidenavPosition, PkSidenavThemeConfig
          pk-sidenav.ts         ← standalone component: left/right, full/icon/auto, multi-level, 4 themes, CSS-variable override
          pk-sidenav.html / .css
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
      pk-font.css                 ← Thai & Lao Google Fonts helper classes (opt-in — NOT in pk-ui.css)
  example/                 ← local dev/test app (gitignored, never published)
    src/app/
      app.ts / app.html / app.css  ← shell: dark sidebar nav + RouterOutlet + PkToastr + PkAlert
      app.routes.ts                ← lazy-loaded routes for each component/CSS section
      pages/
        Components: home/ pk-accordion/ pk-tabs/ pk-toastr/ pk-alert/ pk-modal/
                    pk-icon/ pk-datagrid/ pk-datepicker/ pk-progress/ pk-treeview/
                    pk-select/ pk-autocomplete/ pk-typeahead/ pk-tooltip/ pk-timeline/ pk-calendar/
                    pk-file-upload/ pk-sidenav/
        CSS pages:  pk-grid/ pk-btn/ pk-spinner/ pk-badge/ pk-card/
                    pk-table/ pk-toggle/ pk-breadcrumb/ pk-font/ pk-form/ pk-layout/
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
    this.toastr.success('Done!', undefined, { progress: false });    // no progress bar
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
| `progress` | `boolean` | `true` | Show countdown progress bar |

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

---

## Known gotchas (discovered during initial build)

- **`PkTab` must NOT be in `PkTabs.imports[]`** — Angular 21 warns "not used within the template" because `PkTab` is only consumed via `contentChildren()`, not rendered directly in the template. Keep it only in the spec's `TestHostComponent.imports[]`.
- **No `fakeAsync` in Vitest** — Angular 21 uses Vitest as the test runner (not Karma). `fakeAsync`/`tick` from `@angular/core/testing` throw a zone error. Use `vi.useFakeTimers()` / `vi.advanceTimersByTime(ms)` / `vi.useRealTimers()` from `vitest` instead.
- **`ng new` creates a subdirectory** — `ng new <name>` always nests files. When creating the workspace in the repo root, files need to be moved up manually.
- **Browser flag removed** — `ng test --browsers=ChromeHeadless` fails; Vitest uses its own browser provider. Run `ng test ngx-pk-ui --no-watch` directly.
- **pk-tabs is NgModule-based** — import `PkTabsModule` (not individual components). It uses `*ngFor` and `*ngTemplateOutlet` internally. Do NOT try to make it standalone — it was copied from a working project intentionally.
- **Never use `{{ }}` inside `<pre><code>` blocks** — Angular template compiler evaluates interpolations even in HTML-escaped content. `&#123;&#123;` decodes to `{{` before template compilation, causing binding errors. Use `{{ '{' }}{{ '{' }} expr {{ '}' }}{{ '}' }}` — each brace as a separate interpolation. `{ { expr } }` (space-separated) also fails with NG5002 ICU parse error.
- **`pkTooltip` does not work on `<pk-dg-column>`** — that component uses `host: { style: 'display: contents' }` so it has no bounding box. Apply `[pkTooltip]` to an inner `<span>` instead.
- **`provideHttpClient()` required for HttpClient** — add to `providers` in `app.config.ts` when any component uses `inject(HttpClient)`.
- **Datagrid NG0100 fix** — `PkDgHeaderComponent` reads `textContent` in `ngAfterViewInit` (fires after parent CD). Fix: moved to `ngAfterContentInit`. This prevents ExpressionChangedAfterItHasBeenCheckedError in Angular 19+.
- **Datagrid pagination CSS** — internal buttons use `pk-dg-btn` / `pk-dg-btn-active` / `pk-dg-btn-nav` (self-contained SCSS). No dependency on external `btn` classes — safe alongside Bootstrap or any other CSS framework.
- **Datagrid row selection DI** — `PkDgRowComponent` injects `PkDatagridComponent` via `@Optional() @Inject(forwardRef(() => PkDatagridComponent))`. Do NOT add `providers: [{ provide: forwardRef(…), useExisting: … }]` to `PkDatagridComponent` — that creates a circular dependency (NG0200). Angular resolves the ancestor component via the injector tree automatically without any explicit provider registration.
- **Datagrid rows not clearing on empty array** — When `items` changes from a populated array to `[]` or `null`, old rows stayed rendered. Root cause: `updateDisplayedItems()` returned early on empty without incrementing `displayedItemsVersion`, so `PkDgRowsDirective.ngDoCheck()` saw no version change and skipped `renderItems()`. Fix: always increment `displayedItemsVersion` (and reset `pagination.rowCount = 0`) even when items is empty.

---

## Current project status

| Item | State |
|------|-------|
| Library package name | `ngx-pk-ui` |
| Library version | `2.4.4` |
| Angular version | `^21.0.0` (CLI 21.0.3) |
| `pk-accordion` | ✅ Built, tested (8 tests) |
| `pk-tabs` | ✅ Built, tested (4 tests) — NgModule-based (PkTabsModule) |
| `pk-timeline` | ✅ Built — no tests yet |
| `pk-toastr` | ✅ Built, tested (4 tests) |
| `pk-alert` | ✅ Built, tested (13 tests) |
| `pk-modal` | ✅ Built, tested (16 tests) — `lockScroll` input (default `true`): locks body scroll + compensates scrollbar width |
| `pk-icon` | ✅ Built |
| `pk-datagrid` | ✅ Built (NgModule) — row selection (single/multiple); bug fix: rows now clear correctly when array resets to `[]` |
| `pk-datepicker` | ✅ Built |
| `pk-progress` | ✅ Built |
| `pk-treeview` | ✅ Built (NgModule) |
| `pk-select` | ✅ Built |
| `pk-autocomplete` | ✅ Built |
| `pk-typeahead` | ✅ Built |
| `pk-tooltip` | ✅ Built |
| `pk-calendar` | ✅ Built — Year/Month/Week/Day/Agenda views, drag & drop, multi-day bars, built-in form, TH/EN locale |
| `pk-file-upload` | ✅ Built, tested (14 tests) — drag & drop, browser-native preview (image/PDF/text), upload button, maxSize/maxFiles validation |
| `pk-sidenav` | ✅ Built — left/right, full/icon/auto mode, multi-level, badge, 4 themes, CSS-variable override, content slots |
| `pk-grid` (CSS only) | ✅ Shipped as `dist/ngx-pk-ui/styles/pk-grid.css` |
| `pk-btn` (CSS only)  | ✅ Shipped as `dist/ngx-pk-ui/styles/pk-btn.css` |
| `pk-spinner` (CSS only) | ✅ Shipped as `dist/ngx-pk-ui/styles/pk-spinner.css` |
| `pk-badge` (CSS only)   | ✅ Shipped as `dist/ngx-pk-ui/styles/pk-badge.css` |
| `pk-card` (CSS only)    | ✅ Shipped as `dist/ngx-pk-ui/styles/pk-card.css` |
| `pk-table` (CSS only)   | ✅ Shipped as `dist/ngx-pk-ui/styles/pk-table.css` |
| `pk-toggle` (CSS only)  | ✅ Shipped as `dist/ngx-pk-ui/styles/pk-toggle.css` |
| `pk-breadcrumb` (CSS only) | ✅ Shipped as `dist/ngx-pk-ui/styles/pk-breadcrumb.css` |
| `pk-form` (CSS only) | ✅ Shipped as `dist/ngx-pk-ui/styles/pk-form.css` — included in pk-ui.css |
| `pk-layout` (CSS only) | ✅ Shipped as `dist/ngx-pk-ui/styles/pk-layout.css` — included in pk-ui.css |
| `pk-font` (CSS only, opt-in) | ✅ Shipped as `dist/ngx-pk-ui/styles/pk-font.css` — NOT in pk-ui.css |
| `pk-icon-font` (CSS only) | ✅ Shipped as `dist/ngx-pk-ui/styles/pk-icon-font.css` |
| Example app (`projects/example/`) | ✅ Sidebar nav + lazy-routed pages for every section; 3 example pages: login, chat, dashboard |
| npm published | ✅ Published |

**Test totals: 76 / 76 passing**

### Suggested next components
- `pk-stepper` — multi-step wizard / stepper
- `pk-pagination` — standalone pagination component (reuse datagrid logic)
- `pk-drawer` — slide-in side panel / off-canvas drawer
- `pk-kanban` — drag-and-drop kanban board
- `pk-image-viewer` — lightbox / image viewer (works with pk-file-upload previews)
- `pk-command-palette` — keyboard-driven command palette (works with pk-sidenav)

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
<span class="pk-badge pk-badge-success pk-badge-pill">v2.4.4</span>

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
```

### Modifiers
| Modifier | Description |
|----------|-------------|
| `pk-card-shadow` | Elevated shadow |
| `pk-card-flat` | No shadow |
| `pk-card-outlined` | Border only, no shadow |

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
<p class="pk-font-sarabun">สวัสดี</p>
<p class="pk-font-kanit">สวัสดี</p>
<p class="pk-font-phetsarath">ສະບາຍດີ</p>
```

| Class | Font | Script |
|-------|------|--------|
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
| `badge` | `number\|string?` | Badge count shown on item |
| `disabled` | `boolean?` | Prevent selection |
| `children` | `PkSidenavItem[]?` | Nested items (multi-level) |

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
- **Themes**: `light` (white) · `dark` (slate-800) · `primary` (green-800) · `custom` (fully overridable via `themeConfig`)
