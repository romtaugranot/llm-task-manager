import { CommonModule } from '@angular/common';
import { Component, inject, signal, effect, computed } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
    AbstractControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { MockAuthService as AuthService, SignUpRequest } from '../../../core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-signup-form',
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './form.component.html',
    styleUrl: './form.component.scss',
})
export class SignUpFormComponent {
    signUpForm!: FormGroup;
    showPassword = signal(false);

    private readonly router = inject(Router);
    private readonly formBuilder = inject(FormBuilder);
    private readonly authService = inject(AuthService);

    // Reactive state from auth service
    readonly isLoading = this.authService.isLoading;
    readonly authError = this.authService.error;

    // Local validation state
    readonly emailChecking = signal(false);
    readonly emailExists = signal(false);
    readonly validationErrors = signal<Record<string, string>>({});

    // Signal to track password value changes
    private readonly passwordValue = signal('');

    // Password strength computed property
    readonly passwordStrength = computed(() => {
        const password = this.passwordValue();
        return this.calculatePasswordStrength(password);
    });

    // Password strength label computed property
    readonly passwordStrengthLabel = computed(() => {
        const strength = this.passwordStrength();
        switch (strength) {
            case 0:
                return '';
            case 1:
                return 'Weak';
            case 2:
                return 'Fair';
            case 3:
                return 'Strong';
            default:
                return '';
        }
    });

    constructor() {
        // Clear any existing auth errors when component initializes
        this.authService.clearError();

        // Watch for auth errors and update validation
        effect(() => {
            const error = this.authError();
            if (error?.field) {
                this.validationErrors.update((errors) => ({
                    ...errors,
                    [error.field!]: error.message,
                }));
                
                // Mark the field as touched to show the error immediately
                const field = this.signUpForm?.get(error.field!);
                if (field) {
                    field.markAsTouched();
                    field.updateValueAndValidity();
                }
            }
        });

        // Initialize form in constructor so we can set up email validation
        this.initializeForm();
        this.setupEmailValidation();
    }

    private initializeForm(): void {
        this.signUpForm = this.formBuilder.group({
            firstName: [
                '',
                [
                    Validators.required,
                    Validators.minLength(2),
                    Validators.maxLength(50),
                    this.nameValidator,
                ],
            ],
            lastName: [
                '',
                [
                    Validators.required,
                    Validators.minLength(2),
                    Validators.maxLength(50),
                    this.nameValidator,
                ],
            ],
            email: ['', [Validators.required, Validators.email, Validators.maxLength(255)]],
            password: [
                '',
                [Validators.required, Validators.minLength(8), this.passwordStrengthValidator],
            ],
        });
    }

    private setupEmailValidation(): void {
        const emailControl = this.signUpForm.get('email')!;
        const passwordControl = this.signUpForm.get('password')!;

        // Setup email validation
        emailControl.valueChanges
            .pipe(
                debounceTime(500),
                distinctUntilChanged(),
                switchMap((email) => {
                    if (!email || !emailControl.valid) {
                        this.emailExists.set(false);
                        return of(null);
                    }

                    this.emailChecking.set(true);
                    return this.authService.checkEmailExists(email);
                }),
                takeUntilDestroyed()
            )
            .subscribe({
                next: (result) => {
                    this.emailChecking.set(false);
                    if (result) {
                        this.emailExists.set(result.exists);
                        if (result.exists) {
                            emailControl.setErrors({ emailExists: true });
                            emailControl.markAsTouched();
                        }
                    }
                },
                error: () => {
                    this.emailChecking.set(false);
                    this.emailExists.set(false);
                },
            });

        // Setup password strength tracking
        passwordControl.valueChanges.pipe(takeUntilDestroyed()).subscribe((password) => {
            this.passwordValue.set(password || '');
        });
    }

    // Enhanced password strength calculation
    private calculatePasswordStrength(password: string): number {
        if (!password || password.length < 8) return 0;

        let score = 0;

        // Check for different character types
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        // Length bonus
        if (password.length >= 8) score += 1;

        // Character variety scoring
        const varietyCount = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar].filter(
            Boolean
        ).length;

        if (varietyCount >= 2) score += 1;
        if (varietyCount >= 3) score += 1;

        // Cap at 3 for our 3-bar system
        return Math.min(score, 3);
    }

    // Custom validators
    private nameValidator(control: AbstractControl): Record<string, boolean> | null {
        const value = control.value?.trim();
        if (!value) return null;

        const nameRegex = /^[a-zA-Z\s'-]+$/;
        if (!nameRegex.test(value)) {
            return { invalidName: true };
        }

        return null;
    }

    private passwordStrengthValidator(control: AbstractControl): Record<string, boolean> | null {
        const value = control.value;
        if (!value) return null;

        if (value.length < 8) {
            return { minLength: true };
        }

        const hasUpperCase = /[A-Z]/.test(value);
        const hasLowerCase = /[a-z]/.test(value);
        const hasNumbers = /\d/.test(value);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);

        const validConditions = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar].filter(
            Boolean
        ).length;

        if (validConditions < 2) {
            return { weakPassword: true };
        }

        return null;
    }

    isFieldInvalid(fieldName: string): boolean {
        const field = this.signUpForm.get(fieldName);
        const hasValidationError = this.validationErrors()[fieldName];
        return !!((field && field.invalid && (field.dirty || field.touched)) || hasValidationError);
    }

    getFieldError(fieldName: string): string {
        const field = this.signUpForm.get(fieldName);
        const validationError = this.validationErrors()[fieldName];

        if (validationError) {
            return validationError;
        }

        if (!field?.errors || !field.touched) {
            return '';
        }

        // Handle specific field errors
        switch (fieldName) {
            case 'firstName':
            case 'lastName':
                if (field.errors['required'])
                    return `${fieldName === 'firstName' ? 'First' : 'Last'} name is required`;
                if (field.errors['minlength']) return `Must be at least 2 characters`;
                if (field.errors['maxlength']) return `Must be less than 50 characters`;
                if (field.errors['invalidName'])
                    return `Only letters, spaces, hyphens and apostrophes allowed`;
                break;

            case 'email':
                if (field.errors['required']) return 'Email is required';
                if (field.errors['email']) return 'Please enter a valid email address';
                if (field.errors['maxlength']) return 'Email is too long';
                if (field.errors['emailExists']) return 'This email is already registered';
                break;

            case 'password':
                if (field.errors['required']) return 'Password is required';
                if (field.errors['minlength']) return 'Password must be at least 8 characters';
                if (field.errors['weakPassword'])
                    return 'Password must contain at least 2 of: uppercase, lowercase, numbers, special characters';
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

        if (this.signUpForm.valid && !this.emailExists()) {
            const formData = this.signUpForm.value as SignUpRequest;

            this.authService.signUp(formData).subscribe({
                next: (response) => {
                    console.log('Sign up successful:', response);
                    // Navigate to questionnaire for new users
                    this.router.navigate(['/get-started']);
                },
                error: (error) => {
                    console.error('Sign up failed:', error);
                    // Error handling is done automatically by the auth service
                    // The error signal will be updated and the UI will react
                },
            });
        } else {
            // Mark all fields as touched to show validation errors
            this.markFormGroupTouched(this.signUpForm);
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
    get isEmailValid(): boolean {
        const emailControl = this.signUpForm.get('email');
        return !!(emailControl?.valid && !this.emailExists());
    }

    get canSubmit(): boolean {
        return (
            this.signUpForm.valid &&
            !this.emailExists() &&
            !this.emailChecking() &&
            !this.isLoading()
        );
    }
}