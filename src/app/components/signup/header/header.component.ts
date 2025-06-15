import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-signup-header',
    imports: [],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss',
})
export class SignUpHeaderComponent {
    router = inject(Router);

    navigateToLogin() {
        this.router.navigate(['/login']);
    }
}
