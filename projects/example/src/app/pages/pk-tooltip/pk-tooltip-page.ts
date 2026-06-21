import { Component, ChangeDetectionStrategy } from '@angular/core';
import { PkTooltip } from 'ngx-pk-ui';

@Component({
  selector: 'app-pk-tooltip-page',
  imports: [PkTooltip],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './pk-tooltip-page.html',
})
export class PkTooltipPage {}
