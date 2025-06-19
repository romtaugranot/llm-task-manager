import { Component, input, output } from '@angular/core';

@Component({
    selector: 'app-dashboard-tasks-header-filter',
    imports: [],
    templateUrl: './filter.component.html',
    styleUrl: './filter.component.scss',
})
export class FilterComponent {
    filter = input.required<'all' | 'pending' | 'completed' | 'overdue'>();

    filterChange = output<'all' | 'pending' | 'completed' | 'overdue'>();

    setFilter(filter: 'all' | 'pending' | 'completed' | 'overdue'): void {
        this.filterChange.emit(filter);
    }
}
