import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  untracked,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter, map, startWith } from 'rxjs';
import { fromEvent } from 'rxjs';
import { TranslocoDirective } from '@jsverse/transloco';

import { AuthStore } from '@core/store/auth.store';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, RouterOutlet, TranslocoDirective],
  selector: 'app-account-shell',
  standalone: true,
  styleUrl: './account-shell.component.scss',
  templateUrl: './account-shell.component.html',
})
export class AccountShellComponent {
  private readonly router = inject(Router);
  protected readonly authStore = inject(AuthStore);

  private readonly windowWidth = toSignal(
    fromEvent(window, 'resize').pipe(
      map(() => window.innerWidth),
      startWith(window.innerWidth)
    ),
    { initialValue: window.innerWidth }
  );

  protected readonly isMobile = computed(() => this.windowWidth() < 768);

  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map((event) => (event as NavigationEnd).urlAfterRedirects),
      startWith(this.router.url)
    )
  );

  protected readonly isSubPage = computed(() => {
    const url = this.currentUrl() || '';
    return url.includes('/profile') || url.includes('/orders');
  });

  constructor() {
    effect(() => {
      const url = this.currentUrl() || '';
      const isMobile = this.isMobile();

      if (url === '/account' && !isMobile) {
        untracked(() => this.router.navigate(['/account/orders']));
      }
    });
  }

  protected get avatarInitial(): string {
    const name = this.authStore.displayName();
    return name ? name.charAt(0).toUpperCase() : '?';
  }

  protected logout(): void {
    this.authStore.logout();
  }
}
