import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { PkDatepickerComponent } from './pk-datepicker.component';

@Injectable({
  providedIn: 'root'
})
export class DatepickerService {
  private activeDatepicker = new Subject<PkDatepickerComponent | null>();

  // Notify when a datepicker is opened
  openDatepicker(component: PkDatepickerComponent) {
    this.activeDatepicker.next(component);
  }

  // Subscribe to know when another datepicker opens
  getActiveDatepicker() {
    return this.activeDatepicker.asObservable();
  }
}