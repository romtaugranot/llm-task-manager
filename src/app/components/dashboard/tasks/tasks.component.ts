import { Component, input, output } from '@angular/core';
import { Task } from '../interfaces';
import { TasksCardHeaderComponent } from './header/header.component';
import { TaskListComponent } from './task-list/task-list.component';

@Component({
    selector: 'app-dashboard-tasks',
    standalone: true,
    imports: [TasksCardHeaderComponent, TaskListComponent],
    templateUrl: './tasks.component.html',
    styleUrl: './tasks.component.scss',
})
export class DashboardTasksComponent {
    tasks = input.required<Task[]>();

    filter = input.required<'all' | 'pending' | 'completed' | 'overdue'>();
    sortBy = input.required<'priority' | 'dueDate' | 'category'>();
    searchQuery = input.required<string>();

    toggleTask = output<string>();
    editTask = output<string>();
    deleteTask = output<string>();

    filterChange = output<'all' | 'pending' | 'completed' | 'overdue'>();
    sortChange = output<'priority' | 'dueDate' | 'category'>();
    searchQueryChange = output<string>();

    setFilter(filter: 'all' | 'pending' | 'completed' | 'overdue'): void {
        this.filterChange.emit(filter);
    }

    setSortBy(sortBy: 'priority' | 'dueDate' | 'category'): void {
        this.sortChange.emit(sortBy);
    }

    setSearchChange(query: string): void {
        this.searchQueryChange.emit(query);
    }

    getTaskClasses(task: Task): string {
        const classes = [`priority-${task.priority}`];
        if (task.completed) classes.push('completed');
        return classes.join(' ');
    }

    getEmptyStateTitle(): string {
        const query = this.searchQuery().toLowerCase().trim();
        if (query) {
            return 'No tasks found';
        }

        switch (this.filter()) {
            case 'pending':
                return 'No pending tasks';
            case 'completed':
                return 'No completed tasks';
            case 'overdue':
                return 'No overdue tasks';
            default:
                return 'No tasks yet';
        }
    }

    getEmptyStateMessage(): string {
        const query = this.searchQuery().toLowerCase().trim();
        if (query) {
            return `No tasks match "${query}". Try a different search term.`;
        }

        switch (this.filter()) {
            case 'pending':
                return 'All caught up! Great job.';
            case 'completed':
                return 'Complete some tasks to see them here.';
            case 'overdue':
                return "You're on track with all your deadlines.";
            default:
                return 'Add your first task to get started.';
        }
    }

    isOverdue(task: Task): boolean {
        return !task.completed && task.dueDate ? task.dueDate < new Date() : false;
    }

    formatDueDate(date: Date): string {
        const now = new Date();
        const diffTime = date.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Tomorrow';
        if (diffDays === -1) return 'Yesterday';
        if (diffDays < 0) return `${Math.abs(diffDays)} days ago`;
        if (diffDays <= 7) return `In ${diffDays} days`;

        return date.toLocaleDateString();
    }
}
