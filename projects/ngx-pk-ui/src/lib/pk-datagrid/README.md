# PK Datagrid

Angular datagrid component ทดแทน Clarity Datagrid พร้อม features ครบถ้วน

## Features

- ✅ Sorting columns
- ✅ Pagination
- ✅ Loading state
- ✅ Expandable row details
- ✅ Custom cell templates
- ✅ Responsive design

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
  <!-- Columns -->
  <pk-dg-column [pkDgField]="'username'" [style.width.px]="250">username</pk-dg-column>
  <pk-dg-column [pkDgField]="'fname'">name</pk-dg-column>
  <pk-dg-column [pkDgField]="'position'">position</pk-dg-column>
  
  <!-- Rows -->
  <pk-dg-row *pkDgItems="let user of users" [pkDgItem]="user" (click)="onRowClick(user)">
    <pk-dg-cell>{{ user.username }}</pk-dg-cell>
    <pk-dg-cell>{{ user.fname }} {{ user.lname }}</pk-dg-cell>
    <pk-dg-cell>{{ user.position }}</pk-dg-cell>
    
    <!-- Expandable detail -->
    <pk-dg-row-detail *pkIfExpanded>
      <div>
        <p>Detail content here...</p>
        <p>Email: {{ user.email }}</p>
      </div>
    </pk-dg-row-detail>
  </pk-dg-row>
  
  <!-- Footer with pagination -->
  <pk-dg-footer>
    <pk-dg-pagination #pagination [pkDgPageSize]="10">
      <pk-dg-page-size [pkPageSizeOptions]="[10,15,20,50,100]">
        Users per page
      </pk-dg-page-size>
      {{ pagination.firstItem + 1 }} - {{ pagination.lastItem + 1 }}
      of {{ pagination.totalItems }} users
    </pk-dg-pagination>
  </pk-dg-footer>
</pk-datagrid>
```

## Migration from Clarity Datagrid

### Before (Clarity):
```html
<clr-datagrid [clrDgLoading]="loading">
  <clr-dg-column>Name</clr-dg-column>
  <clr-dg-row *clrDgItems="let user of users">
    <clr-dg-cell>{{ user.name }}</clr-dg-cell>
  </clr-dg-row>
</clr-datagrid>
```

### After (PK Datagrid):
```html
<pk-datagrid [pkDgLoading]="loading">
  <pk-dg-column>Name</pk-dg-column>
  <pk-dg-row *pkDgItems="let user of users">
    <pk-dg-cell>{{ user.name }}</pk-dg-cell>
  </pk-dg-row>
</pk-datagrid>
```

## API Reference

### `pk-datagrid`
| Input | Type | Description |
|-------|------|-------------|
| `pkDgLoading` | `boolean` | Show loading spinner |

### `pk-dg-column`
| Input | Type | Description |
|-------|------|-------------|
| `pkDgField` | `string` | Field name for sorting |
| `[style.width.px]` | `number` | Column width in pixels |

### `pk-dg-row`
| Input | Type | Description |
|-------|------|-------------|
| `pkDgItem` | `any` | Row data item |
| `(click)` | `EventEmitter` | Row click event |

### `pk-dg-pagination`
| Input | Type | Description |
|-------|------|-------------|
| `pkDgPageSize` | `number` | Items per page (default: 10) |
| `totalItems` | `number` | Total number of items |

## Styling

Custom CSS classes:
- `.pk-datagrid` - Main table
- `.pk-datagrid-spinner` - Loading overlay
- `.pk-dg-pagination` - Pagination controls
- `.pk-dg-footer` - Footer container
