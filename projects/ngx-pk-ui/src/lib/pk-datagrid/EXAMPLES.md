# PK Datagrid - ตัวอย่างการใช้งาน

## ตัวอย่างที่ 1: Basic Datagrid

```html
<pk-datagrid [pkDgLoading]="loading">
  <pk-dg-column [pkDgField]="'username'" [style.width.px]="250">username</pk-dg-column>
  <pk-dg-column [pkDgField]="'fname'">name</pk-dg-column>
  <pk-dg-column [pkDgField]="'position'">position</pk-dg-column>
  
  <pk-dg-row *pkDgItems="let user of users" [pkDgItem]="user" (click)="currentRow=user">
    <pk-dg-cell (click)="onEdit(user)" style="cursor: pointer;">{{user.username}}</pk-dg-cell>
    <pk-dg-cell (click)="onEdit(user)" style="cursor: pointer;">{{user.fname}} {{user.lname}}</pk-dg-cell>
    <pk-dg-cell>{{user.positionName}}</pk-dg-cell>
  </pk-dg-row>
  
  <pk-dg-footer>
    <pk-dg-pagination #pagination [pkDgPageSize]="10" [totalItems]="users.length">
      {{pagination.firstItem + 1}} - {{pagination.lastItem + 1}} of {{users.length}} users
    </pk-dg-pagination>
  </pk-dg-footer>
</pk-datagrid>
```

## ตัวอย่างที่ 2: Datagrid with Expandable Rows

```html
<pk-datagrid [pkDgLoading]="loading">
  <pk-dg-column [pkDgField]="'username'" [style.width.px]="250">username</pk-dg-column>
  <pk-dg-column [pkDgField]="'fname'">name</pk-dg-column>
  <pk-dg-column [style.width.px]="50">status</pk-dg-column>
  
  <pk-dg-row *pkDgItems="let user of users" [pkDgItem]="user">
    <pk-dg-cell>{{user.username}}</pk-dg-cell>
    <pk-dg-cell>{{user.fname}} {{user.lname}}, {{user.prename}}</pk-dg-cell>
    <pk-dg-cell>
      @if (user.expired_at === 'active' && user.confirmed_at !== 'unconfirm') {
        <cds-icon shape="success-standard" status="success"></cds-icon>
      }
      @if (user.expired_at !== 'active' || user.confirmed_at === 'unconfirm') {
        <cds-icon shape="times-circle" status="danger"></cds-icon>
      }
    </pk-dg-cell>
    
    <pk-dg-row-detail *pkIfExpanded>
      <div class="pk-row" style="width: 95%">
        <table class="table">
          <tr>
            <td class="text-right">สถานพยาบาล</td>
            <td class="text-left">{{user.hcode}}, {{user.hname}}</td>
          </tr>
          <tr>
            <td class="text-right">email</td>
            <td class="text-left">{{user.email}}</td>
          </tr>
          <tr>
            <td class="text-right"></td>
            <td class="text-left">
              <button class="btn btn-sm btn-outline" (click)="onEdit(user)">Edit</button>
            </td>
          </tr>
        </table>
      </div>
    </pk-dg-row-detail>
  </pk-dg-row>
  
  <pk-dg-footer>
    <pk-dg-pagination #pagination [pkDgPageSize]="10" [totalItems]="users.length">
      <pk-dg-page-size [pkPageSizeOptions]="[10,15,20,50,100]">Users per page</pk-dg-page-size>
      {{pagination.firstItem + 1}} - {{pagination.lastItem + 1}} of {{pagination.totalItems}} users
    </pk-dg-pagination>
  </pk-dg-footer>
</pk-datagrid>
```

## TypeScript Component

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent {
  loading = false;
  users: any[] = [];
  currentRow: any = {};
  
  ngOnInit() {
    this.loadUsers();
  }
  
  async loadUsers() {
    this.loading = true;
    // Load data...
    this.loading = false;
  }
  
  onEdit(user: any) {
    console.log('Edit user:', user);
  }
}
```

## Module Import

```typescript
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PkDatagridModule } from 'src/app/pk-ui/pk-datagrid/pk-datagrid.module';

@NgModule({
  declarations: [UserListComponent],
  imports: [
    CommonModule,
    PkDatagridModule
  ]
})
export class UsersModule { }
```
