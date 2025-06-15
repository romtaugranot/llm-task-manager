import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'signup',
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
