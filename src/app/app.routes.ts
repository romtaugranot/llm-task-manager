import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'signup',
    },
    {
        path: 'get-started',
        loadComponent: () =>
            import('./components/questionnaire/questionnaire.component').then(
                (m) => m.QuestionnaireComponent
            ),
    },
    {
        path: 'dashboard',
        loadComponent: () =>
            import('./components/dashboard/dashboard.component').then((m) => m.DashboardComponent),
    },
    {
        path: 'login',
        loadComponent: () =>
            import('./components/login/login.component').then((m) => m.LoginComponent),
    },
    {
        path: 'signup',
        loadComponent: () =>
            import('./components/signup/signup.component').then((m) => m.SignUpComponent),
    },
    {
        path: '**',
        redirectTo: 'signup',
    },
];
