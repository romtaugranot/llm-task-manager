import { Component, HostListener, inject, input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-navbar-user',
    imports: [],
    templateUrl: './user.component.html',
    styleUrl: './user.component.scss',
})
export class NavbarUserComponent {
    router = inject(Router);

    isDropdownOpen = false;

    // Mock user data - in real app this would come from a service
    userName = input.required<string>();
    userEmail = input.required<string>();

    get userInitials(): string {
        return this.userName()
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
