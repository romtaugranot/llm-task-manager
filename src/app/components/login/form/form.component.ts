// src/app/components/login/form/form.component.ts
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal, effect } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MockAuthService as AuthService, LoginRequest } from '../../../core';

@Component({
    selector: 'app-login-form',
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './form.component.html',
    styleUrl: './form.component.scss',
})
export class LoginFormComponent implements OnInit {
    loginForm!: FormGroup;
    showPassword = signal(false);
    returnUrl = signal<string>('/dashboard');

    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);
    private readonly formBuilder = inject(FormBuilder);
    private readonly authService = inject(AuthService);

    // Reactive state from auth service
    readonly isLoading = this.authService.isLoading;
    readonly authError = this.authService.error;

    // Local validation state
    readonly validationErrors = signal<Record<string, string>>({});

    constructor() {
        // Clear any existing auth errors when component initializes
        this.authService.clearError();

        // Get return URL from query params
        this.returnUrl.set(this.route.snapshot.queryParams['returnUrl'] || '/dashboard');

        // Watch for auth errors and update validation
        effect(() => {
            const error = this.authError();
            if (error?.field) {
                this.validationErrors.update((errors) => ({
                    ...errors,
                    [error.field!]: error.message,
                }));
                
                // Mark the field as touched to show the error immediately
                const field = this.loginForm?.get(error.field!);
                if (field) {
                    field.markAsTouched();
                    field.updateValueAndValidity();
                }
            }
        });
    }

    ngOnInit(): void {
        this.initializeForm();
    }

    private initializeForm(): void {
        this.loginForm = this.formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]],
        });
    }

    isFieldInvalid(fieldName: string): boolean {
        const field = this.loginForm.get(fieldName);
        const hasValidationError = this.validationErrors()[fieldName];
        return !!((field && field.invalid && (field.dirty || field.touched)) || hasValidationError);
    }

    getFieldError(fieldName: string): string {
        const field = this.loginForm.get(fieldName);
        const validationError = this.validationErrors()[fieldName];

        if (validationError) {
            return validationError;
        }

        if (!field?.errors || !field.touched) {
            return '';
        }

        // Handle specific field errors
        switch (fieldName) {
            case 'email':
                if (field.errors['required']) return 'Email is required';
                if (field.errors['email']) return 'Please enter a valid email address';
                break;

            case 'password':
                if (field.errors['required']) return 'Password is required';
                if (field.errors['minlength']) return 'Password must be at least 6 characters';
                break;
        }

        return '';
    }

    togglePassword(): void {
        this.showPassword.update((show) => !show);
    }

    clearFieldError(fieldName: string): void {
        this.validationErrors.update((errors) => {
            const newErrors = { ...errors };
            delete newErrors[fieldName];
            return newErrors;
        });
    }

    onSubmit(): void {
        // Clear any previous errors
        this.authService.clearError();
        this.validationErrors.set({});

        if (this.loginForm.valid) {
            const formData = this.loginForm.value as LoginRequest;

            this.authService.signIn(formData).subscribe({
                next: (response) => {
                    console.log('Login successful:', response);
                    // Navigate to return URL or dashboard
                    this.router.navigate([this.returnUrl()]);
                },
                error: (error) => {
                    console.error('Login failed:', error);
                    // Error handling is done automatically by the auth service
                },
            });
        } else {
            // Mark all fields as touched to show validation errors
            this.markFormGroupTouched(this.loginForm);
        }
    }

    private markFormGroupTouched(formGroup: FormGroup): void {
        Object.keys(formGroup.controls).forEach((key) => {
            const control = formGroup.get(key);
            control?.markAsTouched();

            if (control instanceof FormGroup) {
                this.markFormGroupTouched(control);
            }
        });
    }

    // Helper methods for template
    get canSubmit(): boolean {
        return this.loginForm.valid && !this.isLoading();
    }
}