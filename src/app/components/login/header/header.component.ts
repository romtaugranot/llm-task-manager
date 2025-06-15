import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-login-header',
    imports: [],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss',
})
export class LoginHeaderComponent {
    router = inject(Router);

    navigateToSignup() {
        this.router.navigate(['/signup']);
    }
}
