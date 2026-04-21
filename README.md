# ngx-pk-ui

An Angular 21 component library providing UI components and CSS utilities.

- **Angular**: `^21.0.0`
- **Standalone components** · **Signals** · **Vitest**
- **License**: MIT

## Demo

- https://superpck.github.io/ngx-pk-ui/

---

## Installation

```bash
npm install ngx-pk-ui
```

---

## Components

| Component | Type | Description |
|-----------|------|-------------|
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

## CSS Utilities

| File | Description |
|------|-------------|
| `pk-grid.css` | Responsive 12-column grid |
| `pk-btn.css` | Button variants and groups |
| `pk-spinner.css` | Loading spinners |
| `pk-badge.css` | Badges and dot indicators |
| `pk-card.css` | Card layouts |
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
```

---

## pk-icon

Icon component with 2 modes:

- `iconSet="pk"` (default): built-in SVG icon set
- `iconSet="material-symbols"`: Material Symbols font glyphs

Supports size, color, stroke/fill (SVG), and Material variation settings.

```ts
import { PkIcon } from 'ngx-pk-ui';

@Component({
  imports: [PkIcon],
  template: `
    <pk-icon name="search" />
    <pk-icon name="user" [size]="24" color="#3b82f6" />
    <pk-icon name="success" [size]="20" fillColor="#22c55e" color="#22c55e" />
    <pk-icon name="warning" [strokeWidth]="1.5" />
    <pk-icon iconSet="material-symbols" name="home" [size]="20" />
  `,
})
```

### Inputs

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `name` | `PkIconName` | *(required)* | Icon identifier |
| `iconSet` | `'pk' \| 'material-symbols'` | `'pk'` | Render mode |
| `size` | `number` | `15` | Width and height in px |
| `color` | `string` | `'currentColor'` | SVG stroke color |
| `fillColor` | `string` | `'none'` | SVG fill color |
| `viewBox` | `string` | `'0 0 24 24'` | SVG viewBox attribute |
| `strokeWidth` | `number` | `2` | SVG stroke-width |

### Available icons

**Navigation & UI:** `search` `menu` `close` `sort` `plus` `list` `reload`

**Users & Auth:** `user` `users` `profile` `login` `logout`

**Location:** `map` `map-point`

**Files & Documents:** `folder-close` `folder-open` `document` `report` `csv` `xls` `pdf` `text`

**Charts & Analytics:** `chart-pie` `chart-bar` `dashboard` `venn`

**System & Infrastructure:** `database` `cog` `setting` `server` `shield`

**Communication:** `email` `phone`

**Transfer:** `upload` `download` `export` `import`

**Links:** `link` `unlink`

**Editing & Actions:** `pencil` `save` `trash` `eye` `eye-off` `print`

**Status:** `check-mark` `check-mark-circle` `success` `warning` `error` `question`

**Time:** `clock` `calendar` `time` `wait`

**Medical & Transport:** `ambulance` `car` `car-crash` `bed` `xray` `lab`

**Social:** `youtube` `facebook` `line` `telegram` `wechat` `linkedin`

---

## pk-tabs

```ts
import { PkTab, PkTabs } from 'ngx-pk-ui';
```

```html
<pk-tabs>
  <pk-tab label="Profile"><p>Profile content</p></pk-tab>
  <pk-tab label="Settings"><p>Settings content</p></pk-tab>
  <pk-tab label="Disabled" [disabled]="true"><p>Hidden</p></pk-tab>
</pk-tabs>
```

---

## pk-toastr

Place `<pk-toastr />` once in your root component, then inject `PkToastrService` anywhere.

```ts
import { PkToastrService } from 'ngx-pk-ui';

toastr = inject(PkToastrService);

this.toastr.success('Saved!');
this.toastr.error('Failed', 'Error', 0);   // duration=0 → persists until dismissed
this.toastr.warning('Check your input');
this.toastr.info('Processing...', undefined, 8000);
```

---

## pk-alert

Place `<pk-alert />` once in your root component, then inject `PkAlertService` anywhere.

```ts
import { PkAlertService } from 'ngx-pk-ui';

alert = inject(PkAlertService);

await this.alert.success('Saved successfully!');
const yes = await this.alert.confirm('Delete this item?');
const name = await this.alert.input('Enter your name:', 'string', 'Name', 'Alice');
```

---

## pk-modal

```ts
import { PkModal, PkModalHeader, PkModalBody, PkModalFooter } from 'ngx-pk-ui';
```

```html
<pk-modal [openModal]="show" size="lg" theme="blue" [blur]="true" (onClose)="show = false">
  <pk-modal-header>Title</pk-modal-header>
  <pk-modal-body><p>Content</p></pk-modal-body>
  <pk-modal-footer>
    <button class="pk-btn pk-btn-secondary pk-btn-outline" (click)="show = false">Cancel</button>
    <button class="pk-btn pk-btn-primary" (click)="confirm()">OK</button>
  </pk-modal-footer>
</pk-modal>
```

Size presets: `xs` (280px) · `sm` (360px) · `md` (520px, default) · `lg` (760px) · `xl` (1020px) · `2xl` (1280px) · `full`

Themes: `white` (default) · `none` · `success` · `warn` · `error` · `sky` · `blue` · `gray`

---

## pk-select / pk-autocomplete / pk-typeahead

```ts
import { FormsModule } from '@angular/forms';
import { PkSelectComponent, PkAutocompleteComponent, PkTypeaheadComponent } from 'ngx-pk-ui';
```

```html
<pk-select [options]="options" mode="multi" [searchable]="true"></pk-select>

<pk-autocomplete [options]="options" [(ngModel)]="selected"></pk-autocomplete>

<pk-typeahead [items]="items" [(ngModel)]="text"></pk-typeahead>
```

---

## pk-datepicker

```html
<pk-datepicker
  [(ngModel)]="dateValue"
  locale="th"
  [minDate]="minDate"
  [maxDate]="maxDate"
  [setNull]="true"
></pk-datepicker>
```

`locale` accepts both lowercase and uppercase (`th` / `TH`, `en` / `EN`).

---

## pk-progress

```html
<pk-progress [config]="{ type: 'line', percent: 65, status: 'normal' }"></pk-progress>
<pk-progress [config]="{ type: 'circle', percent: 80, status: 'success' }"></pk-progress>
```

---

## pk-treeview

```html
<pk-treeview [nodes]="nodes" selection="multi" [showSelectAll]="true"></pk-treeview>
```

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
