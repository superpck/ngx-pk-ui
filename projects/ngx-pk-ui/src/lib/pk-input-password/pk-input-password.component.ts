import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'pk-input-password',
  standalone: false,
  templateUrl: './pk-input-password.component.html',
  styleUrls: ['./pk-input-password.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PkInputPasswordComponent),
      multi: true
    }
  ]
})
export class PkInputPasswordComponent implements ControlValueAccessor {
  @Input() customClass: string = '';
  @Input() placeholder: string = '';
  @Input() style: string = '';
  @Input() disabled: boolean = false;
  @Input() customStyle: { [key: string]: string } = { 'width': '100%' };

  value: string = '';
  showPassword: boolean = false;

  // Function to call when the value changes
  onChange: any = () => { };

  // Function to call when the input is touched
  onTouch: any = () => { };

  // Toggle password visibility
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  // Handle input changes
  onInputChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.onChange(this.value);
    this.onTouch();
  }

  // ControlValueAccessor methods
  writeValue(value: string): void {
    this.value = value || '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}