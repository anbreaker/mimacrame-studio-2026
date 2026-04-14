import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';

import { RevealDirective } from '@shared/directives/reveal.directive';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RevealDirective, RouterLink, TranslocoDirective],
  selector: 'app-shipping',
  standalone: true,
  styleUrl: './shipping.component.scss',
  templateUrl: './shipping.component.html',
})
export class ShippingComponent {}
