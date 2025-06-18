import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../shared';

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

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, FormsModule, NavbarComponent],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
    tasks = signal<Task[]>([
        {
            id: '1',
            title: 'Complete morning workout',
            description: '30 minutes strength training',
            priority: 'high',
            category: 'fitness',
            completed: false,
            dueDate: new Date(),
            createdAt: new Date(),
        },
        {
            id: '2',
            title: 'Meal prep for the week',
            description: 'Prepare healthy meals for 5 days',
            priority: 'medium',
            category: 'nutrition',
            completed: true,
            dueDate: new Date(Date.now() + 86400000),
            createdAt: new Date(),
            completedAt: new Date(),
        },
        {
            id: '3',
            title: 'Meditation session',
            description: '15 minutes mindfulness practice',
            priority: 'low',
            category: 'wellness',
            completed: false,
            dueDate: new Date(Date.now() + 3600000),
            createdAt: new Date(),
        },
        {
            id: '4',
            title: 'Book dentist appointment',
            priority: 'urgent',
            category: 'personal',
            completed: false,
            dueDate: new Date(Date.now() - 86400000),
            createdAt: new Date(),
        },
    ]);

    filter = signal<'all' | 'pending' | 'completed' | 'overdue'>('all');
    sortBy = signal<'priority' | 'dueDate' | 'category'>('priority');
    showAddTaskModal = signal<boolean>(false);
    
    // Quick task input
    newTaskTitle = '';
    
    // Detailed task form
    newTask = {
        title: '',
        description: '',
        priority: 'medium' as Task['priority'],
        category: 'personal' as Task['category'],
        dueDate: ''
    };

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

    taskStats = computed(() => {
        const tasks = this.tasks();
        const completed = tasks.filter((t) => t.completed).length;
        const pending = tasks.filter((t) => !t.completed).length;
        const overdue = tasks.filter(
            (t) => !t.completed && t.dueDate && t.dueDate < new Date()
        ).length;
        const completionRate = tasks.length > 0 ? (completed / tasks.length) * 100 : 0;

        return { completed, pending, overdue, total: tasks.length, completionRate };
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

    toggleTask(taskId: string): void {
        this.tasks.update((tasks) =>
            tasks.map((task) =>
                task.id === taskId
                    ? {
                          ...task,
                          completed: !task.completed,
                          completedAt: !task.completed ? new Date() : undefined,
                      }
                    : task
            )
        );
    }

    deleteTask(taskId: string): void {
        this.tasks.update((tasks) => tasks.filter((task) => task.id !== taskId));
    }

    addQuickTask(): void {
        if (!this.newTaskTitle?.trim()) return;
        
        const task: Task = {
            id: Date.now().toString(),
            title: this.newTaskTitle.trim(),
            priority: 'medium',
            category: 'personal',
            completed: false,
            createdAt: new Date(),
        };
        
        this.tasks.update((tasks) => [...tasks, task]);
        this.newTaskTitle = '';
    }

    submitDetailedTask(): void {
        if (!this.newTask.title.trim()) return;
        
        const task: Task = {
            id: Date.now().toString(),
            title: this.newTask.title.trim(),
            description: this.newTask.description.trim() || undefined,
            priority: this.newTask.priority,
            category: this.newTask.category,
            completed: false,
            dueDate: this.newTask.dueDate ? new Date(this.newTask.dueDate) : undefined,
            createdAt: new Date(),
        };
        
        this.tasks.update((tasks) => [...tasks, task]);
        this.resetNewTask();
        this.showAddTaskModal.set(false);
    }

    private resetNewTask(): void {
        this.newTask = {
            title: '',
            description: '',
            priority: 'medium',
            category: 'personal',
            dueDate: ''
        };
    }

    editTask(taskId: string): void {
        // TODO: Implement edit functionality
        console.log('Edit task:', taskId);
    }

    setFilter(filter: 'all' | 'pending' | 'completed' | 'overdue'): void {
        this.filter.set(filter);
    }

    setSortBy(event: any): void {
        this.sortBy.set(event.target.value);
    }

    openAddTaskModal(): void {
        this.showAddTaskModal.set(true);
    }

    closeAddTaskModal(): void {
        this.showAddTaskModal.set(false);
        this.resetNewTask();
    }

    markAllCompleted(): void {
        this.tasks.update((tasks) =>
            tasks.map((task) => ({
                ...task,
                completed: true,
                completedAt: task.completed ? task.completedAt : new Date(),
            }))
        );
    }

    clearCompleted(): void {
        this.tasks.update((tasks) => tasks.filter((task) => !task.completed));
    }

    getTaskClasses(task: Task): string {
        const classes = [`priority-${task.priority}`];
        if (task.completed) classes.push('completed');
        return classes.join(' ');
    }

    getFilterTitle(): string {
        switch (this.filter()) {
            case 'pending': return 'Pending Tasks';
            case 'completed': return 'Completed Tasks';
            case 'overdue': return 'Overdue Tasks';
            default: return 'All Tasks';
        }
    }

    getEmptyStateTitle(): string {
        switch (this.filter()) {
            case 'pending': return 'No pending tasks';
            case 'completed': return 'No completed tasks';
            case 'overdue': return 'No overdue tasks';
            default: return 'No tasks yet';
        }
    }

    getEmptyStateMessage(): string {
        switch (this.filter()) {
            case 'pending': return 'All caught up! Great job.';
            case 'completed': return 'Complete some tasks to see them here.';
            case 'overdue': return 'You\'re on track with all your deadlines.';
            default: return 'Add your first task to get started.';
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