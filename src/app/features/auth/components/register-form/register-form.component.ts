import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FinlyFieldComponent } from '../../../../shared/components/finly-field/finly-field.component';
import { FinlyButtonComponent } from '../../../../shared/components/finly-button/finly-button.component';

export interface RegisterCredentials {
  email: string;
  password: string;
}

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FinlyFieldComponent, FinlyButtonComponent],
  template: `
    <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
      
      <app-finly-field label="Email" forId="email" icon="/Email-Icon.svg">
        <input type="email" id="email" formControlName="email" placeholder=" " />
      </app-finly-field>

      <app-finly-field label="Senha" forId="password" icon="/Password-icon.svg">
        <input type="password" id="password" formControlName="password" placeholder=" " />
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

  constructor(private fb: FormBuilder) {
    this.registerForm = this.fb.group({
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
