import { Component, inject } from '@angular/core';
import { PkToastrService } from './pk-toastr.service';

@Component({
  selector: 'pk-toastr',
  templateUrl: './pk-toastr.html',
  styleUrl: './pk-toastr.css',
})
export class PkToastr {
  toastr = inject(PkToastrService);
}
