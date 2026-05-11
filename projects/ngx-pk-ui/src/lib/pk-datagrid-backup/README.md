# PK Datagrid

Angular datagrid component with sorting, filtering, pagination, action menu, expandable detail rows, and column resizing.

## Features

- ✅ Column sorting (click header: asc → desc → none)
- ✅ Column filter popup (per column)
- ✅ External filter binding (`[filterValues]`)
- ✅ Pagination + page size selector
- ✅ Loading overlay
- ✅ Expandable row detail (lazy render)
- ✅ Action dropdown menu per row
- ✅ Column resize (drag resize handle)
- ✅ Custom row CSS class (`[rowClass]`)

## Installation

```typescript
import { PkDatagridModule } from 'src/app/pk-ui/pk-datagrid/pk-datagrid.module';

@NgModule({
  imports: [PkDatagridModule]
})
export class YourModule { }
```

---

## API Reference

### `<pk-datagrid>`

| Input | Type | Default | Description |
|---|---|---|---|
| `[pkDgLoading]` | `boolean` | `false` | Show loading overlay |
| `[filterValues]` | `Record<string, string>` | `{}` | External filter map `{ fieldName: 'search text' }` |

| Output | Type | Description |
|---|---|---|
| `(pkDgRefresh)` | `EventEmitter<void>` | Emits when the refresh button is clicked |
| `(filterChange)` | `EventEmitter<{ key: string; value: string }>` | Emits whenever a filter popup value changes |

---

### `<pk-dg-header>`

| Input | Type | Description |
|---|---|---|
| `[pkDgSort]` | `string` | Field name used for sorting |
| `pkDgFilter` | `string` | Enables filter popup on the header |
| `[style.width.px]` | `number` | Column width in pixels (default `120`) |

Columns are resizable — drag the resize handle on the right edge of any header.

---

### `*pkDgRows` + `<pk-dg-rows>`

```html
<pk-dg-rows *pkDgRows="let item of list; let i = index; let c = count" [pkDgRow]="item" [rowClass]="'my-row'">
```

| Binding | Description |
|---|---|
| `*pkDgRows="let x of list"` | Structural directive — iterates data, handles pagination and sorting automatically |
| `[pkDgRow]="item"` | Passes row data into the row component (required) |
| `[rowClass]="'class-name'"` | CSS class added to the `<tr>` element |

**Template context variables:**

| Variable | Description |
|---|---|
| `$implicit` | Current row item (used as `let item`) |
| `index` | 0-based index within the current page |
| `count` | Total number of items on the current page |

---

### `<pk-dg-action>`

Place `<button class="action-item">` elements as children — clicking any item closes the dropdown automatically.

Renders as **column 1** (⋮ button). Hidden if not used.

---

### `<pk-dg-column>`

| Input | Type | Default | Description |
|---|---|---|---|
| `nowrap` | `boolean` | `true` | Prevent cell text from wrapping (attribute, no value needed) |
| `[tdStyle]` | `{ [key: string]: string } \| null` | `null` | Inline `ngStyle` object applied to the `<td>` |

Data cell — order must match the corresponding `<pk-dg-header>`. Starts from **column 3** onwards.

---

### `<pk-dg-row-expand>`

| | Description |
|---|---|
| `*pkDgRowIsExpand` | **Required** — shows the expand button on the row and lazy-renders the content |

Renders as **column 2** (▶ button). Hidden if not used.

> **Column layout:** `| ⋮ action | ▶ expand | col 1 | col 2 | ... |`
>
> Place elements inside `<pk-dg-rows>` in this order: `<pk-dg-action>` → `<pk-dg-column>` → `<pk-dg-row-expand>`

---

### `<pk-dg-footer>`

Container for pagination — renders a styled footer bar below the table.

---

### `<pk-dg-pagination>`

| Input | Type | Default | Description |
|---|---|---|---|
| `[rowCount]` | `number` | `0` | Total number of records |
| `[pkDgPageSize]` | `number` | `10` | Number of rows per page |
| `#ref` | template ref | — | Used to access `firstItem` / `lastItem` in the template |

