import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-catalogue',
  template: `<p>Catálogo</p>`,
})
export class CatalogueComponent {}
