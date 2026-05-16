# Changelog

All notable changes to **ngx-pk-ui** are documented here.

---

## [2.7.0] — 2026-05-16

### Added
- **pk-input-password** — standalone password input field with show/hide toggle and optional 4-level strength indicator.
  - Implements `ControlValueAccessor` — works with `[(ngModel)]` and reactive forms (`formControlName`).
  - Strength meter: 4 levels (Weak / Fair / Good / Strong) based on length, uppercase, digits, special characters.
  - Inputs: `label`, `inputId`, `autocomplete`, `showStrength`, `customClass`, `customStyle`

---

## [2.6.0] — 2026-05-16

### Added
- **pk-locale** — new global shared locale model for date/calendar strings across all components.
  - Supports 17 locales: `en` · `th` · `lo` · `fr` · `es` · `pt` · `it` · `de` · `nl` · `zh` · `ja` · `ko` · `ru` · `vi` · `id` · `ar` · `hi`
  - Each locale provides `monthNamesShort`, `monthNamesFull`, `dayNamesShort`, `dayNamesFull`, and `direction: 'ltr' | 'rtl'`
  - Exported API: `PkLocale`, `PkLocaleData`, `PK_LOCALE_DATA`, `getPkLocaleData()`
- **pk-heatmap** — GitHub-style contribution heatmap component.
  - Full-width layout — fills its container naturally.
  - 4 color schemes: `green` (default) · `blue` · `purple` · `orange`
  - 17-locale day/month labels via `pk-locale` integration.
  - Legend shows `0` and the maximum value in the dataset.
  - Tooltip on hover with `tooltipFormat` override.
  - Inputs: `data`, `startDate`, `endDate`, `colorScheme`, `locale`, `showLegend`, `showTooltip`, `tooltipFormat`, `dayLabels`, `monthLabels`

---

## [2.5.0] — 2026-05-16

### Added
- **pk-markdown-viewer** — standalone component that renders Markdown to HTML.
  - `fileName` input: loads a `.md` file via `fetch()` (e.g. `assets/CHANGELOG.md`).
  - `content` input: renders a raw Markdown string directly.
  - Toolbar with **Print**, **Export .md**, and **Export .html** actions.
  - `theme` input: `'light'` (default) or `'dark'`.
  - `showToolbar` input to hide/show the action bar.
  - `title` input to override the filename shown in the toolbar.
  - Zero external dependencies — pure TypeScript Markdown parser built-in.

### Fixed
- `pk-file-upload`: drag-and-drop zone now respects `disabled` input correctly.
- `pk-sidenav`: auto-mode breakpoint now triggers on resize correctly.

---

## [2.4.6] — 2026-04-28

### Added
- **pk-sidenav** `position="right"` mode — active border renders on the right side.
- **pk-calendar** drag & drop now supports multi-day events.
- New `pk-table-header-sticky` CSS modifier for sticky `<thead>`.

### Changed
- `pk-modal` now exports `PkModalModule` for NgModule-based consumers.
- `pk-icon` adds `vertical-align: middle` to `:host` — fixes baseline misalignment next to text.

### Fixed
- **pk-datagrid**: rows were not cleared when `items` was reset to `[]`.
- **pk-datagrid** NG0100 error in `PkDgHeaderComponent` — moved DOM read to `ngAfterContentInit`.

---

## [2.4.5] — 2026-03-10

### Added
- **pk-file-upload** — drag & drop file uploader with browser-native previews.
  - Supports image, PDF, and text previews.
  - `maxSize`, `maxFiles` validation.
  - `uploading` spinner state.

### Changed
- All example pages migrated to **lazy-loaded routes** for faster initial load.
- `pk-toastr` now auto-mounts to `document.body` — no `<pk-toastr>` tag needed.

---

## [2.4.4] — 2026-02-01

### Added
- **pk-calendar** — full Year / Month / Week / Day / Agenda views.
  - Drag & drop event rescheduling.
  - Multi-day event bars in Month view.
  - Built-in event form (CRUD).
  - Thai & English locale support.

---

## [2.4.0] — 2025-12-15

### Added
- **pk-datagrid** row selection: `pkDgSelect="single"` and `pkDgSelect="multiple"`.
- `pkDgSelectionChange` output emits selected row objects.

### Breaking
- `PkTabsModule` is now required to use `pk-tabs` (was previously standalone).

---

## Inline Formatting Test

This paragraph tests **bold**, *italic*, ***bold italic***, ~~strikethrough~~, and `inline code`.

Here is a [link to Angular](https://angular.dev) and an image:

![ngx-pk-ui Logo](pk-icon-circle.svg)

---

## Code Blocks

```typescript
import { PkMarkdownViewer } from 'ngx-pk-ui';

@Component({
  selector: 'app-root',
  imports: [PkMarkdownViewer],
  template: `
    <pk-markdown-viewer fileName="assets/CHANGELOG.md" theme="light" />
  `,
})
export class AppComponent {}
```

```bash
# Install the library
npm install ngx-pk-ui

# Build the library
ng build ngx-pk-ui
```

---

## Table Example

| Component        | Status | Notes                              |
|:-----------------|:------:|:-----------------------------------|
| pk-accordion     | ✅     | 8 tests passing                    |
| pk-tabs          | ✅     | NgModule-based (`PkTabsModule`)    |
| pk-markdown-viewer | ✅   | New in 2.4.7                       |
| pk-calendar      | ✅     | Year/Month/Week/Day/Agenda views   |
| pk-datagrid      | ✅     | Sort, filter, resize, pagination   |

---

## Blockquote Example

> **Tip:** Import `ngx-pk-ui/styles/pk-ui.css` in your global stylesheet to get all CSS utilities (grid, buttons, badges, cards, tables, toggles, forms, layout).

> You can also import individual files:
> ```
> @import 'ngx-pk-ui/styles/pk-btn.css';
> ```
