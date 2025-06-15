import { QuestionOption } from './question-option.interface';

export interface Question {
    id: string;
    title: string;
    options: QuestionOption[];
}
