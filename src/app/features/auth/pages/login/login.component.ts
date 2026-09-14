import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/auth/auth.service';
import { LoginFormComponent, LoginCredentials } from '../../components/login-form/login-form.component';
import { ThemeToggleComponent } from '../../../../shared/components/theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, LoginFormComponent, RouterLink, ThemeToggleComponent],
  template: `
    <div class="login-page-container">
      <div class="illustration-section">
        <img class="illustration-img" src="/login-image.png" alt="Financial illustration" onerror="this.style.display='none'">
        <div class="logo">
          <h1><span class="welcome-text-hidden">Boas vindas ao </span><span class="brand-text">Finly</span></h1>
          <p>Finanças simples. Decisões melhores</p>
        </div>
      </div>
      
      <div class="form-section">
        <div class="theme-toggle-container">
          <app-theme-toggle></app-theme-toggle>
        </div>
        <div class="form-wrapper">
          <h2>Olá!</h2>
          <p class="subtitle">Tenha uma experiência simples no controle das suas finanças</p>
          
          <app-login-form 
            [isLoading]="isLoading" 
            (loginSubmit)="onLogin($event)">
          </app-login-form>
          
          <div class="register-link">
            Novo(a) no Finly? <a routerLink="/register">Comece aqui!</a>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrl: './login.component.scss'
})
export class LoginPageComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  
  isLoading = false;

  onLogin(credentials: LoginCredentials) {
    this.isLoading = true;
    this.authService.login(credentials.email, credentials.password).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (err: any) => {
        this.isLoading = false;
        console.error('Login failed', err);
      }
    });
  }
}
