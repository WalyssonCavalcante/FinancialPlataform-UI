import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/auth/auth.service';
import { RegisterFormComponent, RegisterCredentials } from '../../components/register-form/register-form.component';
import { ThemeToggleComponent } from '../../../../shared/components/theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [RegisterFormComponent, RouterLink, ThemeToggleComponent],
  template: `
    <div class="register-page-container">
      
      <div class="form-section">
        <div class="theme-toggle-container">
          <app-theme-toggle [flipMoon]="true"></app-theme-toggle>
        </div>
        <div class="form-wrapper">
          <h2>Bem-vindo(a)</h2>
          <p class="subtitle">Tenha uma experiência simples no controle das suas finanças</p>
          
          <app-register-form 
            [isLoading]="isLoading" 
            (registerSubmit)="onRegister($event)">
          </app-register-form>
          
          <div class="login-link">
            Já possui conta? <a routerLink="/login">Entre aqui!</a>
          </div>
        </div>
      </div>

      <div class="illustration-section">
        <img class="illustration-img" src="/login-image.png" alt="Financial illustration" onerror="this.style.display='none'">
        <div class="logo">
          <h1><span class="welcome-text">Boas vindas ao </span><span class="brand-text">Finly</span></h1>
          <p>Finanças simples. Decisões melhores</p>
        </div>
      </div>

    </div>
  `,
  styleUrl: './register.component.scss'
})
export class RegisterPageComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  
  isLoading = false;

  onRegister(credentials: RegisterCredentials) {
    this.isLoading = true;
    // In a real app we would call authService.register(credentials.email, credentials.password)
    this.authService.login(credentials.email, credentials.password).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (err: any) => {
        this.isLoading = false;
        console.error('Registration failed', err);
      }
    });
  }
}
