import { Component, output, signal } from '@angular/core';
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
    showDetailedModal = signal<boolean>(false);

    detailedTask = {
        title: '',
        description: '',
        priority: 'medium' as Task['priority'],
        category: 'personal' as Task['category'],
        dueDate: '',
    };

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

    openDetailedModal(): void {
        this.showDetailedModal.set(true);
    }

    closeDetailedModal(): void {
        this.showDetailedModal.set(false);
        this.resetDetailedTask();
    }

    submitDetailedTask(): void {
        if (!this.detailedTask.title.trim()) return;

        const task: Task = {
            id: Date.now().toString(),
            title: this.detailedTask.title.trim(),
            description: this.detailedTask.description.trim() || undefined,
            priority: this.detailedTask.priority,
            category: this.detailedTask.category,
            completed: false,
            dueDate: this.detailedTask.dueDate ? new Date(this.detailedTask.dueDate) : undefined,
            createdAt: new Date(),
        };

        this.taskAdded.emit(task);
        this.closeDetailedModal();
    }

    private resetDetailedTask(): void {
        this.detailedTask = {
            title: '',
            description: '',
            priority: 'medium',
            category: 'personal',
            dueDate: '',
        };
    }
}
