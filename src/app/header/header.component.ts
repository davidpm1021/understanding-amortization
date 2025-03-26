import { Component } from '@angular/core';
import { LogoComponent } from '../logo/logo.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  imports: [LogoComponent],
  standalone: true
})
export class HeaderComponent {

}
