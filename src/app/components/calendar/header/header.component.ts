import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarView } from '../calendar.component';

@Component({
    selector: 'app-calendar-header',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss',
})
export class CalendarHeaderComponent {
    currentDate = input.required<Date>();
    selectedView = input.required<CalendarView>();
    currentPeriod = input.required<string>();

    viewChange = output<CalendarView>();
    dateChange = output<Date>();

    setView(view: CalendarView): void {
        this.viewChange.emit(view);
    }

    navigatePrevious(): void {
        const current = this.currentDate();
        const view = this.selectedView();
        const newDate = new Date(current);

        switch (view) {
            case 'day':
                newDate.setDate(current.getDate() - 1);
                break;
            case 'week':
                newDate.setDate(current.getDate() - 7);
                break;
            case 'month':
                newDate.setMonth(current.getMonth() - 1);
                break;
        }

        this.dateChange.emit(newDate);
    }

    navigateNext(): void {
        const current = this.currentDate();
        const view = this.selectedView();
        const newDate = new Date(current);

        switch (view) {
            case 'day':
                newDate.setDate(current.getDate() + 1);
                break;
            case 'week':
                newDate.setDate(current.getDate() + 7);
                break;
            case 'month':
                newDate.setMonth(current.getMonth() + 1);
                break;
        }

        this.dateChange.emit(newDate);
    }

    goToToday(): void {
        this.dateChange.emit(new Date());
    }

    openAddEvent(): void {
        // TODO: Implement add event modal
        console.log('Open add event modal');
    }
}
