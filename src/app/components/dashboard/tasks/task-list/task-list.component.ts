import { Component, computed, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../../../shared';
import { fadeInUp, staggerIn, scaleInOut } from '../../../../shared/animations';

@Component({
    selector: 'app-dashboard-task-list',
    imports: [CommonModule],
    templateUrl: './task-list.component.html',
    styleUrl: './task-list.component.scss',
    animations: [fadeInUp, staggerIn, scaleInOut]
})
export class TaskListComponent {
    tasks = input.required<Task[]>();

    filter = input.required<'all' | 'pending' | 'completed' | 'overdue'>();
    sortBy = input.required<'priority' | 'dueDate' | 'category'>();
    searchQuery = input.required<string>();

    toggleTask = output<string>();
    editTask = output<string>();
    deleteTask = output<string>();

    displayedTasksLength = computed(() => {
        const query = this.searchQuery().toLowerCase().trim();
        if (!query) {
            return this.filteredTasks();
        }

        return this.filteredTasks().filter(
            (task: Task) =>
                task.title.toLowerCase().includes(query) ||
                task.description?.toLowerCase().includes(query) ||
                task.category.toLowerCase().includes(query) ||
                task.priority.toLowerCase().includes(query)
        ).length;
    });

    filteredTasks = computed(() => {
        let filtered = this.tasks();

        switch (this.filter()) {
            case 'pending':
                filtered = filtered.filter((task) => !task.completed);
                break;
            case 'completed':
                filtered = filtered.filter((task) => task.completed);
                break;
            case 'overdue':
                filtered = filtered.filter(
                    (task) => !task.completed && task.dueDate && task.dueDate < new Date()
                );
                break;
        }

        return this.sortTasks(filtered);
    });

    displayedTasks = computed(() => {
        const query = this.searchQuery().toLowerCase().trim();
        if (!query) {
            return this.filteredTasks();
        }

        return this.filteredTasks().filter(
            (task: Task) =>
                task.title.toLowerCase().includes(query) ||
                task.description?.toLowerCase().includes(query) ||
                task.category.toLowerCase().includes(query) ||
                task.priority.toLowerCase().includes(query)
        );
    });

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

    onToggleTask(taskId: string): void {
        this.toggleTask.emit(taskId);
    }

    onEditTask(taskId: string): void {
        this.editTask.emit(taskId);
    }

    onDeleteTask(taskId: string): void {
        this.deleteTask.emit(taskId);
    }

    private sortTasks(tasks: Task[]): Task[] {
        return [...tasks].sort((a, b) => {
            switch (this.sortBy()) {
                case 'priority':
                    return this.getPriorityWeight(b.priority) - this.getPriorityWeight(a.priority);
                case 'dueDate':
                    if (!a.dueDate && !b.dueDate) return 0;
                    if (!a.dueDate) return 1;
                    if (!b.dueDate) return -1;
                    return a.dueDate.getTime() - b.dueDate.getTime();
                case 'category':
                    return a.category.localeCompare(b.category);
                default:
                    return 0;
            }
        });
    }

    private getPriorityWeight(priority: Task['priority']): number {
        switch (priority) {
            case 'urgent':
                return 4;
            case 'high':
                return 3;
            case 'medium':
                return 2;
            case 'low':
                return 1;
            default:
                return 0;
        }
    }
}