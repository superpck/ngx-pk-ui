# PK Datagrid — Examples

## API Overview

| Element | Description |
|---|---|
| `<pk-datagrid>` | Root component |
| `<pk-dg-header>` | Column header definition (place before `*pkDgRows`) |
| `*pkDgRows="let x of list"` | Structural directive that iterates data |
| `<pk-dg-rows [pkDgRow]="item">` | Row wrapper — created automatically by `*pkDgRows` |
| `<pk-dg-action>` | Dropdown action menu — renders as **column 1** (⋮) |
| `<pk-dg-row-expand *pkDgRowIsExpand>` | Expandable detail row — renders expand button as **column 2** (▶). `*pkDgRowIsExpand` is required |
| `<pk-dg-column>` | Data cell in each row — starts from **column 3** onwards. Order must match headers |
| `<pk-dg-footer>` | Container for pagination |
| `<pk-dg-pagination #ref>` | Pagination component |
| `<pk-dg-page-size>` | Page size dropdown (place inside `pk-dg-pagination`) |

### Column Layout

```
| ⋮ action | ▶ expand | col 1 | col 2 | col 3 | ... |
```

> Place elements inside `<pk-dg-rows>` in this order: `<pk-dg-action>` → `<pk-dg-column>` → `<pk-dg-row-expand>`

### pk-datagrid inputs / outputs
| | Description |
|---|---|
| `[pkDgLoading]="loading"` | Show loading overlay |
| `[filterValues]="filterValues"` | External filter map `{ fieldName: 'search text' }` |
| `(pkDgRefresh)` | Emits when the refresh button is clicked |
| `(filterChange)` | Emits `{ key, value }` whenever a filter popup value changes |

### pk-dg-header inputs
| Input | Description |
|---|---|
| `[pkDgSort]="'fieldName'"` | Field name used for sorting |
| `pkDgFilter="fieldName"` | Enables filter popup on the header |
| `[style.width.px]="120"` | Column width in pixels |

### pk-dg-column inputs
| Input | Default | Description |
|---|---|---|
| `nowrap` | `true` | Prevent cell text from wrapping (attribute, no value needed) |
| `[tdStyle]` | `null` | Inline `ngStyle` object applied to the `<td>` |

### pk-dg-pagination inputs / properties
| | Description |
|---|---|
| `[rowCount]="list.length"` | Total number of records (auto-set by `*pkDgRows`; pass as initial value) |
| `[pkDgPageSize]="10"` | Number of rows per page |
| `#ref` | Template ref for accessing `firstItem` / `lastItem` |
| `ref.firstItem` | 0-based start index of the current page (use `+1` to display 1-based) |
| `ref.lastItem` | Exclusive end index of the current page — equals the 1-based last row number (do **not** add 1) |

> **Note:** When multiple `pk-datagrid` components exist in the same template, each `#ref` name must be unique (e.g. `#pg1`, `#pg2`).

### pk-dg-page-size inputs
| Input | Description |
|---|---|
| `[pkPageSizeList]="[10,20,50]"` | List of page size options |

---

## Example 1: Basic Datagrid

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

## Example 2: Datagrid with Action Menu + Expandable Rows

```html
<pk-datagrid [pkDgLoading]="loading">

  <pk-dg-header [style.width.px]="90"  [pkDgSort]="'hn'"   pkDgFilter="hn">HN</pk-dg-header>
  <pk-dg-header [style.width.px]="200" [pkDgSort]="'name'" pkDgFilter="name">Full Name</pk-dg-header>
  <pk-dg-header [style.width.px]="60"  [pkDgSort]="'age'">Age</pk-dg-header>
  <pk-dg-header                        [pkDgSort]="'ward'">Ward</pk-dg-header>

  <pk-dg-rows *pkDgRows="let item of patients" [pkDgRow]="item">

    <!-- action dropdown — clicking any item closes the menu; use class="action-item" for styling -->
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

## Example 3: Multiple Datagrids in the Same Template

Each `pk-dg-pagination` must use a unique `#ref` name:

```html
<!-- First datagrid — use #pg1 -->
<pk-datagrid>
  ...
  <pk-dg-footer>
    <pk-dg-pagination #pg1 [pkDgPageSize]="10" [rowCount]="list1.length">
      {{ pg1.firstItem + 1 }}–{{ pg1.lastItem }} of {{ list1.length }} rows
    </pk-dg-pagination>
  </pk-dg-footer>
</pk-datagrid>

<!-- Second datagrid — use #pg2 (must not reuse #pg1) -->
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

## TypeScript Component

```typescript
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.component.html',
})
export class PatientListComponent implements OnInit {
  loading = false;
  patients: any[] = [];

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

## Module Import

```typescript
import { PkDatagridModule } from 'src/app/pk-ui/pk-datagrid/pk-datagrid.module';

@NgModule({
  imports: [
    CommonModule,
    PkDatagridModule,
  ]
})
export class YourModule { }
```