import { Component } from '@angular/core';
import { SignUpComponent } from './components/signup/signup.component';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    imports: [SignUpComponent],
})
export class AppComponent {}
