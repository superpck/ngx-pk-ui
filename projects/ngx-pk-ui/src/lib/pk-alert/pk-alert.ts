import { Component, inject, signal, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PkAlertService } from './pk-alert.service';
import { AlertInputType } from './pk-alert.model';

@Component({
  selector: 'pk-alert',
  imports: [FormsModule],
  templateUrl: './pk-alert.html',
  styleUrl: './pk-alert.css',
})
export class PkAlert {
  svc = inject(PkAlertService);

  /** Local copy of input value while the dialog is open */
  inputValue = signal<string | number | boolean | null>(null);

  constructor() {
    effect(() => {
      const slot = this.svc.slot();
      if (slot) {
        const def = slot.config.defaultValue;
        this.inputValue.set(def !== undefined ? def : this._defaultFor(slot.config.inputType));
      }
    });
  }

  confirm(): void {
    const slot = this.svc.slot();
    if (!slot) return;
    const type = slot.config.type;
    if (type === 'confirm') {
      this.svc._resolve(true);
    } else if (type === 'input') {
      this.svc._resolve(this.inputValue());
    } else {
      this.svc._resolve(undefined);
    }
  }

  cancel(): void {
    const slot = this.svc.slot();
    if (!slot) return;
    const type = slot.config.type;
    this.svc._resolve(type === 'confirm' ? false : null);
  }

  private _defaultFor(inputType: AlertInputType | undefined): string | number | boolean | null {
    switch (inputType) {
      case 'number': return 0;
      case 'boolean': return false;
      case 'date': return '';
      default: return '';
    }
  }
}
