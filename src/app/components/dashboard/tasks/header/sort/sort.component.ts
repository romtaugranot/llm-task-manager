import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-dashboard-tasks-header-sort',
    imports: [FormsModule],
    templateUrl: './sort.component.html',
    styleUrl: './sort.component.scss',
})
export class SortComponent {
    sortBy = input.required<'priority' | 'dueDate' | 'category'>();

    sortChange = output<'priority' | 'dueDate' | 'category'>();

    setSortBy(sortBy: 'priority' | 'dueDate' | 'category'): void {
        this.sortChange.emit(sortBy);
    }
}
