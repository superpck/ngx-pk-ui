import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-pk-btn-page',
  imports: [],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './pk-btn-page.html',
})
export class PkBtnPage {
  // primary,secondary,success,error,warn,amber,yellow,
  // lime,emerald,tea,cyan,sky,blue,indigo,violet,
  // purple,fuchsia,pink,rose,slate,gray,zinc,neutral,stone,taupe,mauve,
  // mist,olive
  buttonList= [
    { name: 'Primary', type: 'primary' },
    { name: 'Secondary', type: 'secondary' },
    { name: 'Success', type: 'success' },
    { name: 'Error', type: 'error' },
    { name: 'Warn', type: 'warn' },
    { name: 'Amber', type: 'amber' },
    { name: 'Yellow', type: 'yellow' },
    { name: 'Lime', type: 'lime' },
    { name: 'Emerald', type: 'emerald' },
    { name: 'Tea', type: 'tea' },
    { name: 'Cyan', type: 'cyan' },
    { name: 'Sky', type: 'sky' },
    { name: 'Blue', type: 'blue' },
    { name: 'Indigo', type: 'indigo' },
    { name: 'Violet', type: 'violet' },
    { name: 'Purple', type: 'purple' },
    { name: 'Fuchsia', type: 'fuchsia' },
    { name: 'Pink', type: 'pink' },
    { name: 'Rose', type: 'rose' },
    { name: 'Slate', type: 'slate' },
    { name: 'Gray', type: 'gray' },
    { name: 'Zinc', type: 'zinc' },
    { name: 'Neutral', type: 'neutral' },
    { name: 'Stone', type: 'stone' },
    { name: 'Taupe', type: 'taupe' },
    { name: 'Mauve', type: 'mauve' },
    { name: 'Mist', type: 'mist' },
    { name: 'Olive', type: 'olive' }
  ];

}
