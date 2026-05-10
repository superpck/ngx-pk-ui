# ngx-pk-ui 2.2.0

An Angular 21 component library providing UI components and CSS utilities.

- **Angular**: `^21.0.0`
- **Standalone components** · **Signals** · **Vitest**
- **License**: MIT

## Angular Version Compatibility

| Angular | Status | Notes |
|---------|--------|-------|
| 21 | ✅ Fully supported | Target version |
| 20 | ⚠️ Likely works | peerDep warning — use `--legacy-peer-deps` |
| 19 | ⚠️ Mostly works | peerDep warning; `provideBrowserGlobalErrorListeners` may be missing |
| 17–18 | 🚧 Partial | `input()` / `contentChildren()` in developer preview only |
| < 17 | ❌ Not supported | Signals not available |

## Demo & Usage

- https://superpck.github.io/ngx-pk-ui/

## npm public

- https://www.npmjs.com/package/ngx-pk-ui


## Installation

```bash
npm install ngx-pk-ui
```

---

## Components

| Component | Type | Description |
|-----------|------|-------------|
| `pk-accordion` | Component | Collapsible panels with single / multi-open mode |
| `pk-tabs` | Component | Tab container with content projection |
| `pk-toastr` | Component + Service | Toast notifications |
| `pk-alert` | Component + Service | Modal alert / confirm / input dialogs |
| `pk-modal` | Component | Flexible modal overlay with slot components, size and theme |
| `pk-icon` | Component | SVG icon set + Material Symbols mode |
| `pk-datagrid` | Module + Components | Datagrid with sort, filter, resize, pagination, row detail |
| `pk-datepicker` | Component | Datepicker with TH/EN locale, range, and clear action |
| `pk-progress` | Component | Line/circle progress with status variants |
| `pk-treeview` | Module + Components | Hierarchical tree with expand/collapse and selection modes |
| `pk-select` | Component | Single/multi select with optional search |
| `pk-autocomplete` | Component | Local/async autocomplete input |
| `pk-typeahead` | Component | Typeahead input with keyboard navigation |

---

### pk-accordion

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

## CSS Utilities

| File | Description |
|------|-------------|
| `pk-grid.css` | Responsive 12-column grid |
| `pk-btn.css` | Button variants and groups |
| `pk-spinner.css` | Loading spinners |
| `pk-badge.css` | Badges and dot indicators |
| `pk-card.css` | Card layouts |
| `pk-table.css` | Styled tables with striped, hover, bordered, size and color variants |
| `pk-toggle.css` | Toggle switch replacing `<input type="checkbox">` |
| `pk-form.css` | Floating label fields for `input`, `select`, `textarea` — prefix/suffix, counter, group layout |
| `pk-layout.css` | Fixed top navbar + sidebar layout shell — all CSS variables, responsive |
| `pk-font.css` | Thai & Lao Google Fonts helper classes (opt-in, not in pk-ui.css) |
| `pk-icon-font.css` | Material Symbols font classes |

### Include all at once

```json
// angular.json
"styles": ["node_modules/ngx-pk-ui/styles/pk-ui.css"]
```

Or import individually:

```css
@import 'ngx-pk-ui/styles/pk-btn.css';
@import 'ngx-pk-ui/styles/pk-grid.css';
@import 'ngx-pk-ui/styles/pk-table.css';
```
---

### pk-table

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

### pk-toggle

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

<!-- Angular two-way binding -->
<label class="pk-toggle">
  <input type="checkbox" [(ngModel)]="isEnabled" />
  <span class="pk-toggle__track"></span>
  <span class="pk-toggle__label">{{ isEnabled ? 'On' : 'Off' }}</span>
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

### pk-form

Floating label form fields — pure CSS, works with `input`, `select`, and `textarea`.
The `input` **must** have `placeholder=" "` (single space) for the float animation to work.

```html
<!-- Basic input -->
<div class="pk-field">
  <input class="pk-field__input" type="text" placeholder=" " id="name" />
  <label class="pk-field__label" for="name">Full name</label>
</div>

<!-- Prefix / Suffix -->
<div class="pk-field">
  <div class="pk-field__wrap">
    <span class="pk-field__prefix">@</span>
    <input class="pk-field__input" type="text" placeholder=" " id="user" />
    <span class="pk-field__suffix">.com</span>
  </div>
  <label class="pk-field__label" for="user">Username</label>
</div>

<!-- Error state with message -->
<div class="pk-field pk-field--error">
  <input class="pk-field__input" type="email" placeholder=" " id="email" />
  <label class="pk-field__label" for="email">Email</label>
  <span class="pk-field__error">Invalid email address</span>
</div>

<!-- Form group (2-column) -->
<div class="pk-form-group pk-form-group--2">
  <div class="pk-field"> ... </div>
  <div class="pk-field"> ... </div>
</div>
```

**Wrapper modifier classes:**

| Class | Description |
|-------|-------------|
| `pk-field` | Required wrapper |
| `pk-field--filled` | Filled background, bottom border only (Material style) |
| `pk-field--underline` | No border box, underline only |
| `pk-field--pill` | Fully rounded corners |
| `pk-field--outlined` | Adds glow ring on focus |
| `pk-field--sm` | Small (42 px height) |
| `pk-field--lg` | Large (60 px height) |
| `pk-field--success` | Green border + label |
| `pk-field--error` | Red border + label |

**Element classes:**

| Class | Element | Description |
|-------|---------|-------------|
| `pk-field__input` | `input` / `select` / `textarea` | Form control — must have `placeholder=" "` |
| `pk-field__label` | `label` | Floating label — must come **after** the input in the DOM |
| `pk-field__wrap` | `div` | Flex row container for prefix/suffix + input |
| `pk-field__prefix` | `span` | Left-attached addon |
| `pk-field__suffix` | `span` | Right-attached addon |
| `pk-field__hint` | `span` | Helper text (grey) |
| `pk-field__error` | `span` | Error message (red) |
| `pk-field__footer` | `div` | Flex row: hint left + counter right |
| `pk-field__counter` | `span` | Character counter (right-aligned) |

**Layout helpers:**

| Class | Description |
|-------|-------------|
| `pk-form-group` | Responsive flex row of fields |
| `pk-form-group--2` | 2-column layout |
| `pk-form-group--3` | 3-column layout |
| `pk-form-section` | Section divider label (uppercase, border-bottom) |

---

### pk-font

`pk-font.css` is **opt-in** — it is NOT included in `pk-ui.css`. Import separately:

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

## Development

```bash
# Build the library
ng build ngx-pk-ui

# Run all tests (Vitest, headless)
ng test ngx-pk-ui --no-watch

# Run one spec file
npx vitest run projects/ngx-pk-ui/src/lib/pk-tabs/pk-tabs.spec.ts

# Serve the example app
npm run start:example

# Publish to npm (after build)
npm publish dist/ngx-pk-ui
```

---

## Component instruction

See [instruction.md](instruction.md)

---

## Credits

Developed with the assistance of [GitHub Copilot](https://github.com/features/copilot).

