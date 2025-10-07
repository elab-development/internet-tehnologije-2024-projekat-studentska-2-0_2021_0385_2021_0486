import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

import { ThemeService } from './theme/theme.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatButtonModule],
  template: `
    <main class="landing">
      <section class="panel">
        <header class="panel__header">
          <p class="panel__eyebrow">Studentska 2.0</p>
          <h1 class="panel__title">Your campus companion, beautifully themed</h1>
        </header>

        <p class="panel__description">
          Enjoy a polished Material 3 foundation with colors tuned for students—focus on building
          features while the design system keeps everything consistent.
        </p>

        <div class="panel__actions">
          <button mat-raised-button color="primary" type="button" (click)="toggleTheme()">
            Switch to {{ nextSchemeLabel() }} theme
          </button>
        </div>

        <p class="panel__status">Current theme: <strong>{{ currentSchemeLabel() }}</strong></p>
      </section>

      <router-outlet></router-outlet>
    </main>
  `,
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  private readonly themeService = inject(ThemeService);

  readonly scheme = this.themeService.scheme;
  readonly isDark = this.themeService.isDark;
  readonly currentSchemeLabel = computed(() => (this.scheme() === 'dark' ? 'Dark' : 'Light'));
  readonly nextSchemeLabel = computed(() => (this.scheme() === 'dark' ? 'Light' : 'Dark'));

  toggleTheme(): void {
    this.themeService.toggle();
  }
}
