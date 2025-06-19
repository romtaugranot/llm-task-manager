import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CalendarEvent } from '../calendar.component';
import { Task } from '../../dashboard/interfaces';

@Component({
    selector: 'app-calendar-sidebar',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.scss',
})
export class CalendarSidebarComponent {
    selectedDate = input<Date | null>(null);
    selectedDateEvents = input.required<CalendarEvent[]>();
    upcomingEvents = input.required<CalendarEvent[]>();
    tasks = input.required<Task[]>();

    eventAdd = output<Omit<CalendarEvent, 'id'>>();
    taskToggle = output<string>();

    showAddEvent = false;
    newEvent = {
        title: '',
        description: '',
        date: '',
        time: '',
        category: '',
    };

    formatSelectedDate(): string {
        const date = this.selectedDate();
        if (!date) return '';

        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
        });
    }

    formatEventTime(event: CalendarEvent): string {
        if (event.allDay) return 'All day';

        const start = event.startDate.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        });

        return start;
    }

    formatUpcomingDate(date: Date): string {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        if (date.toDateString() === today.toDateString()) {
            return 'Today';
        } else if (date.toDateString() === tomorrow.toDateString()) {
            return 'Tomorrow';
        } else {
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
            });
        }
    }

    toggleTask(taskId: string): void {
        this.taskToggle.emit(taskId);
    }

    isTaskCompleted(taskId: string): boolean {
        const task = this.tasks().find((t) => t.id === taskId);
        return task?.completed || false;
    }

    getTaskPriority(taskId: string): string {
        const task = this.tasks().find((t) => t.id === taskId);
        return task?.priority || 'medium';
    }

    getTotalTasks(): number {
        return this.tasks().length;
    }

    getCompletedTasks(): number {
        return this.tasks().filter((task) => task.completed).length;
    }

    getOverdueTasks(): number {
        const now = new Date();
        return this.tasks().filter((task) => !task.completed && task.dueDate && task.dueDate < now)
            .length;
    }

    getCompletionPercentage(): number {
        const total = this.getTotalTasks();
        if (total === 0) return 0;
        return Math.round((this.getCompletedTasks() / total) * 100);
    }

    addEvent(): void {
        if (!this.isFormValid()) return;

        const date = new Date(this.newEvent.date);
        const [hours, minutes] = this.newEvent.time.split(':').map(Number);

        const startDate = new Date(date);
        startDate.setHours(hours, minutes, 0, 0);

        const endDate = new Date(startDate);
        endDate.setHours(hours + 1, minutes, 0, 0); // Default 1-hour duration

        const event: Omit<CalendarEvent, 'id'> = {
            title: this.newEvent.title,
            description: this.newEvent.description || undefined,
            startDate,
            endDate,
            allDay: false,
            color: this.getCategoryColor(this.newEvent.category),
            category: this.newEvent.category as
                | 'fitness'
                | 'nutrition'
                | 'wellness'
                | 'personal'
                | 'work',
            type: 'event',
        };

        this.eventAdd.emit(event);
        this.resetForm();
    }

    isFormValid(): boolean {
        return !!(
            this.newEvent.title.trim() &&
            this.newEvent.date &&
            this.newEvent.time &&
            this.newEvent.category
        );
    }

    resetForm(): void {
        this.newEvent = {
            title: '',
            description: '',
            date: '',
            time: '',
            category: '',
        };
        this.showAddEvent = false;
    }

    private getCategoryColor(category: string): string {
        const colors = {
            fitness: '#ef4444',
            nutrition: '#22c55e',
            wellness: '#8b5cf6',
            personal: '#06b6d4',
            work: '#f59e0b',
        };
        return colors[category as keyof typeof colors] || '#6b7280';
    }
}
