import { Component, inject, signal, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { PkDatagridModule, PkIcon, PkTooltip } from 'ngx-pk-ui';

interface UserRow {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  cell: string;
  gender: string;
  age: number;
  dob: string;
  city: string;
  country: string;
  nat: string;
  thumbnail: string;
  picture: string;
}

@Component({
  selector: 'app-pk-datagrid-page',
  imports: [
    PkDatagridModule, PkIcon, 
    PkTooltip, DatePipe
  ],
  templateUrl: './pk-datagrid-page.html',
})
export class PkDatagridPage implements OnInit {
  private http = inject(HttpClient);

  loading = signal(true);
  users: UserRow[] = [];
  selectedUser: UserRow | null = null;

  // row selection demo
  singleSelected: UserRow[] = [];
  multiSelected: UserRow[] = [];

  ngOnInit() {
    this.fetchUsers();
  }

  fetchUsers() {
    this.loading.set(true);
    this.http.get<any>('https://randomuser.me/api/?results=100').subscribe({
      next: (res) => {
        this.users = res.results.map((r: any) => ({
          username: r.login.username,
          firstName: r.name.first,
          lastName: r.name.last,
          email: r.email,
          phone: r.phone,
          cell: r.cell,
          gender: r.gender,
          age: r.dob.age,
          dob: r.dob.date,
          city: r.location.city,
          country: r.location.country,
          nat: r.nat,
          thumbnail: r.picture.thumbnail,
          picture: r.picture.large,
        }));
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
