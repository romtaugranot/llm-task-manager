import { CommonModule } from '@angular/common';
import { Component, inject, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { NavbarLinksComponent } from './links/links.component';

@Component({
    selector: 'app-navbar',
    imports: [CommonModule, NavbarLinksComponent],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
    isDropdownOpen = false;

    // Mock user data - in real app this would come from a service
    userName = 'John Doe';
    userEmail = 'john.doe@example.com';

    router = inject(Router);

    get userInitials(): string {
        return this.userName
            .split(' ')
            .map((name) => name.charAt(0))
            .join('')
            .toUpperCase();
    }

    toggleDropdown(): void {
        this.isDropdownOpen = !this.isDropdownOpen;
    }

    closeDropdown(): void {
        this.isDropdownOpen = false;
    }

    navigateTo(route: string): void {
        this.closeDropdown();
        this.router.navigate([route]);
    }

    logout(): void {
        this.closeDropdown();
        // In real app, clear authentication tokens/session
        this.router.navigate(['/login']);
    }

    @HostListener('document:click', ['$event'])
    onDocumentClick(event: MouseEvent): void {
        const target = event.target as HTMLElement;
        const userMenu = target.closest('.user-menu');

        if (!userMenu && this.isDropdownOpen) {
            this.closeDropdown();
        }
    }
}