| Output | Type | Description |
|---|---|---|
| `(pkDgPageChange)` | `EventEmitter<number>` | Emits the new page number when the page changes |
| `(pkDgPageSizeChange)` | `EventEmitter<number>` | Emits the new page size when it changes |

| Property | Type | Description |
|---|---|---|
| `firstItem` | `number` | 0-based start index of the current page (use `+1` to display 1-based) |
| `lastItem` | `number` | Exclusive end index — equals the 1-based last row number (do **not** add 1) |

> **`#ref` names must be unique** when multiple `pk-datagrid` exist in the same template (e.g. `#pg1`, `#pg2`).

---

### `<pk-dg-page-size>`

Place inside `<pk-dg-pagination>`. Renders a page size dropdown.

| Input | Type | Default | Description |
|---|---|---|---|
| `[pkPageSizeList]` | `number[]` | `[10, 20, 50, 100]` | List of page size options |

---

## Examples

### Example 1: Basic Datagrid

```html
<pk-datagrid [pkDgLoading]="loading">

  <pk-dg-header [style.width.px]="90"  [pkDgSort]="'hn'"   pkDgFilter="hn">HN</pk-dg-header>
  <pk-dg-header [style.width.px]="200" [pkDgSort]="'name'" pkDgFilter="name">Full Name</pk-dg-header>
  <pk-dg-header [style.width.px]="60"  [pkDgSort]="'age'">Age</pk-dg-header>
  <pk-dg-header                        [pkDgSort]="'ward'">Ward</pk-dg-header>

  <pk-dg-rows *pkDgRows="let item of patients" [pkDgRow]="item">
    <pk-dg-column>{{ item.hn }}</pk-dg-column>
    <pk-dg-column>{{ item.name }}</pk-dg-column>
    <pk-dg-column>{{ item.age }}</pk-dg-column>
    <pk-dg-column>{{ item.ward }}</pk-dg-column>
  </pk-dg-rows>

  <pk-dg-footer>
    <pk-dg-pagination #pg [pkDgPageSize]="10" [rowCount]="patients.length">
      <pk-dg-page-size [pkPageSizeList]="[10, 20, 50]">rows per page</pk-dg-page-size>
      {{ pg.firstItem + 1 }}–{{ pg.lastItem }} of {{ patients.length }} rows
    </pk-dg-pagination>
  </pk-dg-footer>

</pk-datagrid>
```

---

### Example 2: Action Menu + Expandable Rows

```html
<pk-datagrid [pkDgLoading]="loading">

  <pk-dg-header [style.width.px]="90"  [pkDgSort]="'hn'"   pkDgFilter="hn">HN</pk-dg-header>
  <pk-dg-header [style.width.px]="200" [pkDgSort]="'name'" pkDgFilter="name">Full Name</pk-dg-header>
  <pk-dg-header [style.width.px]="60"  [pkDgSort]="'age'">Age</pk-dg-header>
  <pk-dg-header                        [pkDgSort]="'ward'">Ward</pk-dg-header>

  <pk-dg-rows *pkDgRows="let item of patients" [pkDgRow]="item">

    <!-- action dropdown — use class="action-item" for consistent styling -->
    <pk-dg-action>
      <button class="action-item" (click)="onEdit(item)">
        <pk-icon name="pencil" [size]="13"></pk-icon> Edit
      </button>
      <button class="action-item" (click)="onDelete(item)">
        <pk-icon name="trash" [size]="13"></pk-icon> Delete
      </button>
    </pk-dg-action>

    <pk-dg-column>{{ item.hn }}</pk-dg-column>
    <pk-dg-column>{{ item.name }}</pk-dg-column>
    <pk-dg-column>{{ item.age }}</pk-dg-column>
    <pk-dg-column>{{ item.ward }}</pk-dg-column>

    <!-- *pkDgRowIsExpand is required: shows the expand button and lazy-renders content -->
    <pk-dg-row-expand *pkDgRowIsExpand>
      <div style="padding: 12px 16px; font-size: 13px">
        <strong>Detail:</strong> HN {{ item.hn }} — {{ item.name }},
        age {{ item.age }}, ward {{ item.ward }}
      </div>
    </pk-dg-row-expand>

  </pk-dg-rows>

  <pk-dg-footer>
    <pk-dg-pagination #pg1 [pkDgPageSize]="10" [rowCount]="patients.length">
      <pk-dg-page-size [pkPageSizeList]="[10, 20, 50]">rows per page</pk-dg-page-size>
      {{ pg1.firstItem + 1 }}–{{ pg1.lastItem }} of {{ patients.length }} rows
    </pk-dg-pagination>
  </pk-dg-footer>

</pk-datagrid>
```

