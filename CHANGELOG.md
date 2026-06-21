# Changelog

All notable changes to **ngx-pk-ui** are documented here.

---

## [3.0.0] — 2026-06-21

### Changed
- **Angular 22**: migrated from Angular 21 to Angular 22 (major version bump)
  - Updated all `@angular/*` dependencies to `^22.0.0`
  - `peerDependencies` updated to `@angular/common ^22.0.0` / `@angular/core ^22.0.0`
  - Applied `ChangeDetectionStrategy.Eager` across all library components via `ng update` schematics
  - All 433 Vitest unit tests passing under the new engine
- **Security**: resolved all `npm audit` vulnerabilities via `overrides` for `esbuild`, `piscina`, and `@babel/core`

---

## [2.18.4] — 2026-06-12

### Fixed
- **pk-datepicker**: `[style]` now controls both `width` and `height` — style string is applied to the `<input>` element directly (inline style), overriding the default `height: 35px` in SCSS. e.g. `[style]="'width: 160px; height: 28px'"`
- **pk-select**: `[customStyle]` now correctly controls `height` — added `box-sizing: border-box` to `.pk-select-trigger` so the specified height is the total height (border + padding included). e.g. `[customStyle]="{ width: '240px', height: '40px' }"`
- **pk-select**: checkbox in `mode="multi"` not updating visually — changed from `(click)` + `preventDefault()` to `(change)` event, and replaced `isSelected()` method with a `selectedValuesSet = computed(() => new Set(...))` signal for reliable reactivity in all change-detection strategies (including OnPush and zoneless)

---

## [2.18.3] — 2026-06-12

### Added
- **pk-datepicker**: add `style` for addjust css e.g., [style]="'width: 100px'"

---

## [2.18.2] — 2026-06-02

### Added
- **pk-font**: 5 new Latin / general-purpose Google Fonts — `Roboto`, `Montserrat`, `Open Sans`, `Lato`, `Poppins` (all under SIL Open Font License 1.1); available as `pk-font-roboto`, `pk-font-montserrat`, `pk-font-open-sans`, `pk-font-lato`, `pk-font-poppins`

---

## [2.18.1] — 2026-06-01

