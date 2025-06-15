import { Component } from '@angular/core';
import { SignUpHeaderComponent } from './header';
import { SignUpFormComponent } from './form';

@Component({
    selector: 'app-signup',
    standalone: true,
    imports: [SignUpHeaderComponent, SignUpFormComponent],
    templateUrl: 'signup.component.html',
    styleUrl: 'signup.component.scss',
})
export class SignUpComponent {}
