# Migration Guide: Clarity Datagrid → PK Datagrid

## คำสั่ง Find & Replace

### 1. Tags
- `<clr-datagrid` → `<pk-datagrid`
- `</clr-datagrid>` → `</pk-datagrid>`
- `<clr-dg-column` → `<pk-dg-column`
- `</clr-dg-column>` → `</pk-dg-column>`
- `<clr-dg-row` → `<pk-dg-row`
- `</clr-dg-row>` → `</pk-dg-row>`
- `<clr-dg-cell` → `<pk-dg-cell`
- `</clr-dg-cell>` → `</pk-dg-cell>`
- `<clr-dg-footer` → `<pk-dg-footer`
- `</clr-dg-footer>` → `</pk-dg-footer>`
- `<clr-dg-pagination` → `<pk-dg-pagination`
- `</clr-dg-pagination>` → `</pk-dg-pagination>`
- `<clr-dg-page-size` → `<pk-dg-page-size`
- `</clr-dg-page-size>` → `</pk-dg-page-size>`
- `<clr-dg-row-detail` → `<pk-dg-row-detail`
- `</clr-dg-row-detail>` → `</pk-dg-row-detail>`

### 2. Attributes
- `[clrDgLoading]` → `[pkDgLoading]`
- `[clrDgField]` → `[pkDgField]`
- `[clrDgItem]` → `[pkDgItem]`
- `*clrDgItems` → `*pkDgItems`
- `*clrIfExpanded` → `*pkIfExpanded`
- `#pagination [clrDgPageSize]` → `#pagination [pkDgPageSize]`
- `[clrPageSizeOptions]` → `[pkPageSizeOptions]`

### 3. Module Import
```typescript
// เปลี่ยนจาก
import { ClrDatagridModule } from '@clr/angular';

// เป็น
import { PkDatagridModule } from 'src/app/pk-ui/pk-datagrid/pk-datagrid.module';
```

## ตัวอย่าง Migration

### Before (Clarity):
```html
<clr-datagrid [clrDgLoading]="loading">
  <clr-dg-column [clrDgField]="'username'" [style.width.px]="250">username</clr-dg-column>
  <clr-dg-column [clrDgField]="'fname'">name</clr-dg-column>
  
  <clr-dg-row *clrDgItems="let user of users" [clrDgItem]="user">
    <clr-dg-cell>{{user.username}}</clr-dg-cell>
    <clr-dg-cell>{{user.fname}}</clr-dg-cell>
    
    <clr-dg-row-detail *clrIfExpanded>
      <p>Detail content</p>
    </clr-dg-row-detail>
  </clr-dg-row>
  
  <clr-dg-footer>
    <clr-dg-pagination #pagination [clrDgPageSize]="10">
      <clr-dg-page-size [clrPageSizeOptions]="[10,20,50]">Items per page</clr-dg-page-size>
      {{pagination.firstItem + 1}} - {{pagination.lastItem + 1}} of {{pagination.totalItems}} users
    </clr-dg-pagination>
  </clr-dg-footer>
</clr-datagrid>
```

### After (PK Datagrid):
```html
<pk-datagrid [pkDgLoading]="loading">
  <pk-dg-column [pkDgField]="'username'" [style.width.px]="250">username</pk-dg-column>
  <pk-dg-column [pkDgField]="'fname'">name</pk-dg-column>
  
  <pk-dg-row *pkDgItems="let user of users" [pkDgItem]="user">
    <pk-dg-cell>{{user.username}}</pk-dg-cell>
    <pk-dg-cell>{{user.fname}}</pk-dg-cell>
    
    <pk-dg-row-detail *pkIfExpanded>
      <p>Detail content</p>
    </pk-dg-row-detail>
  </pk-dg-row>
  
  <pk-dg-footer>
    <pk-dg-pagination #pagination [pkDgPageSize]="10" [totalItems]="users.length">
      <pk-dg-page-size [pkPageSizeOptions]="[10,20,50]">Items per page</pk-dg-page-size>
      {{pagination.firstItem + 1}} - {{pagination.lastItem + 1}} of {{pagination.totalItems}} users
    </pk-dg-pagination>
  </pk-dg-footer>
</pk-datagrid>
```

## สิ่งที่ต้องระวัง

1. **Pagination totalItems**: ต้องเพิ่ม `[totalItems]="users.length"` ใน `pk-dg-pagination`
2. **Module Import**: อย่าลืม import `PkDatagridModule` ในทุก module ที่ใช้งาน
3. **Icons**: ถ้าใช้ `<clr-icon>` ให้เปลี่ยนเป็น `<cds-icon>` หรือ `<fa-icon>` ตามที่เหมาะสม
4. **Styling**: บาง CSS classes อาจต้องปรับให้เข้ากับ PK Datagrid

## Testing Checklist

- [ ] Sorting ทำงานถูกต้อง
- [ ] Pagination แสดงผลถูกต้อง
- [ ] Loading state ทำงาน
- [ ] Row expansion ทำงาน
- [ ] Click events ทำงานถูกต้อง
- [ ] Responsive design ใช้งานได้บนหน้าจอขนาดต่างๆ
