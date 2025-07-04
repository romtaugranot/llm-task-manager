import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MockAuthService as AuthService } from '../../core';
import {
    fadeInUp,
    scaleIn,
    bounceIn,
    slideInLeft,
    slideInRight,
    staggerIn,
    scaleInOut,
} from '../../shared/animations';

@Component({
    selector: 'app-not-found',
    standalone: true,
    imports: [],
    templateUrl: './not-found.component.html',
    styleUrl: './not-found.component.scss',
    animations: [fadeInUp, scaleIn, bounceIn, slideInLeft, slideInRight, staggerIn, scaleInOut],
})
export class NotFoundComponent {
    private readonly router = inject(Router);
    private readonly authService = inject(AuthService);

    // Get authentication state
    readonly isAuthenticated = this.authService.isAuthenticated;

    goHome(): void {
        this.router.navigate(['/dashboard']);
    }

    goToCalendar(): void {
        this.router.navigate(['/calendar']);
    }

    goToLogin(): void {
        this.router.navigate(['/login']);
    }

    goToSignup(): void {
        this.router.navigate(['/signup']);
    }
}