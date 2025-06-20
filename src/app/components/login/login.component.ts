import { Component } from '@angular/core';
import { LoginHeaderComponent } from './header';
import { LoginFormComponent } from './form';
import { fadeInUp, scaleIn } from '../../shared/animations';

@Component({
    selector: 'app-login',
    imports: [LoginHeaderComponent, LoginFormComponent],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss',
    animations: [fadeInUp, scaleIn]
})
export class LoginComponent {}