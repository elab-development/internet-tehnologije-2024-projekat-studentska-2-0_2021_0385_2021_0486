import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { FormFieldComponent, ActionButtonComponent } from '../../shared/components';
import { HighlightDirective } from '../../shared/directives';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, MatButtonModule, MatCardModule, FormFieldComponent, ActionButtonComponent, HighlightDirective],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  submitting = signal(false);
  serverErrors = signal<Record<string, string[]>>({});
  authMessage = signal<string | null>(null);

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  onSubmit() {
    if (this.form.invalid) return;
    this.submitting.set(true);
    this.serverErrors.set({});
    this.authMessage.set(null);
    this.auth.login(this.form.getRawValue()).subscribe({
      next: (res) => {
        this.auth.handleLoginSuccess(res);
        this.submitting.set(false);
        this.router.navigateByUrl('/app/welcome');
      },
      error: (err: HttpErrorResponse) => {
        this.submitting.set(false);
        if (err.status === 422) {
          const errors = (err.error?.errors ?? {}) as Record<string, string[]>;
          this.serverErrors.set(errors);
        } else if (err.status === 401) {
          // API returns message "Pogrešni podaci."
          this.authMessage.set(err.error?.message ?? 'Pogrešni podaci.');
        }
      },
    });
  }
}