### Added
- **pk-sidenav**: 6 new built-in themes — `blue` (#1e40af), `teal` (#0f766e), `indigo` (#4338ca), `terra-cotta` (#bd5d38), `air-force-blue` (#5d8aa8), `peacock-blue` (#005f73); total 10 built-in themes (light, dark, primary, orange + 6 new) + custom theme support
- **pk-btn example page**: comprehensive API Reference section — base class table, variant classes (primary/secondary/success/warn/error), modifier classes (outline/shadow/sm/lg), button group, disabled attribute, installation guide

---

## [2.18.0] — 2026-05-31

### Added
- **pk-float-btn** (CSS only): floating action button utility — `pk-float-btn` base class with position modifiers (`--top-left`, `--top-center`, `--top-right`, `--bottom-left`, `--bottom-center`, `--bottom-right`) and color variants (`--secondary`, `--success`, `--error`, `--warning`); fixed positioning with smooth scale/shadow transitions; included in `pk-ui.css`
- **pk-sidenav**: new `orange` theme — orange-600 background (`#ea580c`), orange-50 text, white active/hover overlays, orange-200 headings

---

## [2.17.1] — 2026-05-25

### Changed
- **pk-datagrid example**: updated Demo section to show **both** `[pkDgToolbar]` and `<pk-dg-footer>` patterns in one grid — Reload button stays in toolbar (top); Export button + pagination share the footer row (bottom) with `justify-content: space-between`

---

## [2.17.0] — 2026-05-25

### Added
- **pk-export**: new data-export module — pure TypeScript, zero external dependencies
  - **`PkExportService`** (`providedIn: 'root'`) — 7 methods: `csv()`, `tsv()`, `json()`, `xml()`, `xlsx()`, `html()`, `text()` — each triggers a browser download
  - **`PkExportButton`** — standalone component with dropdown; `data`, `formats`, `filename`, `label`, `disabled`, `customClass`, `customStyle`, per-format `*Options` inputs; `(beforeExport)` / `(afterExport)` outputs
  - **Pure encoder functions** (tree-shakable, exported individually): `toCsv()`, `toTsv()`, `toJson()`, `toXml()`, `toHtml()`, `toText()`, `toXlsx()`, `downloadFile()`
  - **Formats supported**: `csv` (UTF-8 BOM for Excel Thai support), `tsv`, `json`, `xml`, `xlsx` (SpreadsheetML / ZIP STORE — no `CompressionStream`, universal browser support), `html` (standalone styled table), `text`
  - All format options: `columns` / `headers` filtering, custom delimiters, `bom`, `indent`, root/item tags, `sheetName`, `standalone` HTML, etc.
  - 50 new tests (37 encoder + service, 13 component)
- **pk-datagrid** — `[pkDgToolbar]` content projection slot: place any buttons/controls above the table. Slot is rendered as a flex toolbar row with `border-bottom`; hidden automatically when empty via `:empty { display: none }`.

---

## [2.16.3] — 2026-05-24

### Added
- **pk-card**: new color variants `pk-card-warn` (orange, `--pk-btn-warn` / #fb8c00) and `pk-card-info` (teal, `--pk-btn-info` / #00897b) — colored header bg + matching border + tinted footer, consistent with existing primary/secondary/success/error variants

---

## [2.16.2] — 2026-05-23

### Added
- **pk-breadcrumb**: new Angular component `PkBreadcrumb` — wraps the existing CSS with full event support
  - `items: PkBreadcrumbItem[]` input — each item has `label`, `key?`, `route?`, `href?`, `hrefTarget?`, `disabled?`
  - `separator: 'default' | 'slash' | 'dot' | 'arrow'` input — maps to the existing CSS variant classes
  - `size: 'sm' | 'md' | 'lg'` input
  - `bg: boolean` input — adds `pk-breadcrumb--bg` pill background
  - `(itemClick)` output — emits `PkBreadcrumbItem` when a non-active, non-disabled item is clicked
  - `(itemDblClick)` output — emits `PkBreadcrumbItem` on double-click
  - Items without `route` / `href` render as `<button>` — click events fire without any page navigation
  - Items with `route` render as `<a [routerLink]>` (with `routerLinkActive`); items with `href` render as `<a [href]>`
- **pk-sidenav `PkSidenavItem`**: new `fn?: () => void` field — callback executed on item click; called in both full and icon-only modes alongside `(itemClick)` output

### Fixed
- **pk-sidenav**: body could not scroll when the sidenav height was fixed (e.g. `height: 600px`) — root cause was `:host` and `.pk-sidenav` using only `min-height: 100%` instead of `height: 100%`, preventing the flex container from being constrained. Fixed by adding `height: 100%` to both `:host` and `.pk-sidenav` (keeping `min-height: 100%` as well for cases where the parent is shorter than the content).

---

## [2.16.1] — 2026-05-22

### Fixed
- **pk-sidenav**: `route` field was declared on `PkSidenavItem` but never used in the template — items were always rendered as plain `<div>` elements. Fixed by rendering `<a [routerLink]>` with `routerLinkActive="pk-snv-item--active"` when `route` is set.

### Changed
- **pk-sidenav `PkSidenavItem`**: `route` type widened from `string` to `string | any[]` to support full Angular `[routerLink]` syntax (e.g. `['/users', id]`).

### Added
- **pk-sidenav `PkSidenavItem`**: new `href?: string` field — renders item as `<a [href]>` for external/internal URL links.
- **pk-sidenav `PkSidenavItem`**: new `hrefTarget?: '_blank' | '_self'` field — `'_blank'` opens in a new tab; `'_self'` (default) opens in the same tab.
- **pk-sidenav**: clicking a `route` or `href` item that has `children` calls `preventDefault()` on the click event — submenu toggles instead of navigating.

---

## [2.16.0] — 2026-05-22

### Added
- **pk-otp**: new OTP / PIN input component
  - 1–16 cells (default 6); `length` input clamped to valid range
  - `type: 'number' | 'char' | 'none'` — digits only / letters only / any printable character
  - `capital: boolean` — auto-uppercase input when `type='char'`
  - `size: 'sm' | 'md' | 'lg'` — three cell size presets
  - `title` and `text` labels displayed above the cells (e.g. `text="ref: TXN-001"`)
  - `showString: string | null` — mask character (e.g. `'*'`, `'•'`); `null` shows actual input
  - `showTime: number (ms)` — brief reveal duration before masking; `0` = mask immediately
  - Animated pulse/blink border on focus (CSS keyframe, no JS)
  - `ngModel` / `FormControl` binding via `ControlValueAccessor`
  - Keyboard navigation: ArrowLeft / ArrowRight / Backspace / Delete
  - Paste support (fills from pasted string, skips invalid chars per `type`)
  - Browser OTP autofill (`autocomplete="one-time-code"`, `inputmode` hints)
  - `(onChange)` — emits joined value on every keystroke
  - `(onComplete)` — emits when all cells are filled
  - `customClass` / `customStyle` / `disabled` inputs
  - 23 Vitest tests (all passing)

---

## [2.15.1] — 2026-05-19

### Changed
- **Example app — Home page redesign**: replaced the old Usage + Notes sections with a stats bar (29 components / 12 CSS utilities / 5 pipes / 5 directives / 17 locales / 358 tests), a "Why ngx-pk-ui?" feature-highlight grid, a Quick Start snippet, a component-categories chip map, and an Angular version compatibility table
- **Example app — Installation page**: new dedicated `/installation` page with a full 5-step setup guide (npm install, global styles, import components, inject services, NgModule-based components table); added to sidebar after Overview
- **Example app — Angular version compatibility table** moved from Installation page to Home page

---

## [2.15.0] — 2026-05-19

### Added
- **pk-pipes: `PkDatePipe`** (`pkDate`) — locale-aware date formatting pipe with Buddhist Era support
  - Format string with embedded separators and order tokens: `d` `dd` `m` `mm` `yyyy` `yy`
  - Three month styles: `numeric` (number), `abbr` (short name from `monthNamesShort`), `full` (from `monthNamesFull`)
  - 17 locales via `PkLocale` / `PkLocaleData`
  - `era: 'CE' | 'BE'` — adds 543 years for Thai Buddhist Era output
  - Input types: `Date | number | string`
- **`parseBEDate()`** utility function — converts a Buddhist Era date string (e.g. `"31/01/2568"`) to a CE `Date`
  - Parameters: `value`, `separator` (default `/`), `order: 'dmy'|'mdy'|'ymd'` (default `'dmy'`)
  - Exported from `ngx-pk-ui`

---

## [2.14.0] — 2026-05-19

### Added
- **pk-pipes**: four new standalone Angular pipes for common formatting tasks
  - `PkTruncatePipe` (`pkTruncate`) — truncate a string to N chars with custom ellipsis
  - `PkTimeAgoPipe` (`pkTimeAgo`) — relative time string from a past date ("3 minutes ago")
  - `PkFileSizePipe` (`pkFileSize`) — format raw byte count as human-readable size (B / KB / MB / GB / TB)
  - `PkHighlightPipe` (`pkHighlight`) — wrap search term matches in `<mark class="pk-highlight">` (XSS-safe, use with `[innerHTML]`)
- **pk-directives**: five new standalone Angular directives for common DOM interactions
  - `PkClickOutsideDirective` (`[pkClickOutside]`) — emit `(pkClickOutside)` when user clicks outside the host
  - `PkCopyToClipboardDirective` (`[pkCopyToClipboard]`) — copy text to clipboard on click; emit `(pkCopied)` true/false
  - `PkAutoFocusDirective` (`[pkAutoFocus]`) — focus host element on `AfterViewInit`; disable conditionally via `[pkAutoFocus]="false"`
  - `PkDebounceClickDirective` (`[pkDebounceClick]`) — debounce click events; emit `(pkDebounceClicked)` after delay (default 300 ms)
  - `PkNumberOnlyDirective` (`[pkNumberOnly]`) — restrict `<input>` to digits; optional `[pkAllowDecimal]` for single decimal point
- All 9 new symbols exported from `public-api.ts`
- Example pages for both **pk-pipes** and **pk-directives** added to the dev app
- 58 new Vitest tests (pipes: 28, directives: 20) → **318 / 318** total

---

## [2.13.1] — 2026-05-19

### Fixed / Added
- `pk-context-menu` directive: added **long-press (500 ms)** support for mobile — iOS and Android can now trigger the context menu by holding a finger. Moving > 10 px cancels the gesture. Android's duplicate `contextmenu` event after long-press is suppressed. Host gets `-webkit-touch-callout: none` to prevent iOS native callout.
- Example app `pk-code-reader`: added **Clear** button to reset `lastScan` / `lastError` / `scanCount` so another barcode/QR code can be tested immediately.

---

## [2.13.0]

- **pk-context-menu**: new `[pkContextMenu]` directive — right-click context menu; `PkContextMenuService` creates and appends the panel to `<body>` on first inject (zero template setup); inputs: `pkContextMenu` (items), `pkContextMenuLayout: 'vertical' | 'horizontal'`, `pkContextMenuTheme` (7 themes: light/dark/green/blue/orange/red/magenta), `pkContextMenuDisabled`; outputs: `(pkContextMenuSelected)`, `(pkContextMenuOpen)`; `PkContextMenuItem` supports `title`, `icon` (Material Symbols), `disabled`, `separator`, `fn`, `route` (Angular Router), `href` / `hrefTarget`; keyboard nav (ArrowDown/Up/Enter/Escape); panel auto-adjusts position near viewport edges; 23 Vitest tests

---

## [2.12.0]

- **pk-timepicker**: new standalone component — time picker with `ControlValueAccessor` support (`ngModel` / `FormControl`); value stored as 24H `HH:mm`, `HH:mm:ss`, or `HH` string; inputs: `format: 'hms' | 'hm' | 'h'`, `type: '24H' | '12H'`, `inputType: 'spinner' | 'number' | 'dropdown'`, `customClass`, `customStyle`; output: `(onTimeChange)`; default `height: 35px` (overridable via `customStyle`); 39 Vitest tests across 3 spec files
- **pk-timepicker** `inputType="spinner"`: up/down arrow buttons per field with mouse-wheel support
- **pk-timepicker** `inputType="number"`: plain text `<input>` per field; invalid values (out-of-range on blur) revert to the previous valid value instead of clamping
- **pk-timepicker** `inputType="dropdown"`: native `<select>` per field — guarantees valid values; hours 00–23 (24H) or 01–12 (12H)

---

## [2.11.3]

- **pk-radio-group**: new standalone component — custom-styled radio button group; `ControlValueAccessor` (`ngModel` / `FormControl`); `layout: 'vertical' | 'horizontal'`; per-option `disabled`; `(onChange)` output; `customClass` / `customStyle` inputs; 14 Vitest tests

## [2.11.2]

- **pk-divider** (CSS only): new `pk-divider` class for horizontal and vertical content separators; supports labeled dividers (`<div class="pk-divider">or</div>`), vertical inline separators (`<span class="pk-divider pk-divider--vertical">`) , line styles (`--dashed`, `--dotted`), thickness (`--md`, `--thick`), text alignment (`--left`, `--right`), and color variants (`--primary`, `--secondary`, `--success`, `--error`); included in `pk-ui.css` automatically

- **pk-code-reader**: iOS / Firefox fallback — when `BarcodeDetector` is unavailable (iOS Safari, iOS Chrome, Firefox), jsQR v1.4.0 is used as the decode engine (vendored TypeScript source, no npm dependency); camera still works via `getUserMedia()`; upload and clipboard paste also supported; QR-only mode is signalled by a small **"QR only"** pill badge overlaid on the viewport; `_jsqrMode` signal exposes the active mode
- **pk-code-reader**: iOS detection — `_isIos` flag set once on init via UA string; "not supported on iOS" message replaces the generic hint when `BarcodeDetector` is unavailable on iOS
- **pk-code-reader**: permission-denied fallback — when `getUserMedia()` throws `NotAllowedError` (e.g. Android LINE WebView), a permission-denied overlay is shown inside the viewport with a **"Scan with camera"** button that triggers `<input type="file" accept="image/*" capture="environment">`; this opens the native camera picker, bypassing `getUserMedia()` entirely; decoded via `BarcodeDetector` as normal; `openCaptureInput()` / `onCaptureChange()` methods added
- **pk-code-reader**: `_permissionDenied` signal reset to `false` at the start of every `startCamera()` call

## [2.11.1]

- **pk-locale**: add `calendarLabels` field to `PkLocaleData` — provides `year`, `month`, `week`, `day`, `agenda`, `today`, `newEvent` labels for all 17 locales; used by `pk-calendar` toolbar to render fully localized view buttons and action labels
- **pk-calendar**: toolbar labels (`Year/Month/Week/Day/Agenda`, `Today`, `+ New`) now drawn from `PkLocaleData.calendarLabels`; template simplified from inline `@if`/`@else` chains to a single `_calViews` computed signal

## [2.11.0]

- **pk-code-reader**: new standalone component — scans QR codes and barcodes using the native `BarcodeDetector` API (zero external dependencies); supports live camera stream, image file upload, and clipboard paste (Ctrl+V); inputs: `formats`, `facingMode`, `continuous`, `paused`, `interval`, `showOverlay`, `showHighlight`, `beep`, `showTorch`, `showSwitch`, `allowUpload`, `allowPaste`; outputs: `(scan)`, `(error)`, `(supportedFormats)`; public methods: `reset()`, `startCamera()`; canvas RAF overlay with viewfinder frame and green bounding-box highlight; AudioContext beep (880 Hz, 150 ms); graceful "not supported" fallback for Safari/Firefox
- **pk-calendar**: `locale` input upgraded from `'TH'|'EN'` to `PkLocale` — now supports all 17 shared locales (en · th · lo · fr · es · pt · it · de · nl · zh · ja · ko · ru · vi · id · ar · hi); month/day labels drawn directly from `PK_LOCALE_DATA`; example page shows full locale dropdown selector

## [2.10.0]

- **pk-barcode**: new standalone component — generates barcodes as inline SVG; supports **Code 128**, **Code 39**, **EAN-13**, **EAN-8**; pure TypeScript encoder (zero external deps); inputs: `value`, `format`, `width`, `height`, `showText`, `lineColor`, `backgroundColor`; outputs: `downloadSvg()`, `downloadPng()`
- **pk-qrcode**: new standalone component — generates QR codes as inline SVG; supports versions 1–40, error correction levels **L / M / Q / H**, 8 mask patterns with full ISO 18004 penalty scoring; inputs: `value`, `ecLevel`, `size`, `darkColor`, `lightColor`, `logo`, `logoSize`, `margin`; outputs: `downloadSvg()`, `downloadPng()`; center logo auto-upgrades EC level to Q

## [2.9.0]

- **pk-textarea**: add **Highlight color** toolbar button — applies text background color via `execCommand('hiliteColor')` (default `#ffff00`); selection preserved across the native color dialog
- **pk-textarea**: add **Blockquote** toolbar button — toggles `<blockquote>` block via `execCommand('formatBlock')`; active state tracked; click again reverts to `<p>`; styled with left border (`4px solid #94a3b8`), italic, 0.8 opacity
- **pk-textarea**: fix rich-text element styles (h1–h3, ul, ol, li, a, blockquote) not applying to dynamically-injected content — replaced plain descendant selectors with `::ng-deep` to bypass Angular View Encapsulation attribute matching

## [2.8.1]

- **pk-autocomplete**: fix search not working when input contains spaces — `multiWord` mode now enabled by default in Local options and ngModel examples; component uses last-word query (`currentQuerySignal`) instead of full text when `multiWord=true`

## [2.8.0]

- **pk-split**: resizable split pane component — drag the divider to resize two panels; supports `horizontal` (left/right) and `vertical` (top/bottom) layouts; touch-friendly; inputs: `direction`, `initialSize`, `minSize`, `gutterSize`; output: `(sizeChange)`

## [2.7.1]

- **pk-datepicker**: upgraded to shared `PkLocale` locale model support across the component and example page; now supports 17 locales for month/day labels, localized actions, and placeholders

## [2.7.0]

- **pk-input-password**: standalone password input with show/hide toggle and optional 4-level strength indicator; implements `ControlValueAccessor` — works with `ngModel` and reactive forms

## [2.6.0]

- **pk-locale**: new global shared locale model — 17 locales (EN · TH · LO · FR · ES · PT · IT · DE · NL · ZH · JA · KO · RU · VI · ID · AR · HI) with `direction: 'ltr' | 'rtl'` field. Exports: `PkLocale`, `PkLocaleData`, `PK_LOCALE_DATA`, `getPkLocaleData()`
- **pk-heatmap**: GitHub-style contribution heatmap component — standalone, full-width, 4 color schemes, 17-locale day/month labels, legend with 0/max, tooltip on hover

## [2.5.0]

- **pk-markdown-viewer**: standalone component renders Markdown to HTML with Print / Export actions; zero external deps

## [2.4.7]

- **pk-icon**: fix vertical alignment — icon no longer floats above adjacent text (`vertical-align: middle` on `:host`)
- **pk-icon**: add `PK_MATERIAL_ICON_SETS` constant — consolidates `'material-symbols' | 'google' | 'mat'` aliases; template condition simplified to `materialSets.includes(iconSet())`

## [2.4.6]

- **pk-sidenav** `position="right"` mode — active border renders on the right side
- **pk-calendar** drag & drop now supports multi-day events
- New `pk-table-header-sticky` CSS modifier for sticky `<thead>`
- `pk-modal` now exports `PkModalModule` for NgModule-based consumers
- **pk-datagrid**: rows now clear correctly when `items` is reset to `[]`

## [2.4.5]

- **pk-file-upload**: drag & drop file uploader with browser-native previews (image, PDF, text); `maxSize`, `maxFiles` validation; `uploading` spinner state
- All example pages migrated to lazy-loaded routes
- `pk-toastr` now auto-mounts to `document.body`

## [2.4.4]

- **pk-calendar**: full Year / Month / Week / Day / Agenda views; drag & drop; multi-day bars; built-in form; TH/EN locale

## [2.4.0]

- **pk-datagrid** row selection: `pkDgSelect="single"` and `pkDgSelect="multiple"`; `pkDgSelectionChange` output
- `pk-tabs` now requires `PkTabsModule` (NgModule-based)
