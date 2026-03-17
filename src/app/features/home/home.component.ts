import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-home',
  template: `<p>Home — Mimacramé Studio</p>`,
})
export class HomeComponent {}