---

### Example 3: External Filter Binding

Bind a filter map from the component so filter values are controlled externally (e.g. from a search bar outside the grid).

```html
<input [(ngModel)]="filterValues['name']" placeholder="Search name" (ngModelChange)="onFilterChange()">

<pk-datagrid [pkDgLoading]="loading" [filterValues]="filterValues" (filterChange)="onFilterChange($event)">

  <pk-dg-header [pkDgSort]="'name'" pkDgFilter="name">Full Name</pk-dg-header>
  <pk-dg-header [pkDgSort]="'ward'" pkDgFilter="ward">Ward</pk-dg-header>

  <pk-dg-rows *pkDgRows="let item of patients" [pkDgRow]="item">
    <pk-dg-column>{{ item.name }}</pk-dg-column>
    <pk-dg-column>{{ item.ward }}</pk-dg-column>
  </pk-dg-rows>

  <pk-dg-footer>
    <pk-dg-pagination #pg [pkDgPageSize]="10" [rowCount]="patients.length">
      {{ pg.firstItem + 1 }}–{{ pg.lastItem }} of {{ patients.length }} rows
    </pk-dg-pagination>
  </pk-dg-footer>

</pk-datagrid>
```

```typescript
filterValues: Record<string, string> = {};

onFilterChange(event?: { key: string; value: string }) {
  // filterValues is already updated via two-way binding or the event
}
```

---

### Example 4: Row Styling with `rowClass` and `tdStyle`

```html
<pk-dg-rows *pkDgRows="let item of patients" [pkDgRow]="item"
            [rowClass]="item.critical ? 'row-critical' : ''">

  <pk-dg-column>{{ item.hn }}</pk-dg-column>
  <pk-dg-column [tdStyle]="{ 'font-weight': 'bold', 'color': '#d32f2f' }">
    {{ item.name }}
  </pk-dg-column>
  <pk-dg-column nowrap>{{ item.ward }}</pk-dg-column>

</pk-dg-rows>
```

---

### Example 5: Multiple Datagrids in the Same Template

Each `<pk-dg-pagination>` must use a **unique** `#ref` name.

```html
<!-- First datagrid -->
<pk-datagrid>
  ...
  <pk-dg-footer>
    <pk-dg-pagination #pg1 [pkDgPageSize]="10" [rowCount]="list1.length">
      {{ pg1.firstItem + 1 }}–{{ pg1.lastItem }} of {{ list1.length }} rows
    </pk-dg-pagination>
  </pk-dg-footer>
</pk-datagrid>

<!-- Second datagrid — must use a different ref name -->
<pk-datagrid>
  ...
  <pk-dg-footer>
    <pk-dg-pagination #pg2 [pkDgPageSize]="10" [rowCount]="list2.length">
      {{ pg2.firstItem + 1 }}–{{ pg2.lastItem }} of {{ list2.length }} rows
    </pk-dg-pagination>
  </pk-dg-footer>
</pk-datagrid>
```

---

### TypeScript Component

```typescript
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.component.html',
})
export class PatientListComponent implements OnInit {
  loading = false;
  patients: any[] = [];
  filterValues: Record<string, string> = {};

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.service.getPatients().subscribe(data => {
      this.patients = data;
      this.loading = false;
    });
  }

  onEdit(item: any): void { /* ... */ }
  onDelete(item: any): void { /* ... */ }
}
```
