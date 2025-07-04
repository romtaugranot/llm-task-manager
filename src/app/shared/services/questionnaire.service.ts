import { Injectable, signal } from '@angular/core';

export interface QuestionnaireData {
    answers: Record<string, string>;
    currentQuestion?: number;
    completed: boolean;
    timestamp: string;
}

@Injectable({
    providedIn: 'root',
})
export class QuestionnaireService {
    private readonly PARTIAL_KEY = 'questionnaire_partial';
    private readonly COMPLETED_KEY = 'questionnaire_completed';

    private readonly _hasPartialData = signal(false);

    readonly hasPartialData = this._hasPartialData.asReadonly();

    constructor() {
        this.checkForPartialData();
    }

    savePartialData(answers: Record<string, string>, currentQuestion: number): void {
        const data: QuestionnaireData = {
            answers,
            currentQuestion,
            completed: false,
            timestamp: new Date().toISOString(),
        };

        localStorage.setItem(this.PARTIAL_KEY, JSON.stringify(data));
        this._hasPartialData.set(true);
    }

    saveCompletedData(answers: Record<string, string>): void {
        const data: QuestionnaireData = {
            answers,
            completed: true,
            timestamp: new Date().toISOString(),
        };

        localStorage.setItem(this.COMPLETED_KEY, JSON.stringify(data));
        localStorage.removeItem(this.PARTIAL_KEY);
        this._hasPartialData.set(false);
    }

    loadPartialData(): QuestionnaireData | null {
        try {
            const data = localStorage.getItem(this.PARTIAL_KEY);
            if (data) {
                return JSON.parse(data);
            }
        } catch (error) {
            console.error('Error loading partial questionnaire data:', error);
            this.clearPartialData();
        }
        return null;
    }

    loadCompletedData(): QuestionnaireData | null {
        try {
            const data = localStorage.getItem(this.COMPLETED_KEY);
            if (data) {
                return JSON.parse(data);
            }
        } catch (error) {
            console.error('Error loading completed questionnaire data:', error);
        }
        return null;
    }

    clearPartialData(): void {
        localStorage.removeItem(this.PARTIAL_KEY);
        this._hasPartialData.set(false);
    }

    clearAllData(): void {
        localStorage.removeItem(this.PARTIAL_KEY);
        localStorage.removeItem(this.COMPLETED_KEY);
        this._hasPartialData.set(false);
    }

    isCompleted(): boolean {
        return !!this.loadCompletedData();
    }

    private checkForPartialData(): void {
        const hasPartial = !!localStorage.getItem(this.PARTIAL_KEY);
        this._hasPartialData.set(hasPartial);
    }
}
