import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
    selector: 'app-login-form',
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './form.component.html',
    styleUrl: './form.component.scss',
})
export class SignUpFormComponent implements OnInit {
    loginForm!: FormGroup;
    showPassword = false;
    isLoading = false;

    router = inject(Router);
    formBuilder = inject(FormBuilder);

    ngOnInit(): void {
        this.loginForm = this.formBuilder.group({
            firstName: ['', [Validators.required, Validators.minLength(2)]],
            lastName: ['', [Validators.required, Validators.minLength(2)]],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(8)]],
        });
    }

    isFieldInvalid(fieldName: string): boolean {
        const field = this.loginForm.get(fieldName);
        return !!(field && field.invalid && (field.dirty || field.touched));
    }

    togglePassword(): void {
        this.showPassword = !this.showPassword;
    }

    onSubmit(): void {
        if (this.loginForm.valid) {
            this.isLoading = true;
            // Simulate API call
            setTimeout(() => {
                console.log('Form submitted:', this.loginForm.value);
                this.isLoading = false;

                this.router.navigate(['/get-started']);
            }, 2000);
        } else {
            // Mark all fields as touched to show validation errors
            Object.keys(this.loginForm.controls).forEach((key) => {
                this.loginForm.get(key)?.markAsTouched();
            });
        }
    }
}
