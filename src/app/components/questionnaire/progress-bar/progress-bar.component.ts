import { Component, input } from '@angular/core';
import { Question } from '../../../shared';

@Component({
    selector: 'app-progress-bar',
    imports: [],
    templateUrl: './progress-bar.component.html',
    styleUrl: './progress-bar.component.scss',
})
export class ProgressBarComponent {
    currentQuestionIndex = input.required<number>();

    questions = input.required<Question[]>();

    get progress(): number {
        return ((this.currentQuestionIndex() + 1) / this.questions().length) * 100;
    }
}
