# Changelog

All notable changes to **ngx-pk-ui** are documented here.

---

## [2.11.3]

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
