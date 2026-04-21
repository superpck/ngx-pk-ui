import { Component, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PkDatepickerComponent } from 'ngx-pk-ui';

@Component({
  selector: 'app-pk-datepicker-page',
  imports: [FormsModule, DatePipe, PkDatepickerComponent],
  templateUrl: './pk-datepicker-page.html',
})
export class PkDatepickerPage {
  dateValue = signal<Date | null>(new Date());
  maxDate = new Date();
  minDate = new Date(this.maxDate.getFullYear() - 1, this.maxDate.getMonth(), this.maxDate.getDate());

  onDateChange(date: Date | null) {
    this.dateValue.set(date);
  }
}
