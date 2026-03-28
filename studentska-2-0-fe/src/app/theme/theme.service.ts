import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, OnDestroy, PLATFORM_ID, computed, effect, inject, signal } from '@angular/core';

type ThemeScheme = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService implements OnDestroy {
  private readonly storageKey = 'studentska-theme-scheme';
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private mediaQuery: MediaQueryList | null = null;

  private readonly activeScheme = signal<ThemeScheme>(this.getInitialScheme());

  readonly supportedSchemes: readonly ThemeScheme[] = ['light', 'dark'];

  readonly scheme = computed(() => this.activeScheme());
  readonly isDark = computed(() => this.activeScheme() === 'dark');

  constructor() {
    effect(() => {
      const scheme = this.activeScheme();
      this.applySchemeToDocument(scheme);
      this.persistScheme(scheme);
    });

    if (this.isBrowser) {
      this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      this.mediaQuery.addEventListener('change', this.handleSystemPreferenceChange);
    }
  }

  toggle(): void {
    this.activeScheme.update((current) => (current === 'light' ? 'dark' : 'light'));
  }

  setScheme(scheme: ThemeScheme): void {
    this.activeScheme.set(scheme);
  }

  private getInitialScheme(): ThemeScheme {
    if (!this.isBrowser) {
      return 'light';
    }

    try {
      const storedScheme = localStorage.getItem(this.storageKey) as ThemeScheme | null;
      if (storedScheme === 'light' || storedScheme === 'dark') {
        return storedScheme;
      }
    } catch (error) {
      console.warn('Unable to read persisted theme preference', error);
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  private applySchemeToDocument(scheme: ThemeScheme): void {
    const body = this.document?.body;
    if (!body) {
      return;
    }

    const classList = body.classList;
    classList.toggle('dark-theme', scheme === 'dark');
  }

  private persistScheme(scheme: ThemeScheme): void {
    if (!this.isBrowser) {
      return;
    }

    try {
      localStorage.setItem(this.storageKey, scheme);
    } catch (error) {
      console.warn('Unable to persist theme preference', error);
    }
  }

  private readonly handleSystemPreferenceChange = (event: MediaQueryListEvent): void => {
    const { matches } = event;
    const scheme: ThemeScheme = matches ? 'dark' : 'light';
    this.activeScheme.set(scheme);
  };

  ngOnDestroy(): void {
    if (!this.mediaQuery) {
      return;
    }

    this.mediaQuery.removeEventListener('change', this.handleSystemPreferenceChange);
    this.mediaQuery = null;
  }
}
