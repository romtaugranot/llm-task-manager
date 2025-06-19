import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../shared';
import { TaskStats } from './interfaces';
import { DashboardStatsComponent } from './stats/stats.component';
import { DashboardTasksComponent } from './tasks/tasks.component';
import { DashboardAddTaskComponent } from './add-task/add-task.component';

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
    imports: [
        CommonModule,
        FormsModule,
        NavbarComponent,
        DashboardStatsComponent,
        DashboardTasksComponent,
        DashboardAddTaskComponent,
    ],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
    //TODO: replace with a service for real data
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
        {
            id: '5',
            title: 'Review quarterly reports',
            description: 'Analyze Q1 performance metrics',
            priority: 'high',
            category: 'work',
            completed: false,
            dueDate: new Date(Date.now() + 172800000),
            createdAt: new Date(),
        },
        {
            id: '6',
            title: 'Plan weekend hiking trip',
            description: 'Research trails and pack gear',
            priority: 'low',
            category: 'personal',
            completed: false,
            dueDate: new Date(Date.now() + 432000000),
            createdAt: new Date(),
        },
    ]);

    filter = signal<'all' | 'pending' | 'completed' | 'overdue'>('all');
    sortBy = signal<'priority' | 'dueDate' | 'category'>('priority');
    searchQuery = signal<string>('');

    taskStats = computed((): TaskStats => {
        const tasks = this.tasks();
        const completed = tasks.filter((t) => t.completed).length;
        const pending = tasks.filter((t) => !t.completed).length;
        const overdue = tasks.filter(
            (t) => !t.completed && t.dueDate && t.dueDate < new Date()
        ).length;
        const completionRate = tasks.length > 0 ? (completed / tasks.length) * 100 : 0;

        return { completed, pending, overdue, total: tasks.length, completionRate };
    });

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

    addTask(task: Task): void {
        this.tasks.update((tasks) => [...tasks, task]);
    }

    editTask(taskId: string): void {
        // TODO: Implement edit functionality
        console.log('Edit task:', taskId);
    }

    setFilter(filter: 'all' | 'pending' | 'completed' | 'overdue'): void {
        this.filter.set(filter);
    }

    setSortBy(sortBy: 'priority' | 'dueDate' | 'category'): void {
        this.sortBy.set(sortBy);
    }

    setSearchChange(query: string): void {
        this.searchQuery.set(query);
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
}
