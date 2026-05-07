import { Component, signal } from '@angular/core';
import { PkDatagridModule, PkIcon } from 'ngx-pk-ui';

interface UserRow {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  role: string;
  email: string;
  active: boolean;
}

@Component({
  selector: 'app-pk-datagrid-page',
  imports: [PkDatagridModule, PkIcon],
  templateUrl: './pk-datagrid-page.html',
})
export class PkDatagridPage {
  loading = signal(false);

  users: UserRow[] = [
    { id: 1, username: 'jsmith', firstName: 'John', lastName: 'Smith', role: 'Admin', email: 'john.smith@company.com', active: true },
    { id: 2, username: 'mjohnson', firstName: 'Mary', lastName: 'Johnson', role: 'Manager', email: 'mary.johnson@company.com', active: true },
    { id: 3, username: 'tlee', firstName: 'Tom', lastName: 'Lee', role: 'Developer', email: 'tom.lee@company.com', active: true },
    { id: 4, username: 'asanchez', firstName: 'Ana', lastName: 'Sanchez', role: 'Developer', email: 'ana.sanchez@company.com', active: false },
    { id: 5, username: 'bwong', firstName: 'Ben', lastName: 'Wong', role: 'QA', email: 'ben.wong@company.com', active: true },
    { id: 6, username: 'pkim', firstName: 'Paul', lastName: 'Kim', role: 'Support', email: 'paul.kim@company.com', active: false },
    { id: 7, username: 'lmartin', firstName: 'Laura', lastName: 'Martin', role: 'Manager', email: 'laura.martin@company.com', active: true },
    { id: 8, username: 'npatel', firstName: 'Nina', lastName: 'Patel', role: 'Developer', email: 'nina.patel@company.com', active: true },
    { id: 9, username: 'dclark', firstName: 'David', lastName: 'Clark', role: 'QA', email: 'david.clark@company.com', active: true },
    { id: 10, username: 'rgarcia', firstName: 'Rosa', lastName: 'Garcia', role: 'Support', email: 'rosa.garcia@company.com', active: false },
    { id: 11, username: 'hnguyen', firstName: 'Huy', lastName: 'Nguyen', role: 'Developer', email: 'huy.nguyen@company.com', active: true },
    { id: 12, username: 'frossi', firstName: 'Franco', lastName: 'Rossi', role: 'Admin', email: 'franco.rossi@company.com', active: true },
  ];

  simulateLoading() {
    this.loading.set(true);
    setTimeout(() => this.loading.set(false), 1200);
  }
}
