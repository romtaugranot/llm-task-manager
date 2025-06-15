import { Component } from '@angular/core';
import { LoginHeaderComponent } from './header';
import { LoginFormComponent } from './form';

@Component({
    selector: 'app-login',
    imports: [LoginHeaderComponent, LoginFormComponent],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss',
})
export class LoginComponent {}
