import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { GET_STARTED_QUESTIONS, Question } from '../../shared';

@Component({
    selector: 'app-questionnaire',
    imports: [CommonModule],
    templateUrl: './questionnaire.component.html',
    styleUrl: './questionnaire.component.scss',
})
export class QuestionnaireComponent {
    currentQuestionIndex = 0;
    answers: Record<string, string> = {};

    router = inject(Router);

    selectOption(optionId: string): void {
        this.answers[this.currentQuestion.id] = optionId;
    }

    isSelected(optionId: string): boolean {
        return this.answers[this.currentQuestion.id] === optionId;
    }

    nextQuestion(): void {
        if (this.canProceed) {
            if (this.isLastQuestion) {
                this.completeQuestionnaire();
            } else {
                this.currentQuestionIndex++;
            }
        }
    }

    previousQuestion(): void {
        if (this.currentQuestionIndex > 0) {
            this.currentQuestionIndex--;
        }
    }

    completeQuestionnaire(): void {
        this.router.navigate(['/dashboard']);
    }

    get currentQuestion(): Question {
        return this.questions[this.currentQuestionIndex];
    }

    get progress(): number {
        return ((this.currentQuestionIndex + 1) / this.questions.length) * 100;
    }

    get isLastQuestion(): boolean {
        return this.currentQuestionIndex === this.questions.length - 1;
    }

    get canProceed(): boolean {
        return !!this.answers[this.currentQuestion.id];
    }

    get questions(): Question[] {
        return GET_STARTED_QUESTIONS;
    }
}
