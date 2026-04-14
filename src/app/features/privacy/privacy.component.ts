import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';

import { RevealDirective } from '../../shared/directives/reveal.directive';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RevealDirective, RouterLink, TranslocoDirective],
  selector: 'app-privacy',
  standalone: true,
  styleUrl: './privacy.component.scss',
  templateUrl: './privacy.component.html',
})
export class PrivacyComponent {}
