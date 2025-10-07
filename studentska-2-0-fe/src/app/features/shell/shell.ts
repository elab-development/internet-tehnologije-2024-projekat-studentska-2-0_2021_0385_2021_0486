import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NAV_ITEMS } from './nav.items';
import { AuthService } from '../../services/auth.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { ThemeService } from '../../theme/theme.service';

@Component({
  selector: 'app-shell',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './shell.html',
  styleUrl: './shell.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Shell {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly userSig = toSignal(this.auth.student$, { initialValue: null });
  readonly themeService = inject(ThemeService);

  readonly nextSchemeLabel = computed(() =>
    this.themeService.scheme() === 'dark' ? 'svetliju' : 'tamniju'
  );

  toggleTheme(): void {
    this.themeService.toggle();
  }

  logout(): void {
    this.auth.logout();
  }

  isMobile = signal(window.matchMedia('(max-width: 960px)').matches);
  constructor() {
    const mq = window.matchMedia('(max-width: 960px)');
    const handler = (e: MediaQueryListEvent) => this.isMobile.set(e.matches);
    mq.addEventListener('change', handler);

    effect(() => {
      const user = this.userSig();
      if (!user) {
        this.router.navigate(['/login']);
      }
    });
  }


  visibleItems = computed(() => {
    const u = this.userSig();
    const role = u?.uloga as any;
    return NAV_ITEMS.filter((i) => !i.roles || (role && i.roles.includes(role)));
  });
}
