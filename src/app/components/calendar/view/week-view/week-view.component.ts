import { Component, input, output, computed, ViewChild, ElementRef, AfterViewInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarEvent } from '../../calendar.component';

@Component({
    selector: 'app-calendar-week-view',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './week-view.component.html',
    styleUrl: './week-view.component.scss',
})
export class CalendarWeekViewComponent implements AfterViewInit {
    @ViewChild('weekViewContent') weekViewContent!: ElementRef<HTMLDivElement>;

    currentDate = input.required<Date>();
    events = input.required<CalendarEvent[]>();
    selectedDate = input<Date | null>(null);

    dateSelect = output<Date>();
    eventSelect = output<CalendarEvent>();

    hours = Array.from({ length: 24 }, (_, i) => {
        const hour = i === 0 ? 12 : i > 12 ? i - 12 : i;
        const period = i < 12 ? 'AM' : 'PM';
        return `${hour}:00 ${period}`;
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

    ngAfterViewInit(): void {
        // Auto-scroll to current hour when view initializes
        setTimeout(() => {
            this.scrollToCurrentHour();
        }, 100);

        // Effect to auto-scroll when date changes
        effect(() => {
            this.currentDate(); // Subscribe to changes
            setTimeout(() => {
                this.scrollToCurrentHour();
            }, 150);
        });
    }

    private scrollToCurrentHour(): void {
        if (!this.weekViewContent) return;
        
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinutes = now.getMinutes();
        
        // Calculate scroll position (60px per hour + minutes proportion)
        const scrollPosition = (currentHour * 60) + (currentMinutes * 60 / 60) - 120; // Offset to center current time
        
        this.weekViewContent.nativeElement.scrollTop = Math.max(0, scrollPosition);
    }

    selectDate(date: Date): void {
        this.dateSelect.emit(date);
    }

    selectEvent(event: CalendarEvent): void {
        this.eventSelect.emit(event);
    }

    getEventsForDate(date: Date): CalendarEvent[] {
        return this.events().filter((event) => {
            const eventDate = new Date(event.startDate);
            return eventDate.toDateString() === date.toDateString();
        }).sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
    }

    isToday(date: Date): boolean {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    }

    isSelected(date: Date): boolean {
        const selected = this.selectedDate();
        return selected ? date.toDateString() === selected.toDateString() : false;
    }

    isCurrentHour(hourIndex: number): boolean {
        const currentHour = new Date().getHours();
        return hourIndex === currentHour;
    }

    getDayName(date: Date): string {
        return date.toLocaleDateString('en-US', { weekday: 'short' });
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
        return Math.max(24, duration / (1000 * 60)); // Minimum 24px height for week view
    }

    getEventLeft(event: CalendarEvent, dayEvents: CalendarEvent[]): number {
        // Group overlapping events for this day
        const overlappingEvents = this.getOverlappingEvents(event, dayEvents);
        const eventIndex = overlappingEvents.findIndex(e => e.id === event.id);
        const totalOverlapping = overlappingEvents.length;
        
        const baseLeft = 2;
        const availableWidth = 100; // Percentage of day column
        const eventWidth = availableWidth / totalOverlapping;
        
        return baseLeft + (eventIndex * eventWidth);
    }

    getEventWidth(event: CalendarEvent, dayEvents: CalendarEvent[]): number {
        const overlappingEvents = this.getOverlappingEvents(event, dayEvents);
        const totalOverlapping = overlappingEvents.length;
        
        const availableWidth = 96; // Percentage of day column (leaving some margin)
        return Math.max(20, availableWidth / totalOverlapping); // Minimum width
    }

    getEventZIndex(event: CalendarEvent): number {
        // Higher priority events get higher z-index
        const priorityMap = { urgent: 4, high: 3, medium: 2, low: 1 };
        return 10 + (priorityMap[event.category as keyof typeof priorityMap] || 1);
    }

    getEventTooltip(event: CalendarEvent): string {
        const time = this.formatEventTime(event);
        const description = event.description ? ` - ${event.description}` : '';
        return `${event.title} (${time})${description}`;
    }

    getCurrentTimePosition(): number {
        const now = new Date();
        const hour = now.getHours();
        const minutes = now.getMinutes();
        return hour * 60 + minutes;
    }

    private getOverlappingEvents(targetEvent: CalendarEvent, dayEvents: CalendarEvent[]): CalendarEvent[] {
        return dayEvents.filter(event => 
            this.eventsOverlap(targetEvent, event)
        ).sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
    }

    private eventsOverlap(event1: CalendarEvent, event2: CalendarEvent): boolean {
        return event1.startDate < event2.endDate && event2.startDate < event1.endDate;
    }
}