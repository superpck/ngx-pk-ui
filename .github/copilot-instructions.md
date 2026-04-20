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
npx vitest run projects/ngx-pk-ui/src/lib/pk-tabs/pk-tabs.spec.ts

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
        pk-tabs/
          pk-tab.ts        ← child component: one tab item (used via content projection)
          pk-tabs.ts       ← parent container: manages active tab with signals
          pk-tabs.html / .css
          pk-tabs.spec.ts
        pk-toastr/
          pk-toastr.model.ts    ← Toast interface and ToastType
          pk-toastr.service.ts  ← injectable service: success/error/info/warning/dismiss/clear
          pk-toastr.ts          ← component that renders the toast container (add once to AppComponent)
          pk-toastr.html / .css
          pk-toastr.spec.ts
        pk-alert/
          pk-alert.model.ts     ← AlertType, AlertInputType, AlertConfig, AlertSlot interfaces
          pk-alert.service.ts   ← injectable service: success/warn/error/confirm/input → Promise
          pk-alert.ts           ← modal overlay component (add once to AppComponent)
          pk-alert.html / .css
          pk-alert.spec.ts
  src/styles/
    pk-grid.css                 ← standalone CSS grid system (copy to dist/ngx-pk-ui/styles/)
    pk-btn.css                  ← standalone CSS button system (copy to dist/ngx-pk-ui/styles/)
  example/                 ← local dev/test app (gitignored, never published)
    src/app/
      app.ts               ← imports PkTabs, PkTab, PkToastr, PkToastrService from 'ngx-pk-ui'
      app.html             ← demo page: tabs + toastr buttons
      app.css
```

`dist/ngx-pk-ui/` is the build output consumed by npm. Never edit files there.
`projects/example/` is gitignored — it is only for local visual testing.

## Key conventions

### Angular 21 patterns used throughout
- **Signals** (`signal()`, `input()`, `contentChildren()`, `viewChild()`) — no `@Input`/`@Output` decorators.
- **`input.required<T>()`** for required component inputs.
- **`contentChildren(Token)`** (not `@ContentChildren`) for querying projected content.
- **Standalone components only** — no NgModules.
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

Uses **content projection** — `<pk-tab>` children are discovered via `contentChildren()`, not passed as inputs.

```html
<!-- Import both PkTabs and PkTab in the consuming component's imports[] -->
<pk-tabs>
  <pk-tab label="Profile">
    <p>Profile content here</p>
  </pk-tab>
  <pk-tab label="Settings">
    <p>Settings content here</p>
  </pk-tab>
  <pk-tab label="Disabled" [disabled]="true">
    <p>Never shown</p>
  </pk-tab>
</pk-tabs>
```

**`PkTab` inputs:**
| Input | Type | Required | Default |
|-------|------|----------|---------|
| `label` | `string` | ✅ | — |
| `disabled` | `boolean` | ❌ | `false` |

**`PkTabs` public API:**
| Member | Type | Description |
|--------|------|-------------|
| `tabs` | `Signal<PkTab[]>` | All projected `<pk-tab>` children |
| `activeIndex` | `WritableSignal<number>` | Index of the currently active tab |
| `selectTab(index)` | `void` | Programmatically activate a tab |

---

### pk-toastr

Place `<pk-toastr>` **once** in your root component template (e.g. `app.component.html`). Then inject `PkToastrService` anywhere to show notifications.

```html
<!-- app.component.html -->
<router-outlet />
<pk-toastr />
```

```ts
// any component or service
import { PkToastrService } from 'ngx-pk-ui';

@Component({ ... })
export class MyComponent {
  toastr = inject(PkToastrService);

