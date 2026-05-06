# PK Datagrid

Angular datagrid component with sorting, filtering, pagination, action menu, and expandable detail rows.

## Features

- ✅ Column sorting
- ✅ Column filter popup
- ✅ Pagination + page size selector
- ✅ Loading overlay
- ✅ Expandable row detail (lazy render)
- ✅ Action dropdown menu per row

## Installation

```typescript
import { PkDatagridModule } from 'src/app/pk-ui/pk-datagrid/pk-datagrid.module';

@NgModule({
  imports: [PkDatagridModule]
})
export class YourModule { }
```

## Basic Usage

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
      {{ pg.firstItem + 1 }}–{{ pg.lastItem + 1 }} of {{ patients.length }} rows
    </pk-dg-pagination>
  </pk-dg-footer>

</pk-datagrid>
```

## Usage with Action Menu + Expandable Rows

```html
<pk-datagrid [pkDgLoading]="loading">

  <pk-dg-header [pkDgSort]="'name'">Name</pk-dg-header>
  <pk-dg-header [pkDgSort]="'ward'">Ward</pk-dg-header>

  <pk-dg-rows *pkDgRows="let item of patients" [pkDgRow]="item">

    <!-- action dropdown — clicking any item closes the menu automatically -->
    <pk-dg-action>
      <button class="action-item" (click)="onEdit(item)">Edit</button>
      <button class="action-item" (click)="onDelete(item)">Delete</button>
    </pk-dg-action>

    <pk-dg-column>{{ item.name }}</pk-dg-column>
    <pk-dg-column>{{ item.ward }}</pk-dg-column>

    <!-- *pkDgRowIsExpand is required: shows the expand button and lazy-renders content -->
    <pk-dg-row-expand *pkDgRowIsExpand>
      <div style="padding: 12px">Detail: {{ item.name }}</div>
    </pk-dg-row-expand>

  </pk-dg-rows>

  <pk-dg-footer>
    <pk-dg-pagination #pg [pkDgPageSize]="10" [rowCount]="patients.length">
      {{ pg.firstItem + 1 }}–{{ pg.lastItem + 1 }} of {{ patients.length }} rows
    </pk-dg-pagination>
  </pk-dg-footer>

</pk-datagrid>
```

## API Reference

### `<pk-datagrid>`
| Input | Type | Default | Description |
|---|---|---|---|
| `[pkDgLoading]` | `boolean` | `false` | Show loading overlay |

### `<pk-dg-header>`
| Input | Type | Description |
|---|---|---|
| `[pkDgSort]` | `string` | Field name used for sorting |
| `pkDgFilter` | `string` | Enables filter popup on the header |
| `[style.width.px]` | `number` | Column width in pixels |

### `*pkDgRows` + `<pk-dg-rows>`
```html
<pk-dg-rows *pkDgRows="let item of list" [pkDgRow]="item">
```
| | Description |
|---|---|
| `*pkDgRows="let x of list"` | Structural directive that iterates data — handles pagination and sorting automatically |
| `[pkDgRow]="item"` | Passes row data into the row component (required) |

### `<pk-dg-action>`
Place `<button class="action-item">` elements as children — clicking any item closes the dropdown automatically.

Renders as **column 1** (⋮ button). Hidden if not used.

### `<pk-dg-column>`
Data cell — order must match the corresponding `pk-dg-header`. Starts from **column 3** onwards.

### `<pk-dg-row-expand>`
| | Description |
|---|---|
| `*pkDgRowIsExpand` | **Required** — shows the expand button on the row and lazy-renders the content |

Renders as **column 2** (▶ button). Hidden if not used.

> **Column layout:** `| ⋮ action | ▶ expand | col 1 | col 2 | ... |`
> Place inside `<pk-dg-rows>` in this order: `<pk-dg-action>` → `<pk-dg-column>` → `<pk-dg-row-expand>`

### `<pk-dg-pagination>`
| Input | Type | Default | Description |
|---|---|---|---|
| `[rowCount]` | `number` | `0` | Total number of records |
| `[pkDgPageSize]` | `number` | `10` | Number of rows per page |
| `#ref` | template ref | — | Used to access `firstItem` / `lastItem` in the template |

**`#ref` names must be unique** when multiple `pk-datagrid` exist in the same template (e.g. `#pg1`, `#pg2`).

| Property | Type | Description |
|---|---|---|
| `firstItem` | `number` | Index of the first row on the current page (0-based) |
| `lastItem` | `number` | Index of the last row on the current page (0-based) |

### `<pk-dg-page-size>`
| Input | Type | Default | Description |
|---|---|---|---|
| `[pkPageSizeList]` | `number[]` | `[10,20,50,100]` | List of page size options |

## More Examples

[EXAMPLES.md](./EXAMPLES.md)
