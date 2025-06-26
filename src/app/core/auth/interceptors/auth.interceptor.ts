import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

/**
 * HTTP Interceptor to automatically add auth headers and handle token refresh
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);

    // Skip auth header for auth-related requests
    if (req.url.includes('/auth/')) {
        return next(req);
    }

    // Add auth header if user is authenticated
    const authHeaders = authService.getAuthHeader();
    const authReq =
        Object.keys(authHeaders).length > 0 ? req.clone({ setHeaders: authHeaders }) : req;

    return next(authReq).pipe(
        catchError((error: HttpErrorResponse) => {
            // Handle 401 Unauthorized errors
            if (error.status === 401 && authService.isAuthenticated()) {
                // Try to refresh the token
                return authService.refreshToken().pipe(
                    switchMap(() => {
                        // Retry the original request with new token
                        const newAuthHeaders = authService.getAuthHeader();
                        const newAuthReq =
                            Object.keys(newAuthHeaders).length > 0
                                ? req.clone({ setHeaders: newAuthHeaders })
                                : req;
                        return next(newAuthReq);
                    }),
                    catchError((refreshError) => {
                        // If refresh fails, redirect to login
                        authService.signOut();
                        return throwError(() => refreshError);
                    })
                );
            }

            return throwError(() => error);
        })
    );
};
