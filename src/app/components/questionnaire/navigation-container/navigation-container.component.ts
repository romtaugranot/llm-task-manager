import { Component, inject, input, output, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Question } from '../../../shared';

@Component({
    selector: 'app-navigation-container',
    imports: [],
    templateUrl: './navigation-container.component.html',
    styleUrl: './navigation-container.component.scss',
})
export class NavigationContainerComponent {
    router = inject(Router);

    currentQuestionIndex = signal<number>(0);

    answers = input.required<Record<string, string>>();

    questions = input.required<Question[]>();

    questionIndex = output<number>();

    previousQuestion(): void {
        if (this.currentQuestionIndex() > 0) {
            this.currentQuestionIndex.set(this.currentQuestionIndex() - 1);
            this.questionIndex.emit(this.currentQuestionIndex());
        }
    }

    nextQuestion(): void {
        if (this.canProceed) {
            if (this.isLastQuestion) {
                this.completeQuestionnaire();
            } else {
                this.currentQuestionIndex.set(this.currentQuestionIndex() + 1);
            }
            this.questionIndex.emit(this.currentQuestionIndex());
        }
    }

    completeQuestionnaire(): void {
        this.router.navigate(['/dashboard']);
    }

    get isLastQuestion(): boolean {
        return this.currentQuestionIndex() === this.questions().length - 1;
    }

    get canProceed(): boolean {
        return !!this.answers()[this.currentQuestion.id];
    }

    get currentQuestion(): Question {
        return this.questions()[this.currentQuestionIndex()];
    }
}
