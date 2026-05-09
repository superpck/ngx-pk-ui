# ngx-pk-ui 1.1.5

An Angular 21 component library providing UI components and CSS utilities.

- **Angular**: `^21.0.0`
- **Standalone components** · **Signals** · **Vitest**
- **License**: MIT

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

