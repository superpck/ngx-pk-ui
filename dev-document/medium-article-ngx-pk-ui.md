# ngx-pk-ui: A Modern Angular 21 Component Library Built with Signals

> **Draft for Medium.com** — May 2026
> 📸 = screenshot needed (see inline notes)

---

## Introduction

If you've been building Angular applications and find yourself re-implementing the same UI pieces — toasts, modals, datepickers, data grids — over and over again, you're not alone. That's exactly why **ngx-pk-ui** was created.

`ngx-pk-ui` is an open-source Angular 21 component library that packages 29 components, 12 CSS utilities, 5 pipes, and 5 directives into a single, well-tested package. It's built from the ground up using Angular's latest signal-based APIs, so everything feels native to modern Angular development.

---

📸 **[SCREENSHOT 1]** — Hero image: the live demo site overview page (https://superpck.github.io/ngx-pk-ui/) showing the stats bar (29 components / 12 CSS / 5 pipes / 5 directives / 17 locales / 358 tests) and the component category chips.

---

## What Makes It Different?

There are already many Angular UI libraries out there — PrimeNG, Angular Material, ng-zorro. So why another one?

### 1. Signal-First, No Decorators

Every component is built using Angular 21's signal APIs. You won't find a single `@Input()` or `@Output()` decorator in the source code. Instead, it uses:

```ts
// Inputs are declared as signals
label = input.required<string>();
open  = input<boolean>(false);

// Child components queried reactively
items = contentChildren(PkAccordionItem);
```

This means components integrate naturally into reactive signal graphs and work without Zone.js.

### 2. Truly Standalone

Every component in the library is standalone. There are no root NgModules to configure, no `forRoot()` calls, no module barrel imports. You add exactly what you need:

```ts
@Component({
  imports: [PkModal, PkModalHeader, PkModalBody, PkModalFooter],
})
export class MyComponent {}
```

(A handful of legacy-pattern components like `PkTabsModule` and `PkDatagridModule` still use NgModule for internal reasons, but even those are imported as a single module.)

### 3. 17 Locale Support

One of the standout features is first-class internationalization. The `PkLocale` token is shared across the calendar, datepicker, heatmap, and date pipe — you set the locale once and every component adapts. Supported locales include English, Thai, Lao, Arabic (RTL), Japanese, Korean, Chinese (Simplified & Traditional), French, German, Spanish, Italian, Portuguese, Russian, Hindi, and Vietnamese.

The Thai Buddhist Era calendar is fully supported — the datepicker, calendar, and `pkDate` pipe all handle BE year offsets (year + 543) natively.

### 4. CSS Without Angular Dependencies

Buttons, badges, spinners, cards, grid, form fields — these are all delivered as **pure CSS files** with no Angular component required. You just add the stylesheet and start using classes. Colors are driven by CSS custom properties, so theming is as simple as:

```css
:root {
  --pk-btn-primary: #6d28d9; /* change every button with one variable */
}
```

---

## Getting Started in 2 Minutes

```bash
npm install ngx-pk-ui
```

Add the styles to `angular.json`:

```json
"styles": ["node_modules/ngx-pk-ui/styles/pk-ui.css"]
```

Import and use components:

```ts
import { PkToastrService, PkAlertService } from 'ngx-pk-ui';

@Component({ imports: [] })
export class MyComponent {
  toastr = inject(PkToastrService);
  alert  = inject(PkAlertService);

  save() {
    this.toastr.success('Saved successfully!', 'Done');
  }

  async delete() {
    const confirmed = await this.alert.confirm('Delete this item?');
    if (confirmed) { /* proceed */ }
  }
}
```

> **Note:** `PkToastrService` and `PkAlertService` auto-mount their UI containers into `<body>` on first inject — no template tag required.

---

📸 **[SCREENSHOT 2]** — Code snippet side-by-side with the rendered toast notification appearing in the top-right corner of the browser. Use the `/pk-toastr` demo page.

---

## A Tour of the Components

### Forms & Input

The library covers the full spectrum of form controls:

- **`pk-datepicker`** — supports 17 locales, Thai Buddhist Era, range selection, and clear button
- **`pk-timepicker`** — three input styles (spinner / number / dropdown), 12H/24H, ControlValueAccessor
- **`pk-select`** — single and multi-select with search
- **`pk-autocomplete`** / **`pk-typeahead`** — local and async autocomplete with keyboard navigation
- **`pk-input-password`** — show/hide toggle with an optional 4-level strength meter
- **`pk-radio-group`** — vertical/horizontal layout, per-option disabled, ControlValueAccessor
- **`pk-textarea`** — full rich-text editor (bold, italic, font, colour, lists, blockquote, dark mode)

All form components implement `ControlValueAccessor` and work with both `ngModel` and reactive forms.

---

📸 **[SCREENSHOT 3]** — Side-by-side: `pk-datepicker` in Thai locale (BE year visible) and `pk-timepicker` in dropdown mode. Use the `/pk-datepicker` and `/pk-timepicker` demo pages.

---

### Data & Display

- **`pk-datagrid`** — sortable, filterable, resizable columns, pagination, row detail expansion, single/multiple row selection
- **`pk-calendar`** — Year / Month / Week / Day / Agenda views, drag-and-drop events, multi-day event bars, 17-locale toolbar labels, built-in event form
- **`pk-heatmap`** — GitHub-style activity heatmap with 4 colour schemes and locale-aware labels
- **`pk-treeview`** — hierarchical tree with expand/collapse
- **`pk-markdown-viewer`** — zero-dependency Markdown renderer with Print, Export .md, and Export .html buttons

---

📸 **[SCREENSHOT 4]** — `pk-calendar` in Month view showing a few events with drag-and-drop. Use the `/pk-calendar` demo page.

📸 **[SCREENSHOT 5]** — `pk-datagrid` with sorting and row selection enabled. Use the `/pk-datagrid` demo page.

---

### Barcode & QR

Three components cover code generation and scanning end-to-end:

- **`pk-barcode`** — pure TypeScript encoder for Code 128, Code 39, EAN-13, EAN-8; outputs inline SVG; `downloadSvg()` / `downloadPng()`
- **`pk-qrcode`** — full QR matrix encoder (versions 1–40, EC levels L/M/Q/H, 8 mask patterns); center logo support with automatic EC level upgrade; inline SVG
- **`pk-code-reader`** — scans QR codes and barcodes via the native `BarcodeDetector` API (zero deps); jsQR fallback for iOS/Firefox; camera, image upload, and clipboard paste; canvas viewfinder overlay; AudioContext beep; torch toggle; Android LINE WebView permission-denied fallback

```html
<pk-qrcode value="https://github.com/superpck/ngx-pk-ui" ecLevel="H" [size]="200" logo="assets/logo.png" />
```

---

📸 **[SCREENSHOT 6]** — `pk-qrcode` with a center logo, and `pk-barcode` showing EAN-13 side by side. Use the `/pk-qrcode` and `/pk-barcode` demo pages.

---

### Feedback & Overlay

- **`pk-toastr`** — 9 positions, progress bar, persist mode (`duration: 0`)
- **`pk-alert`** — `success` / `warn` / `error` / `confirm` / `input` dialog — all return Promises
- **`pk-modal`** — 5 size presets, blur backdrop, body scroll lock, slot components (`pk-modal-header`, `pk-modal-body`, `pk-modal-footer`)
- **`pk-tooltip`** — CSS-driven, appended to `<body>`, 10 colour variants
- **`pk-context-menu`** — right-click menu via `[pkContextMenu]` directive; 7 themes; mobile long-press; keyboard navigation

---

📸 **[SCREENSHOT 7]** — `pk-alert` confirm dialog and `pk-context-menu` with the dark theme open together. Use the `/pk-alert` and `/pk-context-menu` demo pages.

---

### Layout & Navigation

- **`pk-sidenav`** — full / icon / auto-responsive mode, left/right position, 4 built-in themes, CSS-variable override, multi-level items with badges
- **`pk-split`** — resizable split pane (horizontal or vertical), touch support
- **`pk-tabs`** — scrollable or wrapping tab bar, active/disabled states
- **`pk-accordion`** — single-open or multi-open panels, content projection

---

📸 **[SCREENSHOT 8]** — `pk-sidenav` in dark theme showing icon mode (collapsed) vs full mode (expanded). Use the `/pk-sidenav` demo page.

---

## The Pipes

Five standalone pipes ship with the library:

| Pipe | Usage |
|------|-------|
| `pkDate` | Locale-aware date formatting with Buddhist Era support |
| `pkTruncate` | Truncate a string to N characters |
| `pkTimeAgo` | Relative time — "3 minutes ago" |
| `pkFileSize` | Format bytes as "1.4 MB" |
| `pkHighlight` | Wrap search term matches in `<mark>` (XSS-safe) |

The `pkDate` pipe is particularly powerful — it supports 17 locales, abbreviated and full month names, and Buddhist Era years with a simple parameter:

```html
{{ order.createdAt | pkDate:'dd/mm/yyyy':'abbr':'th':'BE' }}
<!-- Output: 19 พ.ค. 2569 -->
```

---

📸 **[SCREENSHOT 9]** — The `/pk-pipes` demo page showing `pkDate` with multiple locales and BE/CE era toggle.

---

## The Directives

Five utilities that attach to any element:

- **`pkClickOutside`** — fires when the user clicks outside a panel
- **`pkCopyToClipboard`** — copies a value to the clipboard on click
- **`pkAutoFocus`** — focuses an input on render
- **`pkDebounceClick`** — fires after a debounce delay to prevent double-submit
- **`pkNumberOnly`** — restricts an input to numeric characters

---

## Example Apps

The repository ships with three example pages built entirely from ngx-pk-ui components:

- **Login** — full-bleed card layout with floating-label form fields and password strength meter
- **Chat** — icon sidenav, conversation list, message pane
- **Dashboard** — pk-sidenav + topbar + stat cards + placeholder charts

---

📸 **[SCREENSHOT 10]** — The three example pages side-by-side (Login, Chat, Dashboard). Use the `/examples/login`, `/examples/chat`, `/examples/dashboard` routes.

---

## Testing Philosophy

The library ships with **358 unit tests** across all components, written with **Vitest** (Angular 21's default test runner). Key conventions:

- No `fakeAsync`/`tick` — replaced with `vi.useFakeTimers()` / `vi.advanceTimersByTime()`
- Every component has a co-located `.spec.ts`
- DOM tests use a `TestHostComponent` wrapper to exercise real content projection

---

## Installation & Links

```bash
npm install ngx-pk-ui
```

| Resource | Link |
|----------|------|
| npm | https://www.npmjs.com/package/ngx-pk-ui |
| GitHub | https://github.com/superpck/ngx-pk-ui |
| Live Demo | https://superpck.github.io/ngx-pk-ui/ |

---

## Conclusion

`ngx-pk-ui` fills a gap for Angular teams that want a modern, signal-based component library that doesn't force you into a specific design system. Whether you're building a Thai-language enterprise dashboard or a multilingual SaaS product, it gives you the building blocks without the boilerplate.

The library is actively maintained, fully open-source (MIT license), and welcomes contributions. Give it a try and let us know what you think.

---

*Happy coding!*

---

## 📸 Screenshot Checklist

| # | What to capture | Page / Route |
|---|-----------------|--------------|
| 1 | Home page — stats bar + category chips | `/home` |
| 2 | `pk-toastr` demo — toast appearing in top-right | `/pk-toastr` |
| 3 | `pk-datepicker` Thai locale + `pk-timepicker` dropdown | `/pk-datepicker` + `/pk-timepicker` |
| 4 | `pk-calendar` Month view with events + drag-and-drop | `/pk-calendar` |
| 5 | `pk-datagrid` with sort + row selection | `/pk-datagrid` |
| 6 | `pk-qrcode` with logo + `pk-barcode` EAN-13 | `/pk-qrcode` + `/pk-barcode` |
| 7 | `pk-alert` confirm dialog + `pk-context-menu` dark | `/pk-alert` + `/pk-context-menu` |
| 8 | `pk-sidenav` icon mode vs full mode (dark theme) | `/pk-sidenav` |
| 9 | `pk-pipes` demo — pkDate multi-locale output | `/pk-pipes` |
| 10 | Three example pages side-by-side | `/examples/login` + `/examples/chat` + `/examples/dashboard` |

> **Tip:** Use browser zoom 80% for wider captures, and use the browser's device toolbar at ~1280px width for consistent screenshots. Consider using a screen capture tool that captures at 2x (Retina) resolution.
