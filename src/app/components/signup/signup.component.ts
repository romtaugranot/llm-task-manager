import { Component } from '@angular/core';
import { SignUpHeaderComponent } from './header';
import { SignUpFormComponent } from './form';
import { fadeInUp, scaleIn } from '../../shared/animations';

@Component({
    selector: 'app-signup',
    standalone: true,
    imports: [SignUpHeaderComponent, SignUpFormComponent],
    templateUrl: 'signup.component.html',
    styleUrl: 'signup.component.scss',
    animations: [fadeInUp, scaleIn]
})
export class SignUpComponent {}