import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

interface Holiday {
  date: Date;
  title: string;
}

@Injectable({
  providedIn: 'root'
})
export class HolidayService {
  constructor() { }

  // Mock for testing
  getHolidays(year: number): Observable<Holiday[]> {
    const mockHolidays: Holiday[] = [
      { date: new Date(2025, 0, 1), title: "วันขึ้นปีใหม่" },
      { date: new Date(2025, 3, 13), title: "วันสงกรานต์" },
      { date: new Date(2025, 3, 14), title: "วันสงกรานต์" },
      { date: new Date(2025, 3, 15), title: "ชดเชยวันสงกรานต์" },
      { date: new Date(2025, 3, 16), title: "ชดเชยวันสงกรานต์" },
      { date: new Date(2025, 11, 25), title: "วันคริสต์มาส" }
    ].filter(h => h.date.getFullYear() === year);
    return of(mockHolidays);
  }
}