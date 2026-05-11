import { Component, inject } from '@angular/core';
import { PkToastrService } from './pk-toastr.service';
import { ToastPosition } from './pk-toastr.model';

@Component({
  selector: 'pk-toastr',
  templateUrl: './pk-toastr.html',
  styleUrl: './pk-toastr.css',
})
export class PkToastr {
  toastr = inject(PkToastrService);

  readonly allPositions: ToastPosition[] = [
    'top-left', 'top-center', 'top-right',
    'center-left', 'center-center', 'center-right',
    'bottom-left', 'bottom-center', 'bottom-right',
    'top-full', 'bottom-full',
  ];
}
