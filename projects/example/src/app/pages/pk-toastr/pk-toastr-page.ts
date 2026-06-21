import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { PkToastrService } from 'ngx-pk-ui';

@Component({
  selector: 'app-pk-toastr-page',
  imports: [],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './pk-toastr-page.html',
})
export class PkToastrPage {
  toastr = inject(PkToastrService);
}
