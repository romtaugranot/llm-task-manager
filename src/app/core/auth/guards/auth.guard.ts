import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { MockAuthService as AuthService } from '../../auth';

/**
 * Guard to protect routes that require authentication
 */
export const authGuard: CanActivateFn = (_, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.isAuthenticated()) {
        return true;
    }

    // Store the attempted URL for redirecting after login
    const returnUrl = state.url;
    router.navigate(['/login'], {
        queryParams: { returnUrl },
        replaceUrl: true,
    });

    return false;
};

/**
 * Guard to redirect authenticated users away from auth pages
 */
export const redirectAuthenticatedGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.isAuthenticated()) {
        // Redirect to dashboard if already authenticated
        router.navigate(['/dashboard'], { replaceUrl: true });
        return false;
    }

    return true;
};
