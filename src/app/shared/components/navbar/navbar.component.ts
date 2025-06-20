import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NavbarLinksComponent } from './links/links.component';
import { NavbarUserComponent } from './user/user.component';
import { fadeInDown } from '../../animations';

@Component({
    selector: 'app-navbar',
    imports: [CommonModule, NavbarLinksComponent, NavbarUserComponent],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.scss',
    animations: [fadeInDown]
})
export class NavbarComponent {
    isDropdownOpen = false;

    // Mock user data - in real app this would come from a service
    userName = 'John Doe';
    userEmail = 'john.doe@example.com';
}