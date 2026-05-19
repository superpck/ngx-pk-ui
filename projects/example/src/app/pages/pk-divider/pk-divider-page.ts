import { Component } from '@angular/core';

@Component({
  selector: 'app-pk-divider-page',
  imports: [],
  templateUrl: './pk-divider-page.html',
})
export class PkDividerPage {
  codeBasic = `<div class="pk-divider"></div>`;
  codeLabel = `<div class="pk-divider">or</div>
<div class="pk-divider pk-divider--left">Section A</div>
<div class="pk-divider pk-divider--right">End</div>`;
  codeVertical = `<span>Home</span>
<span class="pk-divider pk-divider--vertical"></span>
<span>Profile</span>
<span class="pk-divider pk-divider--vertical"></span>
<span>Settings</span>`;
  codeStyle = `<div class="pk-divider pk-divider--dashed">Dashed</div>
<div class="pk-divider pk-divider--dotted">Dotted</div>
<div class="pk-divider pk-divider--md pk-divider--dashed">Medium dashed</div>
<div class="pk-divider pk-divider--thick">Thick solid</div>`;
  codeColor = `<div class="pk-divider pk-divider--primary">Primary</div>
<div class="pk-divider pk-divider--success">Success</div>
<div class="pk-divider pk-divider--error pk-divider--dashed">Error dashed</div>`;
}
