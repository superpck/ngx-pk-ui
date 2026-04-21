import { Component, inject } from '@angular/core';
import { PkToastrService } from 'ngx-pk-ui';

@Component({
  selector: 'app-pk-toastr-page',
  imports: [],
  templateUrl: './pk-toastr-page.html',
})
export class PkToastrPage {
  toastr = inject(PkToastrService);
}
