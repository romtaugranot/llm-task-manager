import { Component, HostListener, inject, computed } from '@angular/core';
import { Router } from '@angular/router';
import { slideDown, scaleInOut } from '../../../animations';
import { MockAuthService as AuthService } from '../../../../core';

@Component({
    selector: 'app-navbar-user',
    imports: [],
    templateUrl: './user.component.html',
    styleUrl: './user.component.scss',
    animations: [slideDown, scaleInOut],
})
export class NavbarUserComponent {
    private readonly router = inject(Router);
    private readonly authService = inject(AuthService);

    isDropdownOpen = false;

    // Get user data from auth service
    readonly user = this.authService.user;
    readonly isAuthenticated = this.authService.isAuthenticated;

    // Computed properties for user display
    readonly userName = computed(() => {
        const user = this.user();
        return user ? `${user.firstName} ${user.lastName}` : '';
    });

    readonly userEmail = computed(() => {
        const user = this.user();
        return user?.email || '';
    });

    readonly userInitials = computed(() => {
        const user = this.user();
        if (!user) return '';

        return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
    });

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
        this.authService.signOut().subscribe({
            next: () => {
                this.router.navigate(['/login']);
            },
            error: (error) => {
                console.error('Logout error:', error);
                // Even if logout fails on server, we've cleared local state
            },
        });
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
