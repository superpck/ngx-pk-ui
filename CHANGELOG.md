# Changelog

All notable changes to **ngx-pk-ui** are documented here.

---

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
