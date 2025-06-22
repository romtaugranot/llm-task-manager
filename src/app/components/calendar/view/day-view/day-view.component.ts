import { Component, input, output, computed, ViewChild, ElementRef, AfterViewInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarEvent } from '../../calendar.component';

@Component({
    selector: 'app-calendar-day-view',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './day-view.component.html',
    styleUrl: './day-view.component.scss',
})
export class CalendarDayViewComponent implements AfterViewInit {
    @ViewChild('dayViewContent') dayViewContent!: ElementRef<HTMLDivElement>;

    currentDate = input.required<Date>();
    events = input.required<CalendarEvent[]>();

    eventSelect = output<CalendarEvent>();
    taskToggle = output<string>();

    hours = Array.from({ length: 24 }, (_, i) => {
        const hour = i === 0 ? 12 : i > 12 ? i - 12 : i;
        const period = i < 12 ? 'AM' : 'PM';
        return `${hour}:00 ${period}`;
    });

    // Day view data
    dayEvents = computed(() => {
        return this.getEventsForDate(this.currentDate());
    });

    // Group overlapping events
    groupedEvents = computed(() => {
        const events = this.dayEvents();
        const groups: CalendarEvent[][] = [];
        
        events.forEach(event => {
            let placed = false;
            
            for (const group of groups) {
                const hasOverlap = group.some(groupEvent => this.eventsOverlap(event, groupEvent));
                if (!hasOverlap) {
                    group.push(event);
                    placed = true;
                    break;
                }
            }
            
            if (!placed) {
                groups.push([event]);
            }
        });
        
        return groups;
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
        if (!this.dayViewContent) return;
        
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinutes = now.getMinutes();
        
        // Calculate scroll position (60px per hour + minutes proportion)
        const scrollPosition = (currentHour * 60) + (currentMinutes * 60 / 60) - 120; // Offset to center current time
        
        this.dayViewContent.nativeElement.scrollTop = Math.max(0, scrollPosition);
    }

    selectEvent(event: CalendarEvent): void {
        this.eventSelect.emit(event);
    }

    toggleTask(taskId: string): void {
        this.taskToggle.emit(taskId);
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

    isCurrentHour(hourIndex: number): boolean {
        if (!this.isToday(this.currentDate())) return false;
        const currentHour = new Date().getHours();
        return hourIndex === currentHour;
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

    getEventLeft(event: CalendarEvent): number {
        const groups = this.groupedEvents();
        let groupIndex = 0;
        let eventIndex = 0;
        let groupSize = 1;

        // Find which group this event belongs to and its position
        for (let i = 0; i < groups.length; i++) {
            const group = groups[i];
            const index = group.findIndex(e => e.id === event.id);
            if (index !== -1) {
                groupIndex = i;
                eventIndex = index;
                groupSize = group.length;
                break;
            }
        }

        // Calculate left position based on overlapping events
        const baseLeft = 8;
        const availableWidth = 300; // Approximate available width
        const eventWidth = availableWidth / groupSize;
        
        return baseLeft + (eventIndex * eventWidth);
    }

    getEventWidth(event: CalendarEvent): number {
        const groups = this.groupedEvents();
        let groupSize = 1;

        // Find group size for this event
        for (const group of groups) {
            if (group.some(e => e.id === event.id)) {
                groupSize = group.length;
                break;
            }
        }

        const availableWidth = 300; // Approximate available width
        return Math.max(120, availableWidth / groupSize - 4); // Minimum width with gap
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

    getTaskStatus(event: CalendarEvent): string {
        return event.type === 'task' ? 'Toggle task completion' : '';
    }

    getTaskIcon(event: CalendarEvent): string {
        return event.type === 'task' ? '✓' : '';
    }

    private eventsOverlap(event1: CalendarEvent, event2: CalendarEvent): boolean {
        return event1.startDate < event2.endDate && event2.startDate < event1.endDate;
    }
}