import { Component, computed, inject, signal } from '@angular/core';
import {
  PkAlertService,
  PkIcon,
  PkProgressComponent,
  PkToastrService,
  type ProgressConfig,
} from 'ngx-pk-ui';

@Component({
  selector: 'app-login-example',
  imports: [PkIcon, PkProgressComponent],
  templateUrl: './login-example.html',
  styleUrl: './login-example.css',
})
export class LoginExample {
  private toastr = inject(PkToastrService);
  private alert = inject(PkAlertService);

  email = signal('');
  password = signal('');
  rememberMe = signal(false);
  showPassword = signal(false);
  isLoading = signal(false);

  emailError = signal('');
  passwordError = signal('');

  passwordStrength = computed<number>(() => {
    const val = this.password();
    if (!val) return 0;
    let score = 0;
    if (val.length >= 8) score += 25;
    if (/[A-Z]/.test(val)) score += 25;
    if (/[0-9]/.test(val)) score += 25;
    if (/[^A-Za-z0-9]/.test(val)) score += 25;
    return score;
  });

  strengthLabel = computed<string>(() => {
    const s = this.passwordStrength();
    if (s === 0) return '';
    if (s <= 25) return 'Weak';
    if (s <= 50) return 'Fair';
    if (s <= 75) return 'Good';
    return 'Strong';
  });

  strengthStatus = computed<'error' | 'warning' | 'normal' | 'success'>(() => {
    const s = this.passwordStrength();
    if (s <= 25) return 'error';
    if (s <= 50) return 'warning';
    if (s <= 75) return 'normal';
    return 'success';
  });

  progressConfig = computed<ProgressConfig>(() => ({
    type: 'line',
    percent: this.passwordStrength(),
    status: this.strengthStatus(),
    showInfo: false,
    strokeWidth: 6,
  }));

  onEmailInput(event: Event): void {
    this.email.set((event.target as HTMLInputElement).value);
    if (this.emailError()) this.emailError.set('');
  }

  onPasswordInput(event: Event): void {
    this.password.set((event.target as HTMLInputElement).value);
    if (this.passwordError()) this.passwordError.set('');
  }

  toggleShowPassword(): void {
    this.showPassword.update(v => !v);
  }

  toggleRememberMe(): void {
    this.rememberMe.update(v => !v);
  }

  async signIn(): Promise<void> {
    let valid = true;

    if (!this.email()) {
      this.emailError.set('Email is required');
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email())) {
      this.emailError.set('Enter a valid email address');
      valid = false;
    } else {
      this.emailError.set('');
    }

    if (!this.password()) {
      this.passwordError.set('Password is required');
      valid = false;
    } else if (this.password().length < 6) {
      this.passwordError.set('Minimum 6 characters');
      valid = false;
    } else {
      this.passwordError.set('');
    }

    if (!valid) return;

    this.isLoading.set(true);
    await new Promise(r => setTimeout(r, 1500));
    this.isLoading.set(false);

    // Demo: trigger error with "error@test.com"
    if (this.email().toLowerCase() === 'error@test.com') {
      this.passwordError.set('Invalid email or password');
      this.toastr.error('The credentials you entered are incorrect.', 'Login failed');
    } else {
      const name = this.email().split('@')[0];
      this.toastr.success(`Welcome back, ${name}!`, 'Signed in successfully');
    }
  }

  async forgotPassword(): Promise<void> {
    const result = await this.alert.input(
      "Enter your email address and we'll send you a reset link.",
      'string',
      'Forgot password?',
      this.email()
    );
    if (result) {
      this.toastr.info(`Reset link sent to ${result}`, 'Check your inbox', { duration: 6000 });
    }
  }

  signInWithGitHub(): void {
    this.toastr.info('GitHub OAuth is not connected in this demo.', 'Demo only');
  }

  signInWithGoogle(): void {
    this.toastr.info('Google OAuth is not connected in this demo.', 'Demo only');
  }

  readonly components = [
    'pk-form (floating labels)',
    'pk-btn',
    'pk-card',
    'pk-spinner',
    'pk-toggle',
    'pk-progress',
    'pk-icon',
    'pk-badge',
    'PkToastrService',
    'PkAlertService',
  ];
}
