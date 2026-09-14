import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FinlyFieldComponent } from '../../../../shared/components/finly-field/finly-field.component';
import { FinlyButtonComponent } from '../../../../shared/components/finly-button/finly-button.component';

export interface LoginCredentials {
  email: string;
  password: string;
}

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FinlyFieldComponent, FinlyButtonComponent],
  template: `
    <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
      
      <app-finly-field label="Email" forId="email" icon="/Email-Icon.svg">
        <input type="email" id="email" formControlName="email" placeholder=" " />
      </app-finly-field>

      <app-finly-field label="Senha" forId="password" icon="/Password-icon.svg">
        <input type="password" id="password" formControlName="password" placeholder=" " />
      </app-finly-field>

      <div class="forgot-password">
        <a href="/forgot-password">Esqueceu a senha?</a>
      </div>

      <app-finly-button 
        type="submit" 
        [disabled]="loginForm.invalid" 
        [isLoading]="isLoading"
        loadingText="Entrando...">
        Login
      </app-finly-button>

    </form>
  `,
  styleUrl: './login-form.component.scss'
})
export class LoginFormComponent {
  @Input() isLoading = false;
  @Output() loginSubmit = new EventEmitter<LoginCredentials>();

  loginForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.loginSubmit.emit(this.loginForm.value);
    }
  }
}
