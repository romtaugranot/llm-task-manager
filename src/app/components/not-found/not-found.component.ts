import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
    fadeInUp,
    scaleIn,
    bounceIn,
    slideInLeft,
    slideInRight,
    staggerIn,
    scaleInOut,
} from '../../shared/animations';

@Component({
    selector: 'app-not-found',
    standalone: true,
    imports: [],
    templateUrl: './not-found.component.html',
    styleUrl: './not-found.component.scss',
    animations: [fadeInUp, scaleIn, bounceIn, slideInLeft, slideInRight, staggerIn, scaleInOut],
})
export class NotFoundComponent {
    private readonly router = inject(Router);

    goHome(): void {
        this.router.navigate(['/dashboard']);
    }
}
