import { Component, input, output, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Task } from '../interfaces';

@Component({
    selector: 'app-dashboard-tasks',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './tasks.component.html',
    styleUrl: './tasks.component.scss',
})
export class DashboardTasksComponent {
    tasks = input.required<Task[]>();
    filter = input.required<'all' | 'pending' | 'completed' | 'overdue'>();
    sortBy = input.required<'priority' | 'dueDate' | 'category'>();

    toggleTask = output<string>();
    editTask = output<string>();
    deleteTask = output<string>();
    filterChange = output<'all' | 'pending' | 'completed' | 'overdue'>();
    sortChange = output<'priority' | 'dueDate' | 'category'>();

    searchQuery = signal<string>('');

    // Filter and search tasks
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

    // Apply search query
    displayedTasks = computed(() => {
        const query = this.searchQuery().toLowerCase().trim();
        if (!query) {
            return this.filteredTasks();
        }

        return this.filteredTasks().filter(
            (task) =>
                task.title.toLowerCase().includes(query) ||
                task.description?.toLowerCase().includes(query) ||
                task.category.toLowerCase().includes(query) ||
                task.priority.toLowerCase().includes(query)
        );
    });

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

    setFilter(filter: 'all' | 'pending' | 'completed' | 'overdue'): void {
        this.filterChange.emit(filter);
    }

    setSortBy(sortBy: 'priority' | 'dueDate' | 'category'): void {
        this.sortChange.emit(sortBy);
    }

    getTaskClasses(task: Task): string {
        const classes = [`priority-${task.priority}`];
        if (task.completed) classes.push('completed');
        return classes.join(' ');
    }

    getFilterTitle(): string {
        switch (this.filter()) {
            case 'pending':
                return 'Pending Tasks';
            case 'completed':
                return 'Completed Tasks';
            case 'overdue':
                return 'Overdue Tasks';
            default:
                return 'All Tasks';
        }
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
