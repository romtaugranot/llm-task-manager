import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { GET_STARTED_QUESTIONS, Question, NavbarComponent } from '../../shared';
import { ProgressBarComponent } from './progress-bar';
import { QuestionContainerComponent } from './question-container';
import { NavigationContainerComponent } from './navigation-container/navigation-container.component';
import { fadeInUp, fadeInLeft, fadeInRight, scaleIn } from '../../shared/animations';

@Component({
    selector: 'app-questionnaire',
    imports: [
        CommonModule,
        NavbarComponent,
        ProgressBarComponent,
        QuestionContainerComponent,
        NavigationContainerComponent,
    ],
    templateUrl: './questionnaire.component.html',
    styleUrl: './questionnaire.component.scss',
    animations: [fadeInUp, fadeInLeft, fadeInRight, scaleIn]
})
export class QuestionnaireComponent {
    currentQuestionIndex = signal<number>(0);
    answers: Record<string, string> = {};

    get questions(): Question[] {
        return GET_STARTED_QUESTIONS;
    }

    onQuestionIndex(index: number): void {
        this.currentQuestionIndex.set(index);
    }
}