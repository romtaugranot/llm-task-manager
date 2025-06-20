import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { slideInAnimation } from './shared/animations';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    imports: [RouterOutlet],
    animations: [slideInAnimation]
})
export class AppComponent {}