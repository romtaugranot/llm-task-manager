import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-dashboard-tasks-header-search',
    imports: [FormsModule],
    templateUrl: './search.component.html',
    styleUrl: './search.component.scss',
})
export class SearchComponent {
    searchQuery = input.required<string>();

    searchQueryChange = output<string>();

    setSearchChange(query: string): void {
        this.searchQueryChange.emit(query);
    }
}