  save() {
    this.toastr.success('Saved!', 'Success');          // message, optional title
    this.toastr.error('Failed', 'Error', 0);           // duration=0 means persist until dismissed
    this.toastr.warning('Check your input');
    this.toastr.info('Processing...', undefined, 8000); // 8-second duration
  }
}
```

**`PkToastrService` methods:**
| Method | Signature |
|--------|-----------|
| `success` | `(message, title?, duration?) => void` |
| `error` | `(message, title?, duration?) => void` |
| `info` | `(message, title?, duration?) => void` |
| `warning` | `(message, title?, duration?) => void` |
| `dismiss` | `(id: number) => void` |
| `clear` | `() => void` |
| `show` | `(type, message, title?, duration?) => void` |

Default `duration` is **4000 ms**. Pass `0` to keep toast until manually dismissed.

---

## Exported public symbols

Everything in `projects/ngx-pk-ui/src/public-api.ts`:

| Symbol | Kind | File |
|--------|------|------|
| `PkTab` | Component | `pk-tabs/pk-tab` |
| `PkTabs` | Component | `pk-tabs/pk-tabs` |
| `Toast` | Interface | `pk-toastr/pk-toastr.model` |
| `ToastType` | Type alias | `pk-toastr/pk-toastr.model` |
| `PkToastrService` | Injectable service | `pk-toastr/pk-toastr.service` |
| `PkToastr` | Component | `pk-toastr/pk-toastr` |
| `AlertType` | Type alias | `pk-alert/pk-alert.model` |
| `AlertInputType` | Type alias | `pk-alert/pk-alert.model` |
| `AlertConfig` | Interface | `pk-alert/pk-alert.model` |
| `AlertSlot` | Interface | `pk-alert/pk-alert.model` |
| `AlertResult` | Type alias | `pk-alert/pk-alert.model` |
| `PkAlertService` | Injectable service | `pk-alert/pk-alert.service` |
| `PkAlert` | Component | `pk-alert/pk-alert` |

---

## Known gotchas (discovered during initial build)

- **`PkTab` must NOT be in `PkTabs.imports[]`** — Angular 21 warns "not used within the template" because `PkTab` is only consumed via `contentChildren()`, not rendered directly in the template. Keep it only in the spec's `TestHostComponent.imports[]`.
- **No `fakeAsync` in Vitest** — Angular 21 uses Vitest as the test runner (not Karma). `fakeAsync`/`tick` from `@angular/core/testing` throw a zone error. Use `vi.useFakeTimers()` / `vi.advanceTimersByTime(ms)` / `vi.useRealTimers()` from `vitest` instead.
- **`ng new` creates a subdirectory** — `ng new <name>` always nests files. When creating the workspace in the repo root, files need to be moved up manually.
- **Browser flag removed** — `ng test --browsers=ChromeHeadless` fails; Vitest uses its own browser provider. Run `ng test ngx-pk-ui --no-watch` directly.
- **`NgTemplateOutlet` must be imported** — even though it's from `@angular/common`, it is not included automatically in standalone components. Add it to `imports: [NgTemplateOutlet]` in `PkTabs`.

---

## Current project status

| Item | State |
|------|-------|
| Library package name | `ngx-pk-ui` |
| Library version | `0.0.1` |
| Angular version | `^21.0.0` (CLI 21.0.3) |
| `pk-tabs` | ✅ Built, tested (4 tests) |
| `pk-toastr` | ✅ Built, tested (4 tests) |
| `pk-alert` | ✅ Built, tested (13 tests) |
| `pk-grid` (CSS only) | ✅ Built, shipped as `dist/ngx-pk-ui/styles/pk-grid.css` |
| `pk-btn` (CSS only)  | ✅ Built, shipped as `dist/ngx-pk-ui/styles/pk-btn.css` |
| Example app (`projects/example/`) | ✅ Created, gitignored, wired to library |
| npm published | ❌ Not yet |

### Suggested next components
- `pk-modal` — overlay dialog with backdrop, close-on-Escape, focus trap
- `pk-spinner` — loading indicator with size/color inputs
- `pk-badge` — numeric/status badge overlay
- `pk-tooltip` — hover tooltip using Angular CDK overlay (or pure CSS)
- `pk-accordion` — collapsible panels, similar pattern to `pk-tabs` (parent + child content projection)

---

## pk-grid CSS reference

`pk-grid.css` is a **pure CSS file** — no Angular component needed. Include it in consumers' global styles.

**In an Angular app** (`angular.json` styles array):
```json
"styles": ["node_modules/ngx-pk-ui/styles/pk-grid.css", "src/styles.css"]
```

**Or via CSS import:**
```css
@import 'ngx-pk-ui/styles/pk-grid.css';
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
