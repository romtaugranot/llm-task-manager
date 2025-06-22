import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarView, CalendarEvent } from '../calendar.component';
import { CalendarMonthViewComponent } from './month-view/month-view.component';
import { CalendarWeekViewComponent } from './week-view/week-view.component';
import { CalendarDayViewComponent } from './day-view/day-view.component';

@Component({
    selector: 'app-calendar-view',
    standalone: true,
    imports: [
        CommonModule,
        CalendarMonthViewComponent,
        CalendarWeekViewComponent,
        CalendarDayViewComponent,
    ],
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

    selectDate(date: Date): void {
        this.dateSelect.emit(date);
    }

    selectEvent(event: CalendarEvent): void {
        console.log('Selected event:', event);
        // TODO: Open event details modal or handle event selection
    }

    showMoreEvents(data: { date: Date; events: CalendarEvent[] }): void {
        console.log('Show more events for:', data.date, data.events);
        // TODO: Open modal or expand view to show all events for the day
    }

    toggleTask(taskId: string): void {
        this.taskToggle.emit(taskId);
    }
}