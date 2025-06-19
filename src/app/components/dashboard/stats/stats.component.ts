import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-dashboard-stats',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './stats.component.html',
    styleUrl: './stats.component.scss',
})
export class DashboardStatsComponent {
    taskStats = input.required<{
        completed: number;
        pending: number;
        overdue: number;
        total: number;
        completionRate: number;
    }>();

    markAllCompleted = output<void>();
    clearCompleted = output<void>();
}
