import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-welcome',
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './welcome.html',
  styleUrl: './welcome.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Welcome {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  private readonly studentSig = toSignal(this.auth.student$, { initialValue: null });
  readonly ime = computed(() => this.studentSig()?.ime ?? '');
  readonly uloga = computed(() => this.studentSig()?.uloga ?? '');

  onLogout() {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }
}
