// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { authGuard, redirectAuthenticatedGuard } from './core';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard', // Changed to redirect to dashboard by default
    },
    {
        path: 'get-started',
        loadComponent: () =>
            import('./components/questionnaire/questionnaire.component').then(
                (m) => m.QuestionnaireComponent
            ),
        canActivate: [authGuard], // Protect questionnaire route
    },
    {
        path: 'dashboard',
        loadComponent: () =>
            import('./components/dashboard/dashboard.component').then((m) => m.DashboardComponent),
        canActivate: [authGuard], // Protect dashboard route
    },
    {
        path: 'calendar',
        loadComponent: () =>
            import('./components/calendar/calendar.component').then((m) => m.CalendarComponent),
        canActivate: [authGuard], // Protect calendar route
    },
    {
        path: 'login',
        loadComponent: () =>
            import('./components/login/login.component').then((m) => m.LoginComponent),
        canActivate: [redirectAuthenticatedGuard], // Redirect if already logged in
    },
    {
        path: 'signup',
        loadComponent: () =>
            import('./components/signup/signup.component').then((m) => m.SignUpComponent),
        canActivate: [redirectAuthenticatedGuard], // Redirect if already logged in
    },
    {
        path: '404',
        loadComponent: () =>
            import('./components/not-found/not-found.component').then((m) => m.NotFoundComponent),
    },
    {
        path: '**',
        redirectTo: '404', // Redirect unknown routes to 404 page
    },
];