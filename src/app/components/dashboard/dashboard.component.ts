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

    addTask(newTask: Omit<Task, 'id' | 'createdAt'>): void {
        const task: Task = {
            ...newTask,
            id: Date.now().toString(),
            createdAt: new Date(),
        };
        this.tasks.update((tasks) => [...tasks, task]);
        this.showAddTaskModal.set(false);
    }

    setFilter(filter: 'all' | 'pending' | 'completed' | 'overdue'): void {
        this.filter.set(filter);
    }

    setSortBy(sortBy: 'priority' | 'dueDate' | 'category'): void {
        this.sortBy.set(sortBy);
    }

    openAddTaskModal(): void {
        this.showAddTaskModal.set(true);
    }

    closeAddTaskModal(): void {
        this.showAddTaskModal.set(false);
    }
}
