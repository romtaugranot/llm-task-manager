import { Component, input } from '@angular/core';
import { Question } from '../../../shared';
import { fadeInUp, staggerIn } from '../../../shared/animations';

@Component({
    selector: 'app-question-container',
    imports: [],
    templateUrl: './question-container.component.html',
    styleUrl: './question-container.component.scss',
    animations: [fadeInUp, staggerIn]
})
export class QuestionContainerComponent {
    answers = input.required<Record<string, string>>();

    currentQuestionIndex = input.required<number>();

    questions = input.required<Question[]>();

    selectOption(optionId: string): void {
        this.answers()[this.currentQuestion.id] = optionId;
    }

    isSelected(optionId: string): boolean {
        return this.answers()[this.currentQuestion.id] === optionId;
    }

    get currentQuestion(): Question {
        return this.questions()[this.currentQuestionIndex()];
    }
}