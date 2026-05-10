import { Component } from '@angular/core';
import { PkTimeline, PkTimelineItem } from 'ngx-pk-ui';

@Component({
  selector: 'app-pk-timeline-page',
  imports: [PkTimeline, PkTimelineItem],
  templateUrl: './pk-timeline-page.html',
})
export class PkTimelinePage {}
