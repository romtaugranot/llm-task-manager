import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-navbar-links',
    imports: [],
    templateUrl: './links.component.html',
    styleUrl: './links.component.scss',
})
export class NavbarLinksComponent {
    router = inject(Router);

    navigateTo(route: string): void {
        this.router.navigate([route]);
    }
}
