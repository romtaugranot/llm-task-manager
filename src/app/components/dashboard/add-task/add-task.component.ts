import { Component, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Task } from '../interfaces';

@Component({
    selector: 'app-dashboard-add-task',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './add-task.component.html',
    styleUrl: './add-task.component.scss',
})
export class DashboardAddTaskComponent {
    newTaskTitle = '';

    taskAdded = output<Task>();

    addQuickTask(): void {
        if (!this.newTaskTitle?.trim()) return;

        const task: Task = {
            id: Date.now().toString(),
            title: this.newTaskTitle.trim(),
            priority: 'medium',
            category: 'personal',
            completed: false,
            createdAt: new Date(),
        };

        this.taskAdded.emit(task);

        this.newTaskTitle = '';
    }
}
