import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent, Task } from '../../shared';
import { CalendarHeaderComponent } from './header/header.component';
import { CalendarViewComponent } from './view/view.component';
import { DashboardAddTaskComponent } from '../dashboard/add-task/add-task.component';
import { fadeInUp, fadeInLeft, fadeInRight, slideDown } from '../../shared/animations';

export type CalendarView = 'month' | 'week' | 'day';

export interface CalendarEvent {
    id: string;
    title: string;
    description?: string;
    startDate: Date;
    endDate: Date;
    allDay: boolean;
    color: string;
    category: 'fitness' | 'nutrition' | 'wellness' | 'personal' | 'work';
    type: 'task' | 'event';
    taskId?: string; // Reference to original task if this is a task-based event
}

@Component({
    selector: 'app-calendar',
    standalone: true,
    imports: [
        CommonModule,
        NavbarComponent,
        CalendarHeaderComponent,
        CalendarViewComponent,
        DashboardAddTaskComponent,
    ],
    templateUrl: './calendar.component.html',
    styleUrl: './calendar.component.scss',
    animations: [fadeInUp, fadeInLeft, fadeInRight, slideDown],
})
export class CalendarComponent {
    currentDate = signal<Date>(new Date());
    selectedView = signal<CalendarView>('month');
    selectedDate = signal<Date | null>(null);

    // Mock tasks data - in real app this would come from a service
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
            title: 'Team standup meeting',
            description: 'Daily team sync',
            priority: 'medium',
            category: 'work',
            completed: false,
            dueDate: new Date(Date.now() + 7200000), // 2 hours from now
            createdAt: new Date(),
        },
        // Add some overlapping events for testing
        {
            id: '7',
            title: 'Client call',
            description: 'Discuss project requirements',
            priority: 'high',
            category: 'work',
            completed: false,
            dueDate: new Date(Date.now() + 7200000), // Same time as standup
            createdAt: new Date(),
        },
        {
            id: '8',
            title: 'Lunch break',
            description: 'Team lunch',
            priority: 'low',
            category: 'personal',
            completed: false,
            dueDate: new Date(Date.now() + 14400000), // 4 hours from now
            createdAt: new Date(),
        },
    ]);

    // Convert tasks to calendar events
    calendarEvents = computed((): CalendarEvent[] => {
        const events: CalendarEvent[] = [];

        // Convert tasks with due dates to calendar events
        this.tasks().forEach((task) => {
            if (task.dueDate) {
                const event: CalendarEvent = {
                    id: `task-${task.id}`,
                    title: task.title,
                    description: task.description,
                    startDate: task.dueDate,
                    endDate: new Date(task.dueDate.getTime() + 60 * 60 * 1000), // 1 hour duration
                    allDay: false,
                    color: this.getCategoryColor(task.category),
                    category: task.category,
                    type: 'task',
                    taskId: task.id,
                };
                events.push(event);
            }
        });

        // Add some example events with overlaps
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        events.push({
            id: 'event-1',
            title: 'Doctor Appointment',
            description: 'Annual check-up',
            startDate: new Date(today.getTime() + 9 * 60 * 60 * 1000), // 9 AM today
            endDate: new Date(today.getTime() + 10 * 60 * 60 * 1000), // 10 AM today
            allDay: false,
            color: '#4fc3f7',
            category: 'personal',
            type: 'event',
        });

        events.push({
            id: 'event-2',
            title: 'Yoga Class',
            description: 'Hatha yoga session',
            startDate: new Date(tomorrow.getTime() + 18 * 60 * 60 * 1000), // 6 PM tomorrow
            endDate: new Date(tomorrow.getTime() + 19.5 * 60 * 60 * 1000), // 7:30 PM tomorrow
            allDay: false,
            color: '#ba68c8',
            category: 'wellness',
            type: 'event',
        });

        // Add overlapping events for testing
        events.push({
            id: 'event-3',
            title: 'Coffee Meeting',
            description: 'Catch up with colleague',
            startDate: new Date(today.getTime() + 9.5 * 60 * 60 * 1000), // 9:30 AM today (overlaps with doctor)
            endDate: new Date(today.getTime() + 10.5 * 60 * 60 * 1000), // 10:30 AM today
            allDay: false,
            color: '#ffb74d',
            category: 'work',
            type: 'event',
        });

        return events.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
    });

    // Navigation methods
    navigateToDate(date: Date): void {
        this.currentDate.set(date);
    }

    setView(view: CalendarView): void {
        this.selectedView.set(view);
        
        // Auto-scroll to current hour when switching to day or week view
        if (view === 'day' || view === 'week') {
            // Small delay to ensure the view has rendered
            setTimeout(() => {
                // The scroll logic is now handled in the individual view components
            }, 100);
        }
    }

    selectDate(date: Date): void {
        this.selectedDate.set(date);
        // When clicking on a date in month or week view, switch to day view
        if (this.selectedView() === 'month' || this.selectedView() === 'week') {
            this.currentDate.set(date);
            this.selectedView.set('day');
        }
    }

    // Event management
    addEvent(event: Omit<CalendarEvent, 'id'>): void {
        const newEvent: CalendarEvent = {
            ...event,
            id: `event-${Date.now()}`,
        };
        // In real app, this would be handled by a service
        console.log('Adding event:', newEvent);
    }

    updateEvent(eventId: string, updates: Partial<CalendarEvent>): void {
        // In real app, this would be handled by a service
        console.log('Updating event:', eventId, updates);
    }

    deleteEvent(eventId: string): void {
        // In real app, this would be handled by a service
        console.log('Deleting event:', eventId);
    }

    // Task management
    addTask(task: Task): void {
        this.tasks.update((tasks) => [...tasks, task]);
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

    // Utility methods
    private getCategoryColor(category: string): string {
        const colors = {
            fitness: '#e57373',
            nutrition: '#81c784',
            wellness: '#ba68c8',
            personal: '#4fc3f7',
            work: '#ffb74d',
        };
        return colors[category as keyof typeof colors] || '#90a4ae';
    }

    // Get current month/week/day based on view
    getCurrentPeriod(): string {
        const date = this.currentDate();
        const view = this.selectedView();

        const startOfWeek = new Date(date);
        startOfWeek.setDate(date.getDate() - date.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        
        switch (view) {
            case 'month':
                return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
            case 'week':
                return `${startOfWeek.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                })} - ${endOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
            case 'day':
                return date.toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                });
            default:
                return '';
        }
    }
}