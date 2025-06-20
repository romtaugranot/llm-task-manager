import { Component, computed, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FilterComponent } from './filter/filter.component';
import { SearchComponent } from './search/search.component';
import { SortComponent } from './sort/sort.component';
import { Task } from '../../../../shared';

@Component({
    selector: 'app-dashboard-tasks-header',
    imports: [FormsModule, FilterComponent, SearchComponent, SortComponent],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss',
})
export class TasksCardHeaderComponent {
    tasks = input.required<Task[]>();

    filter = input.required<'all' | 'pending' | 'completed' | 'overdue'>();
    sortBy = input.required<'priority' | 'dueDate' | 'category'>();
    searchQuery = input.required<string>();

    filterChange = output<'all' | 'pending' | 'completed' | 'overdue'>();
    sortChange = output<'priority' | 'dueDate' | 'category'>();
    searchQueryChange = output<string>();

    getFilterTitle(): string {
        switch (this.filter()) {
            case 'pending':
                return 'Pending Tasks';
            case 'completed':
                return 'Completed Tasks';
            case 'overdue':
                return 'Overdue Tasks';
            default:
                return 'All Tasks';
        }
    }

    // Filter and search tasks
    filteredTasks = computed(() => {
        let filtered = this.tasks();

        switch (this.filter()) {
            case 'pending':
                filtered = filtered.filter((task) => !task.completed);
                break;
            case 'completed':
                filtered = filtered.filter((task) => task.completed);
                break;
            case 'overdue':
                filtered = filtered.filter(
                    (task) => !task.completed && task.dueDate && task.dueDate < new Date()
                );
                break;
        }

        return this.sortTasks(filtered);
    });

    displayedTasksLength = computed(() => {
        const query = this.searchQuery().toLowerCase().trim();
        if (!query) {
            return this.filteredTasks().length;
        }

        return this.filteredTasks().filter(
            (task: Task) =>
                task.title.toLowerCase().includes(query) ||
                task.description?.toLowerCase().includes(query) ||
                task.category.toLowerCase().includes(query) ||
                task.priority.toLowerCase().includes(query)
        ).length;
    });

    setFilter(filter: 'all' | 'pending' | 'completed' | 'overdue'): void {
        this.filterChange.emit(filter);
    }

    setSortBy(sortBy: 'priority' | 'dueDate' | 'category'): void {
        this.sortChange.emit(sortBy);
    }

    setSearchChange(query: string): void {
        this.searchQueryChange.emit(query);
    }

    private sortTasks(tasks: Task[]): Task[] {
        return [...tasks].sort((a, b) => {
            switch (this.sortBy()) {
                case 'priority':
                    return this.getPriorityWeight(b.priority) - this.getPriorityWeight(a.priority);
                case 'dueDate':
                    if (!a.dueDate && !b.dueDate) return 0;
                    if (!a.dueDate) return 1;
                    if (!b.dueDate) return -1;
                    return a.dueDate.getTime() - b.dueDate.getTime();
                case 'category':
                    return a.category.localeCompare(b.category);
                default:
                    return 0;
            }
        });
    }

    private getPriorityWeight(priority: Task['priority']): number {
        switch (priority) {
            case 'urgent':
                return 4;
            case 'high':
                return 3;
            case 'medium':
                return 2;
            case 'low':
                return 1;
            default:
                return 0;
        }
    }
}
