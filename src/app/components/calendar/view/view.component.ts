import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarView, CalendarEvent } from '../calendar.component';

@Component({
    selector: 'app-calendar-view',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './view.component.html',
    styleUrl: './view.component.scss',
})
export class CalendarViewComponent {
    currentDate = input.required<Date>();
    selectedView = input.required<CalendarView>();
    events = input.required<CalendarEvent[]>();
    selectedDate = input<Date | null>(null);

    dateSelect = output<Date>();
    eventUpdate = output<{ id: string; updates: Partial<CalendarEvent> }>();
    eventDelete = output<string>();
    taskToggle = output<string>();

    weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    hours = Array.from({ length: 24 }, (_, i) => {
        const hour = i === 0 ? 12 : i > 12 ? i - 12 : i;
        const period = i < 12 ? 'AM' : 'PM';
        return `${hour}:00 ${period}`;
    });

    // Month view data
    monthWeeksView = computed(() => {
        const date = this.currentDate();
        const year = date.getFullYear();
        const month = date.getMonth();

        const firstDay = new Date(year, month, 1);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());

        const weeks = [];
        const currentWeek = [];

        for (let i = 0; i < 42; i++) {
            const cellDate = new Date(startDate);
            cellDate.setDate(startDate.getDate() + i);

            const dayEvents = this.getEventsForDate(cellDate);

            currentWeek.push({
                date: cellDate,
                number: cellDate.getDate(),
                isCurrentMonth: cellDate.getMonth() === month,
                isToday: this.isToday(cellDate),
                isSelected: this.isSelected(cellDate),
                events: dayEvents.slice(0, 3), // Limit to 3 visible events
            });

            if (currentWeek.length === 7) {
                weeks.push([...currentWeek]);
                currentWeek.length = 0;
            }
        }

        return weeks;
    });

    // Week view data
    weekDaysView = computed(() => {
        const current = this.currentDate();
        const startOfWeek = new Date(current);
        startOfWeek.setDate(current.getDate() - current.getDay());

        return Array.from({ length: 7 }, (_, i) => {
            const date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + i);
            return {
                date,
                events: this.getEventsForDate(date),
            };
        });
    });

    // Day view data
    dayEvents = computed(() => {
        return this.getEventsForDate(this.currentDate());
    });

    selectDate(date: Date): void {
        this.dateSelect.emit(date);
    }

    selectEvent(event: CalendarEvent): void {
        console.log('Selected event:', event);
        // TODO: Open event details modal
    }

    toggleTask(taskId: string): void {
        this.taskToggle.emit(taskId);
    }

    getEventsForDate(date: Date): CalendarEvent[] {
        return this.events().filter((event) => {
            const eventDate = new Date(event.startDate);
            return eventDate.toDateString() === date.toDateString();
        });
    }

    isToday(date: Date): boolean {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    }

    isSelected(date: Date): boolean {
        const selected = this.selectedDate();
        return selected ? date.toDateString() === selected.toDateString() : false;
    }

    getDayName(date: Date): string {
        return date.toLocaleDateString('en-US', { weekday: 'short' });
    }

    formatDayHeader(date: Date): string {
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric',
        });
    }

    formatEventTime(event: CalendarEvent): string {
        if (event.allDay) return 'All day';

        const start = event.startDate.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        });
        const end = event.endDate.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        });

        return `${start} - ${end}`;
    }

    getEventTop(event: CalendarEvent): number {
        const hour = event.startDate.getHours();
        const minutes = event.startDate.getMinutes();
        return hour * 60 + minutes;
    }

    getEventHeight(event: CalendarEvent): number {
        const duration = event.endDate.getTime() - event.startDate.getTime();
        return Math.max(30, duration / (1000 * 60)); // Minimum 30px height
    }

    getTaskStatus(event: CalendarEvent): string {
        return event.type === 'task' ? 'Toggle task completion' : '';
    }

    getTaskIcon(event: CalendarEvent): string {
        return event.type === 'task' ? '✓' : '';
    }
}
