// src/app/core/services/auth.service.ts
import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError, of } from 'rxjs';
import { catchError, tap, finalize } from 'rxjs/operators';
import { AuthError, AuthResponse, LoginRequest, SignUpRequest, User } from '../interfaces';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private readonly http = inject(HttpClient);
    private readonly router = inject(Router);

    // API base URL - in production this should come from environment
    private readonly API_BASE_URL = 'https://api.yourapp.com';

    // Reactive state using signals
    private readonly _isLoading = signal(false);
    private readonly _user = signal<User | null>(null);
    private readonly _isAuthenticated = signal(false);
    private readonly _error = signal<AuthError | null>(null);

    // Public readonly signals
    readonly isLoading = this._isLoading.asReadonly();
    readonly user = this._user.asReadonly();
    readonly isAuthenticated = this._isAuthenticated.asReadonly();
    readonly error = this._error.asReadonly();

    // Token management
    private tokenKey = 'auth_token';
    private refreshTokenKey = 'refresh_token';
    private userKey = 'user_data';

    constructor() {
        this.initializeAuth();
    }

    /**
     * Initialize authentication state from stored tokens
     */
    private initializeAuth(): void {
        const token = this.getStoredToken();
        const userData = this.getStoredUser();

        if (token && userData && !this.isTokenExpired(token)) {
            this._user.set(userData);
            this._isAuthenticated.set(true);
        } else {
            this.clearAuthData();
        }
    }

    /**
     * Sign up a new user
     */
    signUp(signUpData: SignUpRequest): Observable<AuthResponse> {
        this._isLoading.set(true);
        this._error.set(null);

        return this.http.post<AuthResponse>(`${this.API_BASE_URL}/auth/signup`, signUpData).pipe(
            tap((response) => this.handleAuthSuccess(response)),
            catchError((error) => this.handleAuthError(error)),
            finalize(() => this._isLoading.set(false))
        );
    }

    /**
     * Sign in an existing user
     */
    signIn(loginData: LoginRequest): Observable<AuthResponse> {
        this._isLoading.set(true);
        this._error.set(null);

        return this.http.post<AuthResponse>(`${this.API_BASE_URL}/auth/signin`, loginData).pipe(
            tap((response) => this.handleAuthSuccess(response)),
            catchError((error) => this.handleAuthError(error)),
            finalize(() => this._isLoading.set(false))
        );
    }

    /**
     * Sign out the current user
     */
    signOut(): Observable<void> {
        const refreshToken = this.getStoredRefreshToken();

        // Clear local state immediately
        this.clearAuthData();

        // Attempt to invalidate token on server (don't wait for response)
        if (refreshToken) {
            this.http
                .post(`${this.API_BASE_URL}/auth/signout`, { refreshToken })
                .pipe(catchError(() => of(null)))
                .subscribe();
        }

        this.router.navigate(['/login']);
        return of(void 0);
    }

    /**
     * Refresh the authentication token
     */
    refreshToken(): Observable<AuthResponse> {
        const refreshToken = this.getStoredRefreshToken();

        if (!refreshToken) {
            return throwError(() => ({
                message: 'No refresh token available',
                code: 'NO_REFRESH_TOKEN',
            }));
        }

        return this.http
            .post<AuthResponse>(`${this.API_BASE_URL}/auth/refresh`, { refreshToken })
            .pipe(
                tap((response) => this.handleAuthSuccess(response)),
                catchError((error) => {
                    this.clearAuthData();
                    this.router.navigate(['/login']);
                    return this.handleAuthError(error);
                })
            );
    }

    /**
     * Check if user email already exists
     */
    checkEmailExists(email: string): Observable<{ exists: boolean }> {
        return this.http
            .get<{ exists: boolean }>(`${this.API_BASE_URL}/auth/check-email`, {
                params: { email },
            })
            .pipe(catchError(() => of({ exists: false })));
    }

    /**
     * Send password reset email
     */
    requestPasswordReset(email: string): Observable<{ success: boolean }> {
        return this.http
            .post<{ success: boolean }>(`${this.API_BASE_URL}/auth/password-reset`, { email })
            .pipe(catchError((error) => this.handleAuthError(error)));
    }

    /**
     * Reset password with token
     */
    resetPassword(token: string, newPassword: string): Observable<{ success: boolean }> {
        return this.http
            .post<{ success: boolean }>(`${this.API_BASE_URL}/auth/password-reset/confirm`, {
                token,
                password: newPassword,
            })
            .pipe(catchError((error) => this.handleAuthError(error)));
    }

    /**
     * Update user profile
     */
    updateProfile(updates: Partial<Pick<User, 'firstName' | 'lastName'>>): Observable<User> {
        return this.http.patch<User>(`${this.API_BASE_URL}/user/profile`, updates).pipe(
            tap((updatedUser) => {
                this._user.set(updatedUser);
                this.storeUser(updatedUser);
            }),
            catchError((error) => this.handleAuthError(error))
        );
    }

    /**
     * Clear any authentication errors
     */
    clearError(): void {
        this._error.set(null);
    }

    // Private helper methods

    private handleAuthSuccess(response: AuthResponse): void {
        const { user, token, refreshToken } = response;

        // Store tokens and user data
        this.storeToken(token);
        this.storeRefreshToken(refreshToken);
        this.storeUser(user);

        // Update state
        this._user.set(user);
        this._isAuthenticated.set(true);
        this._error.set(null);
    }

    private handleAuthError(error: HttpErrorResponse): Observable<never> {
        let authError: AuthError;

        if (error.error && typeof error.error === 'object') {
            authError = {
                message: error.error.message || 'An unexpected error occurred',
                code: error.error.code || 'UNKNOWN_ERROR',
                field: error.error.field,
            };
        } else {
            authError = {
                message: 'Network error. Please check your connection.',
                code: 'NETWORK_ERROR',
            };
        }

        this._error.set(authError);
        return throwError(() => authError);
    }

    private clearAuthData(): void {
        localStorage.removeItem(this.tokenKey);
        localStorage.removeItem(this.refreshTokenKey);
        localStorage.removeItem(this.userKey);

        this._user.set(null);
        this._isAuthenticated.set(false);
        this._error.set(null);
    }

    private storeToken(token: string): void {
        localStorage.setItem(this.tokenKey, token);
    }

    private storeRefreshToken(refreshToken: string): void {
        localStorage.setItem(this.refreshTokenKey, refreshToken);
    }

    private storeUser(user: User): void {
        localStorage.setItem(this.userKey, JSON.stringify(user));
    }

    private getStoredToken(): string | null {
        return localStorage.getItem(this.tokenKey);
    }

    private getStoredRefreshToken(): string | null {
        return localStorage.getItem(this.refreshTokenKey);
    }

    private getStoredUser(): User | null {
        const userData = localStorage.getItem(this.userKey);
        if (userData) {
            try {
                const parsed = JSON.parse(userData);
                // Convert date strings back to Date objects
                parsed.createdAt = new Date(parsed.createdAt);
                if (parsed.lastLoginAt) {
                    parsed.lastLoginAt = new Date(parsed.lastLoginAt);
                }
                return parsed;
            } catch {
                return null;
            }
        }
        return null;
    }

    private isTokenExpired(token: string): boolean {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const expiry = payload.exp * 1000; // Convert to milliseconds
            return Date.now() > expiry;
        } catch {
            return true; // If we can't parse the token, consider it expired
        }
    }

    /**
     * Get authorization header for HTTP requests
     */
    getAuthHeader(): { Authorization?: string } {
        const token = this.getStoredToken();
        return token ? { Authorization: `Bearer ${token}` } : {};
    }

    /**
     * Check if current route requires authentication
     */
    isAuthRequired(url: string): boolean {
        const publicRoutes = ['/login', '/signup', '/forgot-password'];
        return !publicRoutes.some((route) => url.startsWith(route));
    }
}
