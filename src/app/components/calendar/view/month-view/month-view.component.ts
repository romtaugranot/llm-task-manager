import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarEvent } from '../../calendar.component';

interface MonthDay {
    date: Date;
    number: number;
    isCurrentMonth: boolean;
    isToday: boolean;
    isSelected: boolean;
    events: CalendarEvent[];
    visibleEvents: CalendarEvent[];
    hiddenEventsCount: number;
}

@Component({
    selector: 'app-calendar-month-view',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './month-view.component.html',
    styleUrl: './month-view.component.scss',
})
export class CalendarMonthViewComponent {
    currentDate = input.required<Date>();
    events = input.required<CalendarEvent[]>();
    selectedDate = input<Date | null>(null);

    dateSelect = output<Date>();
    eventSelect = output<CalendarEvent>();
    moreEventsSelect = output<{ date: Date; events: CalendarEvent[] }>();

    weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    maxVisibleEvents = 3; // Maximum events to show per day

    // Month view data
    monthWeeksView = computed(() => {
        const date = this.currentDate();
        const year = date.getFullYear();
        const month = date.getMonth();

        const firstDay = new Date(year, month, 1);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());

        const weeks = [];
        const currentWeek: MonthDay[] = [];

        for (let i = 0; i < 42; i++) {
            const cellDate = new Date(startDate);
            cellDate.setDate(startDate.getDate() + i);

            const dayEvents = this.getEventsForDate(cellDate);
            const visibleEvents = dayEvents.slice(0, this.maxVisibleEvents);
            const hiddenEventsCount = Math.max(0, dayEvents.length - this.maxVisibleEvents);

            currentWeek.push({
                date: cellDate,
                number: cellDate.getDate(),
                isCurrentMonth: cellDate.getMonth() === month,
                isToday: this.isToday(cellDate),
                isSelected: this.isSelected(cellDate),
                events: dayEvents,
                visibleEvents,
                hiddenEventsCount,
            });

            if (currentWeek.length === 7) {
                weeks.push([...currentWeek]);
                currentWeek.length = 0;
            }
        }

        return weeks;
    });

    selectDate(date: Date): void {
        this.dateSelect.emit(date);
    }

    selectEvent(event: CalendarEvent): void {
        this.eventSelect.emit(event);
    }

    showMoreEvents(date: Date, events: CalendarEvent[]): void {
        this.moreEventsSelect.emit({ date, events });
    }

    getEventsForDate(date: Date): CalendarEvent[] {
        return this.events().filter((event) => {
            const eventDate = new Date(event.startDate);
            return eventDate.toDateString() === date.toDateString();
        }).sort((a, b) => {
            // Sort by start time, then by priority
            const timeSort = a.startDate.getTime() - b.startDate.getTime();
            if (timeSort !== 0) return timeSort;
            
            const priorityMap = { urgent: 4, high: 3, medium: 2, low: 1 };
            const aPriority = priorityMap[a.category as keyof typeof priorityMap] || 1;
            const bPriority = priorityMap[b.category as keyof typeof priorityMap] || 1;
            return bPriority - aPriority;
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

    getEventTooltip(event: CalendarEvent): string {
        const time = this.formatEventTime(event);
        const description = event.description ? ` - ${event.description}` : '';
        return `${event.title} (${time})${description}`;
    }

    private formatEventTime(event: CalendarEvent): string {
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
}