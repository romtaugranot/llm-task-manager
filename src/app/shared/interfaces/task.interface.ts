export interface Task {
    id: string;
    title: string;
    description?: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    category: 'fitness' | 'nutrition' | 'wellness' | 'personal' | 'work';
    completed: boolean;
    dueDate?: Date;
    createdAt: Date;
    completedAt?: Date;
}
