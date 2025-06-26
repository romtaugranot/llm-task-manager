import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NavbarLinksComponent } from './links/links.component';
import { NavbarUserComponent } from './user/user.component';
import { fadeInDown } from '../../animations';
import { MockAuthService as AuthService } from '../../../core';

@Component({
    selector: 'app-navbar',
    imports: [CommonModule, NavbarLinksComponent, NavbarUserComponent],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.scss',
    animations: [fadeInDown],
})
export class NavbarComponent {
    private readonly authService = inject(AuthService);

    // Get authentication state from service
    readonly isAuthenticated = this.authService.isAuthenticated;
    readonly user = this.authService.user;
}
