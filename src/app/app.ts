import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { BottomNavComponent } from './shared/bottom-nav/bottom-nav.component';
import { FooterComponent } from './shared/footer/footer.component';
import { NavbarComponent } from './shared/navbar/navbar.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BottomNavComponent, FooterComponent, NavbarComponent, RouterOutlet],
  selector: 'app-root',
  standalone: true,
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class AppComponent {}
