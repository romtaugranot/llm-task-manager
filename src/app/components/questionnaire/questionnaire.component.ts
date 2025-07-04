import { CommonModule } from '@angular/common';
import { Component, signal, inject, OnInit } from '@angular/core';
import { GET_STARTED_QUESTIONS, Question, NavbarComponent } from '../../shared';
import { ProgressBarComponent } from './progress-bar';
import { QuestionContainerComponent } from './question-container';
import { NavigationContainerComponent } from './navigation-container/navigation-container.component';
import { fadeInUp, fadeInLeft, fadeInRight, scaleIn } from '../../shared/animations';
import { QuestionnaireService } from '../../shared';

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
    animations: [fadeInUp, fadeInLeft, fadeInRight, scaleIn],
})
export class QuestionnaireComponent implements OnInit {
    private readonly questionnaireService = inject(QuestionnaireService);

    currentQuestionIndex = signal<number>(0);
    answers: Record<string, string> = {};

    get questions(): Question[] {
        return GET_STARTED_QUESTIONS;
    }

    ngOnInit(): void {
        this.loadExistingData();
    }

    onQuestionIndex(index: number): void {
        this.currentQuestionIndex.set(index);
        // Save progress whenever user navigates
        this.saveProgress();
    }

    private loadExistingData(): void {
        // Check if user has partial answers saved
        const partialData = this.questionnaireService.loadPartialData();
        if (partialData) {
            this.answers = partialData.answers;
            if (partialData.currentQuestion !== undefined) {
                this.currentQuestionIndex.set(partialData.currentQuestion);
            }
            console.log('Loaded partial questionnaire data');
        }
    }

    private saveProgress(): void {
        // Only save if user has answered at least one question
        if (Object.keys(this.answers).length > 0) {
            this.questionnaireService.savePartialData(this.answers, this.currentQuestionIndex());
        }
    }
}
