import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';

import { RevealDirective } from '@shared/directives/reveal.directive';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RevealDirective, RouterLink, TranslocoDirective],
  selector: 'app-care',
  standalone: true,
  styleUrl: './care.component.scss',
  templateUrl: './care.component.html',
})
export class CareComponent {}
