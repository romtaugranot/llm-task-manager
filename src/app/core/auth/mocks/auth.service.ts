// src/app/core/services/mock-auth.service.ts
import { Injectable, signal } from '@angular/core';
import { Observable, of, throwError, delay } from 'rxjs';
import { AuthError, AuthResponse, LoginRequest, SignUpRequest, User } from '../interfaces';

/**
 * Mock authentication service for development and testing
 * Replace this with the real AuthService when backend is ready
 */
@Injectable({
    providedIn: 'root',
})
export class MockAuthService {
    private readonly _isLoading = signal(false);
    private readonly _user = signal<User | null>(null);
    private readonly _isAuthenticated = signal(false);
    private readonly _error = signal<AuthError | null>(null);

    // Public readonly signals
    readonly isLoading = this._isLoading.asReadonly();
    readonly user = this._user.asReadonly();
    readonly isAuthenticated = this._isAuthenticated.asReadonly();
    readonly error = this._error.asReadonly();

    // Mock data store
    private mockUsers: User[] = [
        {
            id: '1',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            createdAt: new Date('2024-01-01'),
            lastLoginAt: new Date(),
        },
    ];

    signIn(loginData: LoginRequest): Observable<AuthResponse> {
        this._isLoading.set(true);
        this._error.set(null);

        return new Observable<AuthResponse>((observer) => {
            setTimeout(() => {
                // Find user by email
                const user = this.mockUsers.find((u) => u.email === loginData.email);

                if (!user) {
                    const error: AuthError = {
                        message: 'No account found with this email address',
                        code: 'USER_NOT_FOUND',
                        field: 'email',
                    };
                    this._error.set(error);
                    this._isLoading.set(false);
                    observer.error(error);
                    return;
                }

                // For demo purposes, accept any password except 'wrongpassword'
                if (loginData.password === 'wrongpassword') {
                    const error: AuthError = {
                        message: 'Incorrect password',
                        code: 'INVALID_PASSWORD',
                        field: 'password',
                    };
                    this._error.set(error);
                    this._isLoading.set(false);
                    observer.error(error);
                    return;
                }

                // Update last login
                user.lastLoginAt = new Date();

                // Create mock response
                const response: AuthResponse = {
                    user,
                    token: `mock_token_${user.id}`,
                    refreshToken: `mock_refresh_token_${user.id}`,
                    expiresIn: 3600,
                };

                this.handleAuthSuccess(response);
                this._isLoading.set(false);
                observer.next(response);
                observer.complete();
            }, 1200); // Simulate network delay
        });
    }

    signOut(): Observable<void> {
        this.clearAuthData();
        return of(void 0);
    }

    refreshToken(): Observable<AuthResponse> {
        const user = this._user();
        if (!user) {
            return throwError(() => ({ message: 'No user found', code: 'NO_USER' }));
        }

        const response: AuthResponse = {
            user,
            token: `mock_token_${user.id}_refreshed`,
            refreshToken: `mock_refresh_token_${user.id}_refreshed`,
            expiresIn: 3600,
        };

        this.handleAuthSuccess(response);
        return of(response);
    }

    checkEmailExists(email: string): Observable<{ exists: boolean }> {
        return new Observable<{ exists: boolean }>((observer) => {
            setTimeout(() => {
                const exists = this.mockUsers.some((u) => u.email === email);
                observer.next({ exists });
                observer.complete();
            }, 500); // Simulate API delay
        });
    }

    requestPasswordReset(email: string): Observable<{ success: boolean }> {
        return new Observable<{ success: boolean }>((observer) => {
            setTimeout(() => {
                const userExists = this.mockUsers.some((u) => u.email === email);
                observer.next({ success: userExists });
                observer.complete();
            }, 1000);
        });
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    resetPassword(token: string, newPassword: string): Observable<{ success: boolean }> {
        return of({ success: true }).pipe(delay(1000));
    }

    updateProfile(updates: Partial<Pick<User, 'firstName' | 'lastName'>>): Observable<User> {
        const currentUser = this._user();
        if (!currentUser) {
            return throwError(() => ({ message: 'No user found', code: 'NO_USER' }));
        }

        const updatedUser = { ...currentUser, ...updates };
        this._user.set(updatedUser);
        localStorage.setItem('mock_user_data', JSON.stringify(updatedUser));

        return of(updatedUser).pipe(delay(500));
    }

    clearError(): void {
        this._error.set(null);
    }

    getAuthHeader(): { Authorization?: string } {
        const user = this._user();
        return user ? { Authorization: `Bearer mock_token_${user.id}` } : {};
    }

    isAuthRequired(url: string): boolean {
        const publicRoutes = ['/login', '/signup', '/forgot-password'];
        return !publicRoutes.some((route) => url.startsWith(route));
    }

    // Private helper methods
    private handleAuthSuccess(response: AuthResponse): void {
        const { user, token, refreshToken } = response;

        // Store tokens and user data
        localStorage.setItem('mock_auth_token', token);
        localStorage.setItem('mock_refresh_token', refreshToken);
        localStorage.setItem('mock_user_data', JSON.stringify(user));

        // Update state
        this._user.set(user);
        this._isAuthenticated.set(true);
        this._error.set(null);
    }

    private clearAuthData(): void {
        localStorage.removeItem('mock_auth_token');
        localStorage.removeItem('mock_refresh_token');
        localStorage.removeItem('mock_user_data');

        this._user.set(null);
        this._isAuthenticated.set(false);
        this._error.set(null);
    }

    constructor() {
        this.initializeAuth();
    }

    private initializeAuth(): void {
        const userData = localStorage.getItem('mock_user_data');
        const token = localStorage.getItem('mock_auth_token');

        if (userData && token) {
            try {
                const user = JSON.parse(userData);
                user.createdAt = new Date(user.createdAt);
                if (user.lastLoginAt) {
                    user.lastLoginAt = new Date(user.lastLoginAt);
                }
                this._user.set(user);
                this._isAuthenticated.set(true);
            } catch {
                this.clearAuthData();
            }
        }
    }

    signUp(signUpData: SignUpRequest): Observable<AuthResponse> {
        this._isLoading.set(true);
        this._error.set(null);

        return new Observable<AuthResponse>((observer) => {
            setTimeout(() => {
                // Check if email already exists
                const existingUser = this.mockUsers.find((u) => u.email === signUpData.email);
                if (existingUser) {
                    const error: AuthError = {
                        message: 'This email is already registered',
                        code: 'EMAIL_EXISTS',
                        field: 'email',
                    };
                    this._error.set(error);
                    this._isLoading.set(false);
                    observer.error(error);
                    return;
                }

                // Create new user
                const newUser: User = {
                    id: Date.now().toString(),
                    firstName: signUpData.firstName,
                    lastName: signUpData.lastName,
                    email: signUpData.email,
                    createdAt: new Date(),
                    lastLoginAt: new Date(),
                };

                // Add to mock database
                this.mockUsers.push(newUser);

                // Create mock response
                const response: AuthResponse = {
                    user: newUser,
                    token: `mock_token_${newUser.id}`,
                    refreshToken: `mock_refresh_token_${newUser.id}`,
                    expiresIn: 3600,
                };

                this.handleAuthSuccess(response);
                this._isLoading.set(false);
                observer.next(response);
                observer.complete();
            }, 1500); // Simulate network delay
        });
    }
}
