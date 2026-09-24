import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FinlyFieldComponent } from '../../../../shared/components/finly-field/finly-field.component';
import { FinlyButtonComponent } from '../../../../shared/components/finly-button/finly-button.component';

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FinlyFieldComponent, FinlyButtonComponent],
  template: `
    <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
      
      <app-finly-field label="Nome" forId="name" icon="/User-icon.svg">
        <input type="text" id="name" formControlName="name" placeholder=" " />
      </app-finly-field>

      <app-finly-field label="Email" forId="email" icon="/Email-Icon.svg">
        <input type="email" id="email" formControlName="email" placeholder=" " />
      </app-finly-field>

      <app-finly-field label="Senha" forId="password" icon="/Password-icon.svg">
        <input [type]="showPassword ? 'text' : 'password'" id="password" formControlName="password" placeholder=" " />
        <button type="button" class="toggle-password" (click)="showPassword = !showPassword" tabindex="-1">
          <svg *ngIf="!showPassword" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
          <svg *ngIf="showPassword" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
            <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
            <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24"/>
            <line x1="1" y1="1" x2="23" y2="23"/>
          </svg>
        </button>
      </app-finly-field>

      <app-finly-button 
        type="submit" 
        [disabled]="registerForm.invalid" 
        [isLoading]="isLoading"
        loadingText="Cadastrando...">
        Cadastrar
      </app-finly-button>

    </form>
  `,
  styleUrl: './register-form.component.scss'
})
export class RegisterFormComponent {
  @Input() isLoading = false;
  @Output() registerSubmit = new EventEmitter<RegisterCredentials>();

  registerForm: FormGroup;
  showPassword = false;

  constructor(private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.registerSubmit.emit(this.registerForm.value);
    }
  }
}
